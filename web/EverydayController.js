// set controller for path '/editEveryday'
const everydayDAO = require('../DAO/everydayDAO');
const timeUtil = require('../utils/timeUtil');
const resUtil = require('../utils/resUtil');
const path = new Map();

function editEveryday(request,response){
    request.on('data',function(data){
        const parseData = JSON.parse(data.toString());
        everydayDAO.insertEveryDay(parseData.content,timeUtil.getNow(),parseData.author,function (result) {
            response.writeHead(200);
            response.write(resUtil.writeResult('success','successfully added everyday sentence'));
            response.end();
        });
    })
}

function queryEveryday(request,response){
    //因为没有数据传输,所以不用绑ondata
    everydayDAO.queryEveryDay(function (result) {
        response.writeHead(200);
        response.write(resUtil.writeResult('success','successfully acquired everyday sentence',result));
        response.end();
    });
}



path.set('/edit_every_day',editEveryday);
path.set('/query_every_day',queryEveryday);

module.exports.path = path;

