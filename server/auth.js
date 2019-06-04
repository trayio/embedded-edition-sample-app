import { log } from './logging';
import { get } from 'lodash';
import { parseHeaders } from './domain/parseHeaders';

import { attemptLogin, generateUserAccessToken } from './domain/login';

import {
	checkUserExists,
	generateNewUser,
	validateRequest,
} from './domain/registration';

const parseRequest = req => {
	return {
		name: req.body.name,
		username: req.body.username,
		password: req.body.password,
	};
};

module.exports = function(app) {
	// Authenticate all endpoints except the auth endpoints defined in this module
	app.use(function(req, res, next) {
		if (req.url === '/api/health') {
			return res.status(200).send();
		}
		let headers = parseHeaders(req);
		console.log(headers);
		// check for headers
		if (headers.master_token) {
			return next();
		} else {
			return res.status(401).send({ error: 'Master token not found' });
		}
	});

	/*
	 * /api/login:
	 * Attempt to retrieve user from DB, if not found respond with 401 status.
	 * Otherwise attempt to generate a tray access token and set user info onto
	 * session.
	 */
	app.post('/api/login', function(req, res) {
		let headers = parseHeaders(req);
		req = parseRequest(req);

		attemptLogin(req).then(function(user) {
			if (user && (!user.uuid || !user.trayId)) {
				res.status(500).send({
					error: `Unable to login. User "${
						user.username
					}" found locally is missing one or more of following required fields: uuid, trayId`,
				});
			} else if (user) {
				log({
					message: 'Logged in with:',
					object: user,
				});
				// Attempt to generate the external user token and save to session:
				generateUserAccessToken(req, res, user, headers.master_token)
					.then(userAccessToken =>
						res.status(200).send({
							userAccessToken: userAccessToken,
							userUUID: user.uuid,
							userTrayID: user.trayId,
						})
					)
					.catch(err => {
						log({
							message: 'Failed to generate user access token',
							object: err,
						});

						let errorCode = get(err, 'networkError.statusCode');
						if (errorCode == 401 || 403) {
							res.status(errorCode).send({
								error:
									'Invalid master token. Please check that you have entered it correctly!',
							});
						} else {
							res.status(500).send({
								error: 'Failed to generate user access token',
							});
						}
					});
			} else {
				log({ message: 'Login failed for user:', object: req });
				res.status(401).send({
					error:
						'Could not find user Keep in mind users in the Demo app stores are cleared periodically',
				});
			}
		});
	});

	/*
	 * /api/register:
	 * Check if user already exists, if so respond with 409 status.
	 * Validate request body, if not valid respond with 400 status.
	 * Otherwise attempt to generate a tray user and insert new user object into
	 * the DB.
	 */
	app.post('/api/register', function(req, res) {
		let headers = parseHeaders(req);
		req = parseRequest(req);

		if (checkUserExists(req)) {
			log({
				message: 'Failed to create user, already exists:',
				object: req,
			});
			return res
				.status(409)
				.send(`User name ${req.username} already exists`);
		}

		const validation = validateRequest(req);

		if (!validation.valid) {
			const errorMsg = `The following params missing in user object, [${validation.errors.join(
				', '
			)}]`;
			log({ message: errorMsg });
			return res.status(400).send(errorMsg);
		}

		generateNewUser(req, headers.master_token)
			.then(user => {
				log({
					message: `successfully created user ${req.username}`,
					object: user,
				});
				return res.status(200).send(user);
			})
			.catch(err => {
				log({
					message:
						'There was an error creating the external Tray user:',
					object: err,
				});

				let errorCode = get(err, 'networkError.statusCode');
				if (errorCode == 401 || 403) {
					res.status(errorCode).send({
						error:
							'Invalid master token. Please check that you have entered it correctly!',
					});
				} else {
					res.status(500).send({
						error:
							'There was an error creating the external Tray user:',
					});
				}
			});
	});

	/*
	 * /api/logout:
	 * Remove session data.
	 */
	app.post('/api/logout', function(req, res) {
		req.session.destroy();
		res.sendStatus(200);
	});
};
