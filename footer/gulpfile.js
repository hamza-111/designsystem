'use strict';

var S = {
  pkg:    require('./package.json'),

  common: '../common',

  // chemin des assets dans CQ
  cqPath: '/etc/designs/particuliers-tr'
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

var browserSync2 = require('browser-sync').create('server2');


// Browser-sync ----------------------------------------
gulp.task('headerBrowserSync', ['nodemon'], function(){
  browserSync2.init(null, {
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

  gulp.watch('src/**/*.pug').on('change', browserSync2.reload);
  gulp.watch(S.common +'/src/**/*.pug').on('change', browserSync2.reload);
  gulp.watch(['src/**/*.scss', S.common +'/src/**/*.scss'], ['sass']);
});


// Executions ---------------------------------------------
gulp.task('build', ['del'], function(callback) {
  P.sequence(
    ['images'],
    'iconfont',
    ['sass']
  )(callback);
});

gulp.task('build:prod', ['del:prod'], function(callback) {
  P.sequence(
    'copy:prod',
    'pug',
    ['sass:prod']
  )(callback);
});

/* GENERIQUE DEV */
gulp.task('default', function(callback) {
  P.sequence(
    'build',
    ['headerBrowserSync']
  )(callback);
});

/* GENERIQUE PROD */
gulp.task('prod', ['build:prod']);
