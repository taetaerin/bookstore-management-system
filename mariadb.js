// const mysql = require('mysql2');
import mysql from 'mysql2';


const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'Library',
      dateStrings: true
    });


// module.exports = connection;
export default connection;
