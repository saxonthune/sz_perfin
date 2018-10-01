module.exports = function() {
	
	var express = require('express');
	var router = express.Router();
	var helpers = require('./helpers.js');
	var queries = require('./queries.js');

	// show list of transaction categories
	router.get('/', async function(req, res){
		var context = {};
		context.jsscripts = ["tcat_edit.js"];
		var mysql = req.app.get('mysql');

		await helpers.dbQuery(res, mysql, context, "data", queries.tcat.dispAll);
		res.render('transaction-categories', context);

	});

	// add transaction cateogry
	router.post('/', async function(req, res){
        var mysql = req.app.get('mysql');
		var context = {}; 
        var inserts = [req.body.name];
		
		await helpers.insertRow(res, mysql, context, "tcat", queries.tcat.insRow, inserts);
		res.redirect('/transaction-categories');
	});
		
	// edit category name (not implemented)
	router.put('/:id', async function(req, res){
	});

	return router;
}();
