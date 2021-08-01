const mysql = require('mysql');

exports.pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : process.env.DBUSER,
  password        : process.env.DBPASSWORD,
  database        : process.env.DBNAME
});
