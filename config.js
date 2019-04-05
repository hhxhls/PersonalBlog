//read server.conf file and converse server config into an object

const fs= require('fs');
const globalConfig = {};
const conf = fs.readFileSync('./server.conf');
const configArr = conf.toString().split('\r\n');

configArr.forEach((ele)=>{
    const temp = ele.split('=');
    globalConfig[temp[0].trim()] = temp[1].trim();
});

module.exports = globalConfig;