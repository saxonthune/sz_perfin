module.exports = function() {
	
	var express = require('express');
	var router = express.Router();
	var helpers = require('./helpers.js');
	var queries = require('./queries.js');

	//show all transactions
	router.get('/', async function(req, res){
		var context = {};
		context.jsscripts = ["tran_delete.js"];
		var mysql = req.app.get('mysql');

		await Promise.all([
			helpers.dbQuery(res, mysql, context, "data", queries.tran.dispAll),
			helpers.dbQuery(res, mysql, context, "acct", "SELECT acct_id, name FROM acct"),
			helpers.dbQuery(res, mysql, context, "tcat", "SELECT tcat_id, name FROM tcat ORDER BY name")
		]);

		res.render('transactions', context);

	});

	//add transaction
	router.post('/', async function(req, res){

		inserts = [req.body.acct_id, req.body.tcat_id, req.body.tran_date, req.body.amt, req.body.memo];
		await helpers.postTran(req, res, inserts);
		res.redirect('/transactions');
	});
		

	//delete transaction
	router.delete('/:id', async function(req, res){
        var mysql = req.app.get('mysql');
		var context = {};
        var inserts = [req.params.id];
		try {
			await helpers.dbQuery(res, mysql, context, "data", "SELECT * FROM tran WHERE tran_id = ?", inserts);
			await Promise.all([
				helpers.dbQuery(res, mysql, context, "delRes", queries.tran.delRow, inserts),
				helpers.dbQuery(res, mysql, context, "acct", queries.acct.getSingle, [context.data[0].acct_id])
			]);
			//deleting a charge on a credit account decreases the account balance
			if (context.acct[0].credit == 1)
				var adjustAmt = context.data[0].amt *-1;
			else
				var adjustAmt = context.data[0].amt;

			await helpers.adjustAcct(res, mysql, context.data[0].acct_id, adjustAmt);
		} catch(error) {
			console.log("deletion error: " + error);
			return;
		}
		res.status(202).end();
	});

	return router;
}();
