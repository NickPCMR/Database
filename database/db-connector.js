var mysql = require('mysql')

var pool = mysql.createPool({
	connectionLimit : 10,
	host		: 'classmysql.engr.oregonstate.edu',
	user		: 'cs340_osbornic',
	password	: '3743',
	database	: 'cs340_osbornic'

})

module.exports.pool = pool
