var express = require('express');
var mysql = require('./dbinfo.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
if (process.argv.length > 2)
	app.set('port', process.argv[2]);
else 
	app.set('port', 13325);
app.set('mysql', mysql);

app.use('/', require('./root.js'));
app.use('/accounts', require('./acct.js'));
app.use('/transactions', require('./tran.js'));
app.use('/transaction-categories', require('./tcat.js'));
app.use('/snapshots', require('./snapshot.js'));

app.use(function(req,res){
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Perfin server started on port ' + app.get('port'));
});
