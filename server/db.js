// In-memory users instead of a DB:
const mockUserDB = [
    {
        username: "amy",
        name: "Amy Tang",
        uuid: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
        trayId: "da774c77-abd7-4161-8e47-f5f67da81808",
        password: "amyspassword",
    },
];

/**
 * Retreive user from the Mock DB:
 * @param input - {username: 'myname', password: 'mypass'}
 *
 * @returns - the found user object or undefined if not found
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
 * @param input - {username: 'myname', password: 'mypass'}
 *
 * @returns - if there is a match for the input user
 */
export const userExistsInMockDB = input => {
    const matches = mockUserDB.filter(user => user.username === input.username);
    return matches.length > 0;
};

/**
 * Insert user into the Mock DB:
 * @param user - {username: 'myname', password: 'mypass'}
 *
 * @void
 */
export const insertUserToMockDB = user => {
    mockUserDB.push(user);
};
