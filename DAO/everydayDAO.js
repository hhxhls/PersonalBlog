const dbutils = require('./dbutils');

function insertEveryDay(content, ctime, author, success) {
    const insertSql = "insert into every_day(`content` , `ctime`, `author`) values(? ,? ,?)";
    const params = [content, ctime, author];
    const connection = dbutils.createSqlConnection();
    connection.connect();
    connection.query(insertSql, params, function (error, result) {
        if (error === null || error === undefined) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function queryEveryDay(success){
    const querySql = "select * from every_day order by id desc limit 1";
    const connection = dbutils.createSqlConnection();
    connection.connect();
    connection.query(querySql, function (error, result) {
        if (error === null || error === undefined) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

module.exports.insertEveryDay = insertEveryDay;
module.exports.queryEveryDay = queryEveryDay;