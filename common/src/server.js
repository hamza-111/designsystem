"use strict";
 
/* global require process __dirname console */
 
// ---------------
// Default modules
// ---------------
var express       = require('express');
var path          = require('path');
var pkg           = require('../package');
// var pug_plugin_ng = require('pug-plugin-ng');
var errorHandler  = require('errorhandler');
var fs            = require("fs");
 
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
  'index'
];
 
var files = fs.readdirSync(__dirname+"/pages/");
 
files
  .filter(function(file) {
    return file.indexOf(".pug") > -1;
  })
  .forEach(function(file) {
    routes.push('pages/'+ file.split('.').slice(0, -1).join('.'));
  });
 
var len = routes.length;
 
app.get('/', function(req, res, next) {
  res.render('index');
});
 
function renderHTML(html, pug) {
  app.get(html, function(req, res, next){
    res.render(pug, {
      serverMode: true
      // plugins: [pug_plugin_ng]
    });
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


// "use strict";

// /* global require process __dirname console */

// // ---------------
// // Default modules
// // ---------------
// var express = require('express');
// var path = require('path');
// var pkg = require('../package');

// var errorHandler = require('errorhandler');

// var app = express();

// // ---------------------
// // Default configuration
// // ---------------------
// app.set('port', pkg.config.port);
// app.set('views', __dirname + '/');
// app.set('view engine', 'pug');

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// app.use(express.static(path.join(__dirname, '../temp')));

// // ---------
// // PUG data
// // ---------
// app.locals.pretty = true;
// app.locals.modules = pkg.subDependencies;
// app.locals.cache = false;
// app.locals.compileDebug = true;
// app.use(errorHandler({
//     dumpExceptions: true,
//     showStack: true
// }));

// // --------------
// // Routes | Pages
// // --------------
// var routes = [
//     'index',
//     'pages/template',

//     'pages/colors',

//     // pages
//     'pages/homepage',
//     'pages/error',
//     'pages/article',
//     'pages/siteMap',
//     'pages/deepLink-accountActivation',
//     'pages/deepLink-lostPassword',
//     'pages/energySimulator',
//     'pages/forms',
//     'pages/pageFaqListe',
//     'pages/pageFaqListe-empty',
//     'pages/pageFaqArticle',
//     'pages/articleSummary',
//     'pages/formulaire-succes',
//     'pages/formulaire-contact',
//     'pages/designImporter-table',
//     'pages/wcb-standalone',

//     // pages TEL
//     'pages/tel-etape1',

//     // components
//     'pages/_component-header-footer',
//     'pages/_component-textImageBg',
//     'pages/_component-textImage',
//     'pages/_component-backToTop',
//     'pages/_component-pushFAQ',
//     'pages/_component-noResultFAQ',
//     'pages/_component-pushArticle',
//     'pages/_component-wysiwyg',
//     'pages/_component-espritService',
//     'pages/_component-contact',
//     'pages/_component-blockquote',
//     'pages/_component-accordion',
//     'pages/_component-image',
//     'pages/_component-tabs',
//     'pages/_component-blockLinks',
//     'pages/_component-quickAccess',
//     'pages/_component-quickAccess2',
//     'pages/_component-title',
//     'pages/_component-advantages',
//     'pages/_component-listLinks',
//     'pages/_component-greyWrapper',
//     'pages/_component-legalMention',
//     'pages/_component-headSection',
//     'pages/_component-iframe',
//     'pages/_component-flash',
//     'pages/_component-breadcrumb',
//     'pages/_component-storageLink',
//     'pages/_component-zip2city',
//     'pages/_component-gazConnect',
//     'pages/_component-form',
//     'pages/_component-formMat',
//     'pages/_component-facebookMessenger',
//     'pages/_component-separator',
//     'pages/_component-column',
//     'pages/_component-spinner',
//     'pages/_component-modal',
//     'pages/_component-toolTip',
//     'pages/_component-assuranceBand',
//     'pages/_component-sideMenu',
//     'pages/_component-pictoBlock',
//     'pages/_component-fieldInfo',
//     'pages/_component-headerArticle',
//     'pages/_component-shareArticle',
//     'pages/_component-moreLessInput',
//     'pages/_component-footerArticle',
//     'pages/_component-userReview',
//     'pages/_component-listLinkVertical',
//     'pages/_component-pictoLink',
//     'pages/_component-searchFAQ',
//     'pages/_component-articleFAQ',
//     'pages/_component-reviewFeedBack',
//     'pages/_component-menuFAQ',
//     'pages/_component-paging',
//     'pages/_component-pushBlock',
//     'pages/_component-pushLight',
//     'pages/_component-chapoArticle',
//     'pages/_component-stickyDock',
//     'pages/_component-headerOffer',
//     'pages/_component-offerPromo',
//     'pages/_component-productList',
//     'pages/_component-stepByStep',
//     'pages/_component-infoBlock',
//     'pages/_component-timeLine',
//     'pages/_component-listChoiceButton',
//     'pages/_component-filtersArticle',
//     'pages/_component-selectImpostor',
//     'pages/_component-selectOptions',
//     'pages/_component-pushPromo',
//     'pages/_component-bubbleSelect',
//     'pages/_component-verticalStep',
//     'pages/_component-arrowBox',
//     'pages/_component-toggleCheck',
//     'pages/_component-choiceBox',
//     'pages/_component-arrowBorder',

//     // front only components
//     'pages/_component-btnWrapper',
//     'pages/_component-btnWrap',
//     'pages/_component-linkLongArrow',

//     // partials
//     'pages/partials/default-content',
//     'pages/partials/small-content',
//     'pages/partials/medium-content',
//     'pages/partials/large-content'
//   ],
//   len = routes.length;

// app.get('/', function(req, res, next) {
//   res.render('index');
// });

// function renderHTML(html, pug) {
//   app.get(html, function(req, res, next){
//     res.render(pug);
//   });
// }

// while(len--){
//   var html = '/' + routes[len] + '.html';
//   var pug = routes[len];

//   renderHTML(html, pug);
// }

// app.listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });