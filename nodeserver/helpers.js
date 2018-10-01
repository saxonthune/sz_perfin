var queries = require('./queries.js');

var mysqlErr = function(res, error) {
	if (error) {
		console.log(JSON.stringify(error));
		res.write(JSON.stringify(error));
		res.end();
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
		if (typeof inserts === 'undefined')
			await dbQueryNoInp(res, mysql, context, dest, sqlStr);
		else 
			await dbQueryInp(res, mysql, context, dest, sqlStr, inserts);	
	} catch(error) {
		conosole.log(error);
	}
}


var dbQueryInp = async function(res, mysql, context, dest, sqlStr, inserts){
	try {
		let [results, rows, error] = await mysql.pool.query(sqlStr, inserts);
		context[dest] = results;
	} catch(error) {
		mysqlErr(res,error);
	}
}

var dbQueryNoInp = async function(res, mysql, context, dest, sqlStr){
	try {
		let [results, rows, error] = await mysql.pool.query(sqlStr);
		context[dest] = results;
	} catch(error) {
		mysqlErr(res, error);
	}
}

// Creates transaction entry in tran table and adjusts associated account balance
var postTran = async function(req, res, acct_id){
	var mysql = req.app.get('mysql');
	var context = {}; 
	var inserts = [acct_id, req.body.tcat_id, req.body.tran_date, req.body.amt, req.body.memo];
	await Promise.all([
		dbQuery(res, mysql, context, "acct", queries.acct.getSingle, [acct_id]), 
		dbQuery(res, mysql, context, "tran", queries.tran.insRow, inserts)
	]);

	//adding a charge on a credit account increases the account balance
	if (context.acct[0].credit == 1)
		var adjustAmt = req.body.amt;
	else
		var adjustAmt = req.body.amt *-1;

	await adjustAcct(res, mysql, acct_id, adjustAmt);
}

module.exports.mysqlErr = mysqlErr;
module.exports.adjustAcct = adjustAcct;
module.exports.dbQuery = dbQuery;
module.exports.postTran = postTran;
