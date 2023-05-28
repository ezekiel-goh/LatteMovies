const { getConnection } = require('./databaseConnection');
const { SqlLiteErrorCodes, DuplicateEntryError, NotFoundError } = require('./errors.js');

module.exports.getUser = function getUser(UserID) {
    const connection = getConnection();
    return connection.get('SELECT * FROM User WHERE UserID = ?', [UserID]).then((User) => {
        if (!User) throw new NotFoundError(`User ${UserID}`);
        return User;
    });
};

module.exports.addUser = function addUser(username, password) {
    const connection = getConnection();
    return connection
        .run('INSERT INTO User (Username, Password, MoviesBought) VALUES (?, ?, 0)', [username, password])
        .then(() => {
            return;
        })
        .catch((error) => {
            if (error.errno === SqlLiteErrorCodes.SQLITE_CONSTRAINT) throw new DuplicateEntryError(`User ${UserID}`);
        });
};

module.exports.updateUser = function updateUser(UserID, name) {
    const connection = getConnection();
    return connection.run('UPDATE User SET name = ? WHERE UserID = ?', [name, UserID]).then((response) => {
        if (!response.changes) throw new NotFoundError(`User ${UserID}`);
        return;
    });
};

module.exports.deleteUser = function deleteUser(UserID) {
    const connection = getConnection();
    return connection.run('DELETE FROM User WHERE UserID = ?', [UserID]).then((response) => {
        if (!response.changes) throw new NotFoundError(`User ${UserID}`);
        return;
    });
};
