module.exports = function() {
	
	var express = require('express');
	var router = express.Router();
	var queries = require('./queries.js');
	var helpers = require('./helpers.js');
	
	// displays snapshots and snapshot creation form
	router.get('/', async function(req, res){
		
		var context = {};
		context.jsscripts = [];
		var mysql = req.app.get('mysql');

		await Promise.all([
			helpers.dbQuery(res, mysql, context, "data", queries.snapshot.dispAll),
			helpers.dbQuery(res, mysql, context, "acct", queries.snapshot.acctNames)
		]);
		res.render('snapshots', context);
	});
	
	// creates new snapshot
	router.post('/', async function(req, res){

		var context = {};
		var mysql = req.app.get('mysql');

		var date = new Date(Date.now());
		await Promise.all([
			helpers.dbQuery(res, mysql, context, "acct", queries.acct.getSingle, req.body.acct_id),
			helpers.dbQuery(res, mysql, context, "tcat", queries.tcat.getSingleByName, "System")
		]);

		var bal_dif = req.body.bal_new - context.acct[0].bal;
		var inserts = [date, req.body.acct_id, req.body.bal_new, context.acct[0].bal, bal_dif];

		var bal_ins = bal_dif*-1; 		// correct account balance by "subtracting" difference from it...
		if (context.acct[0].credit)
			bal_ins = bal_ins*-1; 		// ...unless account is credit, then "add" the difference

		var tran_inserts = [req.body.acct_id, context.tcat[0].tcat_id, date, bal_ins, "Snapshot adjustment"];
		await Promise.all([
			helpers.dbQuery(res, mysql, context, "snapshots", queries.snapshot.insRow, inserts),
			helpers.postTran(req, res, tran_inserts)
		]);

		res.redirect('/snapshots');
	});

	return router;
}();
