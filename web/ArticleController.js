// set controller for path '/editEveryday'
const url = require('url');
const articleDAO = require('../DAO/articleDAO');
const tagsDAO = require('../DAO/tagsDAO');
const tagBlogMappingDAO = require('../DAO/tagBlogMappingDAO');
const timeUtil = require('../utils/timeUtil');
const resUtil = require('../utils/resUtil');
const path = new Map();

function editArticle(request,response){
    request.on('data',function(data){
        const parseData = JSON.parse(data.toString().replace(/[\r\n]/gmi,""));
        // trim all blanks, replace chinese comma mark into english comma mark
        const tags = parseData.tags.replace(/ /g,'').replace('，',',');
        // identify if there is valid ctime/utime for this article, if no, give current time value
        const ctime = parseData.ctime || timeUtil.getNow();
        const utime = parseData.utime || timeUtil.getNow();

        articleDAO.insertArticle(parseData.title,parseData.content,tags,parseData.views ,ctime,utime,function (result) {
            response.writeHead(200);
            response.write(resUtil.writeResult('success','successfully added article',result));
            response.end();
            /*
               send queries all tagId, for each tag ID, if it existed in database, insert mapping of this blog with
               the tag into tag_blog_mapping table. if it not exist yet, insert a new tag into tags table,
               then doing tagId_blog_id
            */
            const blogId = result.insertId;
            const tagList = tags.split(',');
            tagList.forEach((ele)=>{
                if(ele === ''){
                //  if the tag is empty, ignore it
                }else{
                    _queryTag(ele,blogId)
                }
            })
        });
    })
}

function queryArticleByPage(request,response){
    const params = url.parse(request.url,true).query;
    articleDAO.queryArticleByPage(parseInt(params.page),parseInt(params.pageSize),function (result) {
        response.writeHead(200);
        response.write(resUtil.writeResult('success','successfully acquired article by page',result));
        response.end();
    });
}

function queryArticleByTag(request,response){
    const params = url.parse(request.url,true).query;
    articleDAO.queryArticleByTag(parseInt(params.page),parseInt(params.pageSize),parseInt(params.tagId),function (result) {
        response.writeHead(200);
        response.write(resUtil.writeResult('success','successfully acquired article by tag',result));
        response.end();
    });
}


function queryArticleCount(request,response){
    articleDAO.queryArticleCount(function (result) {
        response.writeHead(200);
        response.write(resUtil.writeResult('success','successfully acquired article count',result));
        response.end();
    });
}
function queryArticleCountWithTag(request,response){
    const params = url.parse(request.url,true).query;
    articleDAO.queryArticleCountWithTag(parseInt(params.tagId),function (result) {
        response.writeHead(200);
        response.write(resUtil.writeResult('success','successfully acquired article count',result));
        response.end();
    });
}

function queryArticleById(request,response){
    const params = url.parse(request.url,true).query;
    articleDAO.queryArticleById(parseInt(params.aid),function (result) {
        response.writeHead(200);
        response.write(resUtil.writeResult('success','successfully acquired article',result));
        response.end();
    });
}

function queryHotArticle(request,response){
    const params = url.parse(request.url,true).query;
    articleDAO.queryHotArticle(parseInt(params.limit),function(result){
        response.writeHead(200);
        response.write(resUtil.writeResult('success','',result));
        response.end();
    })
}

function searchArticle(request,response){
    const params = url.parse(request.url,true).query;
    const key = decodeURIComponent(params.key);
    articleDAO.searchArticle(parseInt(params.page),parseInt(params.pageSize),key,function (result) {
        response.writeHead(200);
        response.write(resUtil.writeResult('success','successfully acquired search article',result));
        response.end();
    });
}

function searchArticleCount(request,response){
    const params = url.parse(request.url,true).query;
    const key = decodeURIComponent(params.key);
    articleDAO.searchArticleCount(key,function (result) {
        response.writeHead(200);
        response.write(resUtil.writeResult('success','successfully acquired search article count',result));
        response.end();
    });
}

function updateArticleView(request,response) {
    request.on('data',function(data){
        console.log(data.toString());
        const parseData = JSON.parse(data.toString());
        articleDAO.updateArticleView(parseData.aid,parseData.views,function (result) {
            response.writeHead(200);
            response.write(resUtil.writeResult('success','successfully updated article views',parseData.aid));
            response.end()
        })
    })
}



// for business logic use only, no responds to client
function _queryTag(tag,blogId){
    tagsDAO.queryTag(tag,function (result) {
        if(result === null || result === undefined || result.length === 0){
            _insertTag(tag,blogId);
        }else{
            _insertTagBlogMapping(result[0].id,blogId);
        }
    })
}

function _insertTag(tag,blogId){
    tagsDAO.insertTag(tag,timeUtil.getNow(),timeUtil.getNow(),function (result) {
        _insertTagBlogMapping(result.insertId,blogId)
    })
}

function _insertTagBlogMapping(tagId,blogId){
    tagBlogMappingDAO.insertTagBlogMapping(tagId,blogId,timeUtil.getNow(),timeUtil.getNow(),function (result) {

    })
}

path.set('/edit_article',editArticle);
path.set('/query_article_by_page',queryArticleByPage);
path.set('/query_article_count',queryArticleCount);
path.set('/query_article_count_with_tag',queryArticleCountWithTag);
path.set('/query_article_by_id',queryArticleById);
path.set('/query_hot_article',queryHotArticle);
path.set('/update_article_views',updateArticleView);
path.set('/query_article_by_tag',queryArticleByTag);
path.set('/search_article',searchArticle);
path.set('/search_article_count',searchArticleCount);


module.exports.path = path;
