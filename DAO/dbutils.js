const mysql = require('mysql');

function createSqlConnection(){
    return mysql.createConnection({
        // host: '127.0.0.1',
        host:'192.168.0.106',
        port: '3306',
        user: 'root',
        password: 'APtoxin93',
        database: 'my_blog'
    });
}

module.exports.createSqlConnection = createSqlConnection;