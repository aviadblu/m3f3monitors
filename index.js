// npm config set proxy http://web-proxy.il.hpecorp.net:8080
// npm config set https-proxy http://web-proxy.il.hpecorp.net:8080

var express  = require('express');
var app      = express(); 								// create our app w/ express
var port  	 = process.env.PORT || 9090;

var morgan = require('morgan'); 		// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

app.use(express.static(__dirname + '/public')); 				// set static path
app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.get('/api/messages', function(req, res) {
    // load index.html otherwise
    res.sendfile('messages.txt');
    // C:\Users\blumenfa\Desktop\M3Choco\messages.txt
});

app.get('*', function(req, res) {
    // load index.html otherwise
    res.sendfile('./public/index.html');
});

app.listen(port);
console.log("App listening on port " + port);