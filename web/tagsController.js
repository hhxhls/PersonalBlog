const url = require('url');
const tagsDAO = require('../DAO/tagsDAO');
// const timeUtil = require('../utils/timeUtil');
const resUtil = require('../utils/resUtil');
const path = new Map();


function queryRandomTags(request,response){
    //因为没有数据传输,所以不用绑ondata
    const params = url.parse(request.url,true).query;
    tagsDAO.queryRandomTags(parseInt(params.limit),function (result) {
        response.writeHead(200);
        response.write(resUtil.writeResult('success','successfully acquired random tags',result));
        response.end();
    });
}


path.set('/query_random_tags',queryRandomTags);

module.exports.path = path;

