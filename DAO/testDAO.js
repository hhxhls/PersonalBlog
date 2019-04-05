const dbutils = require('./dbutils');

function test(success) {
    const querySql = "select * from  every_day;";
    const connection = dbutils.createSqlConnection();
    connection.connect();
    // connection.on('error', function (err) {
    //     console.log('db error', err);
    // });
    console.log(`before query`);
    connection.query(querySql, function (error, result) {
        if (error === null || error === undefined) {
            console.log(result);
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

module.exports.test = test;