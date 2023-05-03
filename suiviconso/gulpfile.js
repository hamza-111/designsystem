'use strict';

var S = {
  pkg:    require('./package.json'),

  common: '../common',

  // chemin des assets dans CQ
  cqPath: '/content/dam/migration_aem_tr/consotr',

  // Vendors
  vendorsSrc: [
    './../node_modules/matchmedia-polyfill/matchMedia.js',
    './../node_modules/slick-carousel/slick/slick.js',
    './../node_modules/ab-mediaquery/AB-mediaQuery.js',
    './../node_modules/ab-interchange/AB-interchange.js',
    './../node_modules/flatpickr/dist/flatpickr.js'
  ],

  // common-haut : 1er JS chargés dans le <head>
  jsHaut: [
    '../common/src/assets/js/init.js',
    './../node_modules/js-cookie/src/js.cookie.js',
    '../common/src/assets/js/polyfills.js',
    '../common/src/utilities/**/*.js',
    '../common/src/components/bannerApp/**/*.js',
    '../common/src/components/scrollTo/**/*.js',
    '../common/src/components/backToTop/**/*.js',
    '../common/src/components/openPopup/**/*.js',
    '../common/src/components/sticky/**/*.js',
    '../common/src/components/storageLink/**/*.js',
    '../common/src/components/siteHeader/**/*.js',
    '../common/src/components/toggle/**/*.js',
    '../common/src/components/tabs/**/*.js',
    '../common/src/components/formMat/**/*.js',
    '../common/src/components/btnWrapper/**/*.js',
    '../common/src/components/modal/**/*.js',
    '../common/src/components/sideMenu/**/*.js',
    '../common/src/components/floatingMenu/**/*.js',
    '../common/src/components/toggleCheck/**/*.js',
    '../common/src/components/moreLessInput/**/*.js',
    '../common/src/components/carousel/**/*.js',
    '../common/src/components/redirect/**/*.js',
    '../common/src/components/accordion/**/*.js',
    '../common/src/components/iframe/**/*.js',
    '../node_modules/popper.js/dist/umd/popper.js',
    '../node_modules/tooltip.js/dist/umd/tooltip.js',
    '../common/src/components/toolTip/**/*.js',
    '../cel/src/components/headerCelNav/**/*.js'
  ],

  // common-bas : JS chargé en bas de page
  jsBas: [
    // composant for suiviconso
    'src/components/**/*.js',
    'src/assets/js/specificKit/**/*.js'
  ],

  jsDemo: []
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

// Browser-sync ----------------------------------------
gulp.task('suivieConsoBrowserSync', ['nodemon'], function(){
  P.browserSync.init(null, {
    port: S.pkg.config.port + 1,
    ui: {
      port: S.pkg.config.port + 2
    },
    proxy: 'http://localhost:'+ S.pkg.config.port,
    reloadOnRestart: true,
    open: false,
    reloadDebounce: 1000,
    reloadDelay: 1000,
    ghostMode: {
      clicks: true,
      forms:  true,
      scroll: false
    }
  });

  gulp.watch(['src/**/*.pug', S.common +'/src/**/*.pug']).on('change', P.browserSync.reload);
  gulp.watch(['src/**/*.scss', S.common +'/src/**/*.scss'], ['sass']);
  gulp.watch(['src/**/*.js', S.common +'/src/**/*.js'],     ['jsHaut', 'jsBas'], P.browserSync.reload);
});


// Executions ---------------------------------------------
gulp.task('build', ['del'], function(callback) {
  P.sequence(
    ['images'],
    'iconfont',
    'jsVendors',
    'jsBas',
    'jsHaut',
    'copy',
    ['sass'],
    ['styledown']
  )(callback);
});

gulp.task('build:prod', ['del:prod'], function(callback) {
  P.sequence(
    'jsVendors:prod',
    'jsBas:prod',
    'jsHaut:prod',
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
    ['suivieConsoBrowserSync']
  )(callback);
});

/* GENERIQUE PROD */
gulp.task('prod', ['build:prod']);
