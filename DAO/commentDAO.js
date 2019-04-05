const dbutils = require('./dbutils');

function postComment(blogId, username, email, comments, parent, parentName, ctime, utime, success) {
    const insertSql = "insert into comments(`blog_id`, `username`, `email`, `comments`,`parent`,`parent_name`,`ctime`, `utime`) values(?,?,?,?,?,?,?,?)";
    const params = [blogId, username, email, comments, parent, parentName, ctime, utime];
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

function queryCommentList(aid, page, pageSize, success) {
    const querysql = "select * from comments where blog_id = ? order by id desc limit ? , ?";
    const params = [aid, page * pageSize, pageSize];
    const connection = dbutils.createSqlConnection();
    connection.connect();
    connection.query(querysql, params, function (error, result) {
        if (error === null || error === undefined) {
            success(result);
        } else {
            console.log(error);
        }
    })
}

function queryCommentCount(aid, success) {
    const querysql = "select count(*) as count from comments where blog_id = ?";
    const params = [aid];
    const connection = dbutils.createSqlConnection();
    connection.connect();
    connection.query(querysql, params, function (error, result) {
        if (error === null || error === undefined) {
            success(result);
        } else {
            console.log(error);
        }
    })
}

function queryNewComment(limit,success){
    const querysql = 'select * from comments order by id desc limit 0,?';
    const params = [limit];
    const connection = dbutils.createSqlConnection();
    connection.connect();
    connection.query(querysql,params,function (error,result) {
        if(error === null || error === undefined){
            success(result);
        }else{
            console.log(error)
        }
    })
}

module.exports.postComment = postComment;
module.exports.queryCommentList = queryCommentList;
module.exports.queryCommentCount = queryCommentCount;
module.exports.queryNewComment = queryNewComment;