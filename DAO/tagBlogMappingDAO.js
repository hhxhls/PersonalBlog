const dbutils = require('./dbutils');

function insertTagBlogMapping(tagId, blogId, ctime, utime, success) {
    const insertSql = "insert into tag_blog_mapping(`tag_id` , `blog_id`,`ctime`, `utime`) values(? ,? ,?, ?)";
    const params = [tagId, blogId, ctime, utime];
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

function queryTagBlogMapping(tag, success) {
    // const insertSql = "select * from tags where tags = ?:";
    // const params = [tag];
    // const connection = dbutils.createSqlConnection();
    // connection.connect();
    // connection.query(insertSql, params, function (error, result) {
    //     if (error === null || error === undefined) {
    //         success(result);
    //     } else {
    //         console.log(error);
    //     }
    // });
    // connection.end();
}

module.exports.insertTagBlogMapping = insertTagBlogMapping;
// module.exports.queryTag = queryTagBlogMapping;