// All middleware functions are defined in web folder and would be mapped and exported here

const fs = require('fs');
const globalConfig = require('./config');

const controllerSet = [];
const pathMap = new Map();

const files = fs.readdirSync(globalConfig['web_path']);

files.forEach((ele)=>{
    const temp = require(`./${globalConfig['web_path']}/${ele}`);
    // All web controller should export as an object with path properties
    if(temp.path){
        for(let [key,value] of  temp.path){
            if (pathMap.get(key) === null || pathMap.get(key) === undefined){
                    pathMap.set(key,value);
            }else{
                throw new Error(`Abnormal URL path at url: ${key}, this url has been duplicated declared`)
            }
        }
    }
    controllerSet.push(temp)
});

module.exports = pathMap;