var queries = require('./queries.js');

var mysqlErr = function(res, error, sqlStr) {
	if (error) {
		console.log(JSON.stringify(error));
		res.write(JSON.stringify(error));
		res.end();
		console.log("Query: " + sqlStr);
	}
}

// Changes balance of account with given id by amt
var	adjustAcct = async function(res, mysql, id, amt){

	if (amt > 0)
		amt = "+"+amt;
	sqlStr = "UPDATE acct SET bal = bal" + amt + " WHERE acct_id = " + id;
	try {
		let [results, rows, error] = await mysql.pool.query(sqlStr);
	} catch (error) {
		mysqlErr(res, error);
	}
}

// runs mysql query with or without escaped user input
// results are stored in context.dest
var dbQuery = async function(res, mysql, context, dest, sqlStr, inserts){

	try {
		if (inserts) {
			let [results, rows, error] = await mysql.pool.query(sqlStr, inserts);
			context[dest] = results;
		}
		else {
			let [results, rows, error] = await mysql.pool.query(sqlStr);
			context[dest] = results;
		}
	} catch(error) {
		mysqlErr(res,error,sqlStr);
	}
}

// Creates transaction entry in tran table and adjusts associated account balance
var postTran = async function(req, res, inserts){
	var mysql = req.app.get('mysql');
	var context = {}; 

	await Promise.all([
		dbQuery(res, mysql, context, "acct", queries.acct.getSingle, inserts[0]), 
		dbQuery(res, mysql, context, "tran", queries.tran.insRow, inserts)
	]);

	//placing a charge on a credit account increases the account balance
	if (context.acct[0].credit == 1)
		var adjustAmt = inserts[3];
	else
		var adjustAmt = inserts[3]*-1;

	await adjustAcct(res, mysql, inserts[0], adjustAmt);
}

module.exports.mysqlErr = mysqlErr;
module.exports.adjustAcct = adjustAcct;
module.exports.dbQuery = dbQuery;
module.exports.postTran = postTran;
