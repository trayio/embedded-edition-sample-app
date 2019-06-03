// In-memory users instead of a DB:
var cacheManager = require('cache-manager');
var memoryCache = cacheManager.caching({
	store: 'memory',
	max: 1000,
	ttl: 43200 /*seconds*/,
});

/**
 * Retreive user from the Mock DB:
 * @param {User} input - {username: 'myname', password: 'mypass'}
 * @returns {User | undefined}
 */
export const retrieveUserFromMockDB = req => {
	return memoryCache.get(generateKey(req)).then(function(result) {
		return result;
	});
};

/**
 * Check user exists in Mock DB:
 * @param {User} input
 * @returns {Boolean}
 */
export const userExistsInMockDB = user => {
	return memoryCache.get(generateKey(user), function(err, result) {
		return result ? 1 : 0;
	});
};

const generateKey = input => {
	return input.token + input.username;
};

/**
 * Insert user into the Mock DB:
 * @param {User} input
 *
 * @returns {Void}
 */
export const insertUserToMockDB = user => {
	memoryCache.set(
		generateKey(user),
		{
			name: user.name,
			uuid: user.uuid,
			trayId: user.trayId,
			username: user.username,
			password: user.password,
		},
		function(err) {
			if (err) {
				throw err;
			}
		}
	);
};
