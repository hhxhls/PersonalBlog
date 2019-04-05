const dbutils = require('./dbutils');

function insertTag(tag, ctime, utime, success) {
    const insertSql = "insert into tags(`tag` , `ctime`, `utime`) values(? ,? ,?)";
    const params = [tag, ctime, utime];
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

function queryTag(tag, success) {
    const insertSql = "select * from tags where tag = ?;";
    const params = [tag];
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

function queryRandomTags(limit,success){
    const querysql = 'select * from tags order by rand() limit ?';
    const params = [limit];
    const connection = dbutils.createSqlConnection();
    connection.query(querysql, params, function (error, result) {
        if (error === null || error === undefined) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

module.exports.insertTag = insertTag;
module.exports.queryTag = queryTag;
module.exports.queryRandomTags = queryRandomTags;