"use strict";

/* global require process __dirname console */

// ---------------
// Default modules
// ---------------
var express = require('express');
var path = require('path');
var pkg = require('../package');

var errorHandler = require('errorhandler');

var app = express();


// ---------------------
// Default configuration
// ---------------------
app.set('port', pkg.config.port);
app.set('views', __dirname + '/');
app.set('view engine', 'pug');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(path.join(__dirname, '../temp')));


// ---------
// PUG data
// ---------
app.locals.pretty = true;
app.locals.modules = pkg.subDependencies;
app.locals.cache = false;
app.locals.compileDebug = true;
app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
}));


// --------------
// Routes | Pages
// --------------
var routes = [
    'index',
    'pages/standalone-header'
  ],
  len = routes.length;

app.get('/', function(req, res, next) {
  res.render('index');
});

function renderHTML(html, pug) {
  app.get(html, function(req, res, next){
    res.render(pug);
  });
}

while(len--){
  var html = '/' + routes[len] + '.html';
  var pug = routes[len];

  renderHTML(html, pug);
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
