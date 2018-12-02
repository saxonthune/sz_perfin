module.exports = function() {
	
	var express = require('express');
	var router = express.Router();
	var queries = require('./queries.js');
	var helpers = require('./helpers.js');
	
	// displays accounts and account creation form
	router.get('/', async function(req, res){
		
		var context = {};
		context.jsscripts = ["account_delete.js"];
		var mysql = req.app.get('mysql');

		await Promise.all([
			helpers.dbQuery(res, mysql, context, "data", queries.acct.dispAll),
			helpers.dbQuery(res, mysql, context, "atype", "SELECT atype_id, name FROM atype")
		]);
		res.render('accounts', context);
	});
	
	// creates new account
	router.post('/', async function(req, res){

		var mysql = req.app.get('mysql');

	
		if (req.body.credit != 1) //convert undefined to 0 if necessary
			req.body.credit = 0;
		var inserts = [req.body.atype_id, req.body.name, req.body.open_date, req.body.dscr, 0, req.body.credit];
		var context = {};
		
		await Promise.all([
			helpers.dbQuery(res, mysql, context, "acct", queries.acct.insRow, inserts),
			helpers.dbQuery(res, mysql, context, "tcat", queries.tcat.getSingleByName, "System")
		]);
		
		var tran_inserts = [context.acct.insertId, context.tcat[0].tcat_id, 
				req.body.open_date, req.body.bal*-1, "Account Initialization"];
		await helpers.postTran(req, res, tran_inserts); 

		res.redirect('/accounts');
	});

	// displays transactions for a given account on /accounts/id
	router.get('/:id', async function(req, res){

		var mysql = req.app.get('mysql');
		var context = {};
		context.jsscripts = ["tran_delete.js"];
		var acct_id = req.params.id;

		await Promise.all([
			helpers.dbQuery(res, mysql, context, "acct", queries.acct_details.acct, acct_id), 
			helpers.dbQuery(res, mysql, context, "data", queries.acct_details.dispAll, acct_id),
			helpers.dbQuery(res, mysql, context, "tcat", "SELECT tcat_id, name FROM tcat ORDER BY name")
		]);

		res.render('account_details', context);
	});

	// adds transaction to account associated with id
	router.post('/:id', async function(req, res){
		inserts = [req.params.id, req.body.tcat_id, req.body.tran_date, req.body.amt, req.body.memo];
		await helpers.postTran(req, res, inserts);
		res.redirect("/accounts/"+req.params.id);
	});
	

	return router;
}();
