var mysql = require('mysql2/promise');
var pool = mysql.createPool({
  connectionLimit : 5,
  host            : 'localhost',
  user            : 'perfin_user',
  password        : 'perfin_password',
  database        : 'sz_perfin',
});

module.exports.pool = pool;
