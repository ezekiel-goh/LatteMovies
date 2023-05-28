const { getConnection } = require('./databaseConnection');
const { SqlLiteErrorCodes, DuplicateEntryError, NotFoundError } = require('./errors.js');

module.exports.getUser = function getUser(UserID) {
    const connection = getConnection();
    return connection.get('SELECT * FROM User WHERE UserID = ?', [UserID]).then((User) => {
        if (!User) throw new NotFoundError(`User ${UserID}`);
        return User;
    });
};

module.exports.addUser = function addUser(UserID, Username, Password, Role) {
    const connection = getConnection();
    return connection
        .run('INSERT INTO User (Username, Password, Role) VALUES (?, ?, Role)', [Username, Password, Role])
        .then(() => {
            if (Role === 'Customer') {
                connection
                    .run('INSERT INTO Customer (UserID, Username, MoviesBought) VALUES (?, ?, 0)', [UserID, Username])
                    .then(() => {
                        return;
                    })
                    .catch((error) => {
                        if (error.errno === SqlLiteErrorCodes.SQLITE_CONSTRAINT) throw new DuplicateEntryError(`User ${Username}`);
                    });
            }
            if (Role === 'Publisher') {
                connection
                .run('INSERT INTO Publisher (UserID, Username, MoviesCreated) VALUES (?, ?, 0)', [UserID, Username])
                .then(() => {
                    return;
                })
                .catch((error) => {
                    if (error.errno === SqlLiteErrorCodes.SQLITE_CONSTRAINT) throw new DuplicateEntryError(`User ${Username}`);
                });
            }
        })
        .catch((error) => {
            if (error.errno === SqlLiteErrorCodes.SQLITE_CONSTRAINT) throw new DuplicateEntryError(`User ${Username}`);
        });
};

module.exports.updateUser = function updateUser(UserID, Password) {
    const connection = getConnection();
    return connection.run('UPDATE User SET Password = ? WHERE UserID = ?', [Password, UserID]).then((response) => {
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
