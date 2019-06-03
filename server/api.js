import { log } from './logging';
import { mutations, queries } from './graphql';
import { get, map, values } from 'lodash';
import { parseHeaders } from './domain/parseHeaders';

// Get nodes for a given path from graphQL response:
function getNodesAt(results, path) {
	return map(values(get(results, path)), x => x.node);
}

const solutionPath = `${process.env.TRAY_APP_URL}/external/solutions/${
	process.env.TRAY_PARTNER
}`;
const templatePath = `${process.env.TRAY_APP_URL}/external/configure/${
	process.env.TRAY_PARTNER
}`;

module.exports = function(app) {
	// GET Account:
	app.get('/api/me', (req, res) => {
		let headers = parseHeaders(req);
		console.log('Headers: ');
		console.log(headers);
		queries
			.me(headers.access_token)
			.then(results => res.status(200).send(results.data.viewer.details))
			.catch(err => res.status(500).send(err));
	});

	// GET Solutions:
	app.get('/api/solutions', (req, res) => {
		let headers = parseHeaders(req);
		queries
			.solutions(headers.master_token)
			.then(results => {
				res.status(200).send({
					data: getNodesAt(results, 'data.viewer.solutions.edges'),
				});
			})
			.catch(err => res.status(500).send(err));
	});

	// GET Solution Instances:
	app.get('/api/solutionInstances', (req, res) => {
		let headers = parseHeaders(req);

		if (!headers.access_token) {
			res.status(500).send('Missing external user auth');
		}

		queries
			.solutionInstances(headers.access_token)
			.then(results => {
				res.status(200).send({
					data: getNodesAt(
						results,
						'data.viewer.solutionInstances.edges'
					),
				});
			})
			.catch(err => res.status(500).send(err));
	});

	// POST Solution Instances
	app.post('/api/solutionInstances', (req, res) => {
		let headers = parseHeaders(req);
		mutations
			.createSolutionInstance(
				headers.access_token,
				req.body.id,
				req.body.name
			)
			.then(solutionInstance => {
				return mutations
					.getGrantTokenForUser(
						headers.tray_id,
						undefined,
						headers.master_token
					)
					.then(({ payload }) => {
						const solutionInstanceId =
							solutionInstance.data.createSolutionInstance
								.solutionInstance.id;
						const authorizationCode =
							payload.data.generateAuthorizationCode
								.authorizationCode;
						res.status(200).send({
							data: {
								popupUrl: `${solutionPath}/configure/${solutionInstanceId}?code=${authorizationCode}`,
							},
						});
					});
			})
			.catch(err => {
				res.status(500).send(err);
			});
	});

	// PATCH solution instance:
	app.patch('/api/solutionInstance/:solutionInstanceId', (req, res) => {
		let headers = parseHeaders(req);
		mutations
			.updateSolutionInstance(
				headers.access_token,
				req.params.solutionInstanceId,
				req.body.enabled
			)
			.then(() => res.sendStatus(200))
			.catch(err => res.status(500).send({ err }));
	});

	// PATCH Solution Instance configuration:
	app.patch(
		'/api/solutionInstance/:solutionInstanceId/config',
		(req, res) => {
			let headers = parseHeaders(req);
			mutations
				.getGrantTokenForUser(
					headers.tray_id,
					req.params.solutionInstanceId,
					headers.master_token
				)
				.then(({ payload }) => {
					const authorizationCode =
						payload.data.generateAuthorizationCode
							.authorizationCode;
					res.status(200).send({
						data: {
							popupUrl: `${solutionPath}/configure/${
								req.params.solutionInstanceId
							}?code=${authorizationCode}`,
						},
					});
				})
				.catch(err => res.status(500).send({ err }));
		}
	);

	// DELETE Solution Instance:
	app.delete('/api/solutionInstance/:solutionInstanceId', (req, res) => {
		let headers = parseHeaders(req);
		mutations
			.deleteSolutionInstance(
				headers.access_token,
				req.params.solutionInstanceId
			)
			.then(() => res.sendStatus(200))
			.catch(err => res.status(500).send({ err }));
	});
};
