const dbutils = require('./dbutils');

function insertArticle(title, content, tags, views, ctime, utime, success) {
    const insertSql = "insert into blog(`title` , `content`, `tags`,`views`,`ctime`,`utime`) values(?,?,?,?,?,?)";
    const params = [title, content, tags, views, ctime, utime];
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

function queryArticleByPage(page,pageSize,success) {
    const querySql = "select * from blog order by id desc limit ? , ?";
    const connection = dbutils.createSqlConnection();
    const params = [page * pageSize,pageSize];
    connection.connect();
    connection.query(querySql,params, function (error, result) {
        if (error === null || error === undefined) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function queryArticleByTag(page,pageSize,tagId,success) {
    const querySql = "select * from blog b where b.id in (select blog_id from tag_blog_mapping a where a.tag_id = ?) limit ? , ?";
    const connection = dbutils.createSqlConnection();
    const params = [tagId,page * pageSize,pageSize];
    connection.connect();
    connection.query(querySql,params, function (error, result) {
        if (error === null || error === undefined) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function searchArticle(page,pageSize,key,success) {
    const querySql = "select * from blog where title like ? limit ?,?";
    const connection = dbutils.createSqlConnection();
    const params = ['%'+key+'%',page * pageSize,pageSize];
    connection.connect();
    connection.query(querySql,params, function (error, result) {
        if (error === null || error === undefined) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function queryArticleById(aid,success) {
    const querySql = "select * from blog where id = ?";
    const connection = dbutils.createSqlConnection();
    const params = [aid];
    connection.connect();
    connection.query(querySql,params, function (error, result) {
        if (error === null || error === undefined) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}


function queryArticleCount(success){
    const querySql = "select count(*) as count from blog";
    const connection = dbutils.createSqlConnection();
    connection.connect();
    connection.query(querySql, function (error, result) {
        if (error === null || error === undefined) {
            success(result);
        } else {
            console.log(error);
        }
    });
}

function queryArticleCountWithTag(tagId,success){
    const querySql = "select count(*) as count from blog b where b.id in (select blog_id from tag_blog_mapping a where a.tag_id = ?)";
    const connection = dbutils.createSqlConnection();
    const params = [tagId];
    connection.connect();
    connection.query(querySql,params, function (error, result) {
        if (error === null || error === undefined) {
            success(result);
        } else {
            console.log(error);
        }
    });
}

function searchArticleCount(key,success){
    const querySql = "select count(*) as count from blog where title like ?";
    const connection = dbutils.createSqlConnection();
    const params = ['%'+key+'%'];
    connection.connect();
    connection.query(querySql,params, function (error, result) {
        if (error === null || error === undefined) {
            success(result);
        } else {
            console.log(error);
        }
    });
}

function queryHotArticle(limit,success){
    const querysql = 'select * from blog order by views desc limit 0, ?';
    const params = [limit];
    const connection = dbutils.createSqlConnection();
    connection.connect();
    connection.query(querysql,params,function(error,result){
        if(error === null || error === undefined){
            success(result);
        }else{
            console.log(error)
        }
    })
}

function updateArticleView(aid,currentView,success){
    console.log(aid,currentView);
    const querysql = 'update `blog` set views = ? where id = ?';
    const afterView = currentView + 1;
    const params = [afterView,aid]
    const connection = dbutils.createSqlConnection();
    connection.connect();
    connection.query(querysql,params,function (error,result) {
        if(error === null || error === undefined){
            success(result)
        }else{
            console.log(error);
        }
    })
}

module.exports.insertArticle = insertArticle;
module.exports.queryArticleByPage = queryArticleByPage;
module.exports.queryArticleById = queryArticleById;
module.exports.queryArticleCount = queryArticleCount;
module.exports.queryArticleCountWithTag = queryArticleCountWithTag;
module.exports.queryHotArticle = queryHotArticle;
module.exports.updateArticleView = updateArticleView;
module.exports.queryArticleByTag = queryArticleByTag;
module.exports.searchArticle = searchArticle;
module.exports.searchArticleCount = searchArticleCount;
