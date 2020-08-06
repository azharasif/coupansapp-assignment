const mysql = require('mysql');
const dotenv = require('dotenv').config()
//local mysql db connection
let connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB,
    port     : process.env.DB_PORT

});
connection.connect(function(err) {
    if (err) console.log(err.message) ;
});

module.exports = connection;
