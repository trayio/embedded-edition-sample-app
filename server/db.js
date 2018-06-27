// In-memory users instead of a DB:
const mockUserDB = [
    {
        name: "Amy Tang",
        uuid: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
        trayId: "da774c77-abd7-4161-8e47-f5f67da81808",
        username: "amy",
        password: "amyspassword",
    },
];

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
