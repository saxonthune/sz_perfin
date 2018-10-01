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
		var query = queries.acct.insRow;

		console.log(req.body.credit);
		if (req.body.credit != 1)
			req.body.credit = 0;
		var inserts = [req.body.atype_id, req.body.name, req.body.open_date, req.body.dscr, req.body.bal, req.body.credit];
		var context = {};
		
		await helpers.dbQuery(res, mysql, context, "acct", query, inserts);
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
		await helpers.postTran(req, res, req.params.id);
		res.redirect("/accounts/"+req.params.id);
	});
	

	return router;
}();
