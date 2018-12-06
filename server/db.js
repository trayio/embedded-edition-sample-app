// In-memory users instead of a DB:
const mockUserDB = [];

/**
 * Retreive user from the Mock DB:
 * @param {User} input - {username: 'myname', password: 'mypass'}
 * @returns {User | undefined}
 */
export const retrieveUserFromMockDB = input => {
    const matches = mockUserDB.filter(
        user =>
            user.username === input.username &&
            user.password === input.password
    );

    return matches[0];
};

/**
 * Check user exists in Mock DB:
 * @param {User} input
 * @returns {Boolean}
 */
export const userExistsInMockDB = input => {
    const matches = mockUserDB.filter(user => user.username === input.username);
    return matches.length > 0;
};

/**
 * Insert user into the Mock DB:
 * @param {User} input
 *
 * @returns {Void}
 */
export const insertUserToMockDB = input => {
    mockUserDB.push({
        name: input.body.name,
        uuid: input.uuid,
        trayId: input.trayId,
        username: input.body.username,
        password: input.body.password,
    });
};
