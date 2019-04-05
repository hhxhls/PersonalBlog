const url = require('url');
const captcha = require('svg-captcha');
const commentDAO = require('../DAO/commentDAO');
const timeUtil = require('../utils/timeUtil');
const resUtil = require('../utils/resUtil');
const path = new Map();

function postComment(request, response) {
    console.log('controller');
    request.on('data', function (data) {
        const parseData = JSON.parse(data.toString()).data;
        console.log(parseData);
        const ctime = timeUtil.getNow();
        const utime = timeUtil.getNow();

        commentDAO.postComment(parseData.aid, parseData.nickname, parseData.email, parseData.content, parseData.parent, parseData.parentName, ctime, utime, function (result) {
            response.writeHead(200);
            response.write(resUtil.writeResult('success', 'successfully added comment', JSON.stringify(parseData)));
            response.end();
        });
    })
}

function queryRandomCaptcha(request, response) {
    const img = captcha.create({
        fontSize: 50,
        width: 100,
        height: 33,
    });
    response.writeHead(200);
    response.write(resUtil.writeResult('success', 'provide captcha', img));
    response.end();
}

function queryCommentList(request, response) {
    const params = url.parse(request.url, true).query;
    commentDAO.queryCommentList(parseInt(params.aid), params.page, parseInt(params.pageSize), function (result) {
        response.writeHead(200);
        response.write(resUtil.writeResult('success', 'successfully queried comment list', result));
        response.end();
    })
}

function queryCommentCount(request, response) {
    const params = url.parse(request.url, true).query;
    commentDAO.queryCommentCount(params.aid, function (result) {
        response.writeHead(200);
        response.write(resUtil.writeResult('success', 'successfully acquired everyday sentence', result));
        response.end();
    });
}

function queryNewComment(request,response){
    const params = url.parse(request.url,true).query;
    commentDAO.queryNewComment(parseInt(params.limit),function(result){
        response.writeHead(200);
        response.write(resUtil.writeResult('success','successfully acquired new comment',result));
        response.end();
    })

}

path.set('/post_comment', postComment);
path.set('/query_random_captcha', queryRandomCaptcha);
path.set('/query_comment_list', queryCommentList);
path.set('/query_comment_count', queryCommentCount);
path.set('/query_new_comment', queryNewComment);

module.exports.path = path;
