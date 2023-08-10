const { query } = require('../database');
const { TABLE_ALREADY_EXISTS_ERROR, EMPTY_RESULT_ERROR,
    DUPLICATE_ENTRY_ERROR, MYSQL_ERROR_CODE,
    NOT_FOUND_ERROR } = require('../errors.js');

module.exports.getUserInfo = async function getUserInfo(UserID) {
    //    const connection = getConnection();
    const User = await query('SELECT UserID, Username, Password, Role, DateJoined FROM User WHERE UserID = ?', [UserID]);
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
        await query('INSERT INTO Customer(UserID, Username, TotalSpent) ' +
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

// general login function
module.exports.login = function login(username, password) {
    return query(
        'SELECT UserID, Username, Role FROM User WHERE Username = ? and Password = ?',
        [username, password],
    ).then((user) => { return user[0][0]; });
}

// Customer Purchases a Movie
module.exports.buyMovie = async function buyMovie(MovieID, CustomerID) {
    await query('UPDATE Customer SET TotalSpent = TotalSpent + ' +
        '(SELECT IFNULL(Price, 0) FROM Movies WHERE id = ?) ' +
        'where CustomerID = ?', [MovieID, CustomerID])
        .then(() => {
            return;
        })
        .catch(() => {
            throw new EMPTY_RESULT_ERROR(`Movie ${MovieID}, Customer ${CustomerID}`);
        });
}

module.exports.getPurchase = async function getPurchase(UserID) {
    //    const connection = getConnection();
    const Purchase = await query(`select 
        M.title, M.Price, M.release_date, M.runtime, P.DateBought
        from 
        Purchase P, Movies M, User U
        where P.MovieID = M.id
        and P.UserID = U.UserID
        and U.UserID = ?`, [UserID]);
    return Purchase;
};

module.exports.getReviewByUser = async function getReviewByUser(UserID) {
    //    const connection = getConnection();
    const Review = await query(`
    select
    M.title, M.release_date, R.Rating, R.Comments
    from
    Movies M, Reviews R, User U
    where
    M.id = R.MovieID and
    R.UserID = U.UserID
    and U.UserID = ?`, [UserID]);
    return Review;
};

module.exports.getFavouriteByUser = async function getFavouriteByUser(UserID) {
    const Favourite = await query(`
    select
    M.title, M.release_date, M.runtime, M.Price 
    from
    Movies M, Favourites F, User U
    where
    M.id = F.id and
    F.UserID = U.UserID
    and U.UserID = ?`, [UserID]);
    return Favourite;
}