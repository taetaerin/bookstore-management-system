// const mysql = require('mysql2/promise');

// const connection = async () => {
//     const conn = await mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'root',
//       database: 'Library',
//       dateStrings: true
//     });

//     return conn;
// }

// module.exports = connection;

const mysql = require('mysql2');

const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'Library',
      dateStrings: true
    });


module.exports = connection;
