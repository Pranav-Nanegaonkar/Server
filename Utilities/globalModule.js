const pool = require('./dbConfig');

// Execute Query without parameters
exports.executeQuery = function (query, supportKey, callback) {
    try {
        pool.getConnection(function (error, connection) {
            if (error) {
                console.log(error);
                callback(error, null);
            } else {
                connection.query(query, function (error, results) {
                    connection.release();
                    if (error) {
                        console.log(error);
                        callback(error, null);
                    } else {
                        callback(null, results);
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
        callback(error, null);
    }
};

// Execute Query with parameters
exports.executeQueryData = function (query, data, supportKey, callback) {
    try {
        pool.getConnection(function (error, connection) {
            if (error) {
                console.log(error);
                callback(error, null);
            } else {
                connection.query(query, data, function (error, results) {
                    connection.release();
                    if (error) {
                        console.log(error);
                        callback(error, null);
                    } else {
                        callback(null, results);
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
        callback(error, null);
    }
};

// Get System Date
exports.getSystemDate = function () {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var hh = String(today.getHours()).padStart(2, '0');
    var min = String(today.getMinutes()).padStart(2, '0');
    var ss = String(today.getSeconds()).padStart(2, '0');

    today = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
    return today;
}
