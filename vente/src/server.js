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

    'pages/_component-modal',
    'pages/_component-breadcrumb',
    'pages/_component-contact',
    'pages/_component-storageLink',
    'pages/_component-toolTip',
    'pages/_component-formMat',
    'pages/_component-baseBtn',
    'pages/_component-legalMention',
    'pages/_component-sideMenu',
    'pages/_component-typo',
    'pages/_component-assuranceBand',
    'pages/_component-spinner',
    'pages/_component-tunnelFilter',
    'pages/_component-floatingMenu',
    'pages/_component-pictoBlock',
    'pages/_component-fieldInfo',
    'pages/_component-moreLessInput',
    'pages/_component-offerPromo',
    'pages/_component-verticalStep',
    'pages/_component-arrowBox',
    'pages/_component-toggleCheck',
    'pages/_component-choiceBox',

    'pages/_component-headerLight',
    'pages/_component-headerLight-footerLight',

    'pages/_component-timeLine',
    'pages/_component-bubble',
    'pages/_component-addressBox',
    'pages/_component-flatTabs',
    'pages/_component-estimationBox',
    'pages/_component-estimationCta',
    'pages/_component-offer',
    'pages/_component-codePromo',
    'pages/_component-loginFeedback',
    'pages/_component-listChoiceButton',
    'pages/_component-promoBanner',
    'pages/_component-dropdownNav',
    'pages/_component-selectOptions',
    'pages/_component-choiceBox',
    'pages/_component-toggleCheck',
    'pages/_component-fullModal',
    'pages/_component-selectEmpty',
    'pages/_component-miniBubbleList',
    'pages/_component-multiChoice',
    'pages/_component-stickyDock',
    'pages/_component-priceDetail',

    'pages/demo-bubble',
    'pages/demo-modal',
    'pages/demo-modal_code-promo',

    'pages/demo-page-offres',
    'pages/demo-page-panier',
    'pages/demo-page-form_identite_1',
    'pages/demo-page-form_identite_2',
    'pages/demo-page-form_logement',
    'pages/demo-page-form_options',
    'pages/demo-page-form_contrat_1',
    'pages/demo-page-form_contrat_2',
    'pages/demo-page-form_contrat_3',
    'pages/demo-page-form_contrat_4',

    // estimation
    'pages/demo-estimation'
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
