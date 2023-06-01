const { query } = require('../database');
const { TABLE_ALREADY_EXISTS_ERROR, EMPTY_RESULT_ERROR,
    DUPLICATE_ENTRY_ERROR, MYSQL_ERROR_CODE,
    NOT_FOUND_ERROR } = require('../errors.js');

module.exports.getUserInfo = async function getUserInfo(UserID) {
    //    const connection = getConnection();
    const User = await query('SELECT UserID, Username, Password, Role FROM User WHERE UserID = ?', [UserID]);
    return User;
};

module.exports.addUser = async function addUser(Username, Password, Role) {
    //    const connection = getConnection();
    try {
        await query('INSERT INTO User (Username, Password, Role) VALUES (?, ?, ?)', [Username, Password, Role])
            .then(() => {
                return;
            });
    } catch (error) {
        if (error.errno === MYSQL_ERROR_CODE.DUPLICATE_ENTRY) {
            throw new DUPLICATE_ENTRY_ERROR(`User ${Username}`);
        }
    }
}

module.exports.addCustomer = async function addCustomer(Username) {
    try {
        await query('INSERT INTO Customer(UserID, Username, MoviesBought) ' +
            'VALUES ( ( SELECT UserID FROM User WHERE UserID = LAST_INSERT_ID() ), ?, 0);', [Username])
            .then(() => {
                return;
            });
    }
    catch (error) {
        if (error) {
            console.log(error);
            return;
        }
    }
}

module.exports.addPublisher = async function addPublisher(Username) {
    try {
        await query('INSERT INTO Publisher(UserID, Username, MoviesCreated) ' +
            'VALUES ( ( SELECT UserID FROM User WHERE UserID = LAST_INSERT_ID() ), ?, 0);', [Username])
            .then(() => {
                return;
            });
    }
    catch (error) {
        if (error) {
            console.log(error);
            return;
        }
    }
}

module.exports.updateUserInfo = async function updateUserInfo(UserID, Password) {
    //    const connection = getConnection();
    try {
        await query('UPDATE User SET Password = ? WHERE UserID = ?', [Password, UserID]);
    } catch (error) {
        if (Password === null || Password === undefined) {
            throw new EMPTY_RESULT_ERROR(`User ${UserID}`);
        }
    }
    return;
};

module.exports.deleteUserCustomer = async function deleteUserCustomer(UserID) {
    //    const connection = getConnection();
    try {
        await query('DELETE U, C FROM User U INNER JOIN Customer C ' +
            'ON U.UserID = C.UserID ' +
            'WHERE U.UserID  = ?', [UserID]);
    } catch (error) {
        if (!UserID) {
            throw new NOT_FOUND_ERROR(`User ${UserID}`)
        }
    }
    return;
};

module.exports.deleteUserPublisher = async function deleteUserPublisher(UserID) {
    //    const connection = getConnection();
    try {
        await query('DELETE U, P FORM User U INNER JOIN Publisher P ' +
            'ON U.UserID = P.UserID ' +
            'WHERE U.UserID  = ?', [UserID]);
    } catch (error) {
        if (!UserID) {
            throw new NOT_FOUND_ERROR(`User ${UserID}`);
        }
    }
    return;
};

module.exports.userLogin = async function userLogin(Username, Password) {
    const User = await query('SELECT Username, Password FROM User WHERE Username = ? and Password = ?',
        [Username, Password])
        .then(() => {
            return User;
        })
        .catch((error) => {
            if (error) {
                throw new NOT_FOUND_ERROR(`Incorrect Username or Password.`);
            }
        });
}