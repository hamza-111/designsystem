'use strict';

var S = {
  pkg:    require('./package.json'),

  common: '../common',

  // chemin des assets dans CQ
  cqPath: '/content/dam/migration_aem_tr/particuliers-tr',

  // Vendors
  vendorsSrc: [
    './../node_modules/slick-carousel/slick/slick.js',
    './../node_modules/ab-mediaquery/AB-mediaQuery.js',
    './../node_modules/ab-interchange/AB-interchange.js',
    './../node_modules/flatpickr/dist/flatpickr.min.js',
    './../node_modules/popper.js/dist/umd/popper.js',
    './../node_modules/tooltip.js/dist/umd/tooltip.js',
    './../node_modules/flatpickr/dist/l10n/fr.js'
  ],

  // common-haut : 1er JS chargés dans le <head>
  jsHaut: [
    'src/assets/js/init.js',
    './../node_modules/js-cookie/src/js.cookie.js',
    'src/assets/js/polyfills.js',
    'src/utilities/**/*.js'
  ],

  // common-bas : JS chargé en bas de page (principalements composants)
  jsBas: [
    'src/components/**/*.js'
  ],

  jsDemo: [
    'src/**/demo.js'
  ]
};

var gulp = require('gulp');
var _    = require('lodash');

// require all gulp-modules
var packages = _.merge(
  require('../package.json'),
  require('./package.json')
);
var P = require('gulp-load-plugins')({
  config: packages
});

// require non gulp-modules
P.del         = require('del');
P.browserSync = require('browser-sync').create('server');
P.stylish     = require('jshint-stylish');
P.fileExists  = require('file-exists');

// require all gulp tasks
var tasks     = require('require-dir')('../gulp-tasks');
for (var task in tasks) {
  if (tasks[task] instanceof Function) {
    tasks[task](gulp, P, S);
  }
}


// Executions ---------------------------------------------
gulp.task('build', ['del'], function(callback) {
  P.sequence(
    ['images'],
    'iconfont',
    'jsVendors',
    'jsBas',
    'jsHaut',
    'jsDemo',
    'copy',
    ['sass'],
    ['styledown']
  )(callback);
});

gulp.task('build:prod', ['del:prod'], function(callback) {
  P.sequence(
    ['images:prod'],
    'iconfont:prod',
    'jsVendors:prod',
    'jsBas:prod',
    'jsHaut:prod',
    'jsDemo:prod',
    'copy:prod',
    'pug',
    ['sass:prod'],
    ['styledown:prod']
  )(callback);
});

/* GENERIQUE DEV */
gulp.task('default', function(callback) {
  P.sequence(
    'build',
    ['browserSync']
  )(callback);
});

/* GENERIQUE PROD */
gulp.task('prod', ['build:prod']);
