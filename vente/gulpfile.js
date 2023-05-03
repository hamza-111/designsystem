'use strict';

var S = {
  pkg:    require('./package.json'),

  common: '../common',

  // chemin des assets dans CQ
  cqPath: '/etc/designs/vente/common',

  // Vendors
  vendorsSrc: [
    './../node_modules/matchmedia-polyfill/matchMedia.js',
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
    'src/utilities/**/*.js'
  ],

  // common-bas : JS chargé en bas de page
  jsBas: [
    '../common/src/components/bannerApp/**/*.js',
    '../common/src/components/scrollTo/**/*.js',
    '../common/src/components/backToTop/**/*.js',
    '../common/src/components/openPopup/**/*.js',
    '../common/src/components/sticky/**/*.js',
    '../common/src/components/storageLink/**/*.js',
    '../common/src/components/siteHeader/**/*.js',
    '../common/src/components/toggle/**/*.js',
    '../common/src/components/modal/**/*.js',
    'src/components/**/*.js'
  ],

  // JS de démo
  jsDemo: [
    '../common/src/components/formMat/**/*.js',
    '../common/src/components/stickyDock/**/*.js',
    '../common/src/components/sideMenu/**/*.js',
    '../common/src/components/floatingMenu/**/*.js',
    '../common/src/components/btnWrapper/**/*.js',
    '../common/src/components/moreLessInput/**/*.js',
    '../common/src/components/tabs/**/*.js',
    '../common/src/components/loginFeedback/demo.js',
    '../common/src/components/toggleCheck/**/*.js',
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

gulp.task('iconfontTunnel', function () {
  return gulp.src('src/assets/icons/*.svg')
    .pipe(P.cache(P.imagemin()))
    .pipe(P.iconfont({
      fontName: 'iconsVente',
      formats: ['ttf', 'woff', 'woff2'],
      prependUnicode: true,
      centerHorizontally: true,
      normalize: true,
      fontHeight: 448, // matching IcoMoon's defaults for the font-awesome icons @ "14px grid"
      descent: 64
    }))
    .on('glyphs', function (glyphs) {
      gulp.src('src/assets/scss/templates/_icons.scss')
        .pipe(P.consolidate('lodash', {
          glyphs: glyphs,
          fontName: 'iconsVente',
          fontPath: '../fonts/',
          className: 'iconVente',
          timestamp: 0
        }))
        .pipe(gulp.dest('src/assets/scss'));

      // json for back usage in CQ
      gulp.src('src/assets/scss/templates/fontIcons.json')
        .pipe(P.consolidate('lodash', {
          glyphs: glyphs
        }))
        .pipe(gulp.dest('temp/json'));
    })
    .pipe(gulp.dest('temp/fonts/'))
    .pipe(P.browserSync.stream());
});

gulp.task('iconfontTunnel:prod', function () {
  return gulp.src('src/assets/icons/*.svg')
    .pipe(P.cache(P.imagemin()))
    .pipe(P.iconfont({
      fontName: 'iconsVente',
      formats: ['ttf', 'woff', 'woff2'],
      prependUnicode: true,
      centerHorizontally: true,
      normalize: true,
      fontHeight: 448, // matching IcoMoon's defaults for the font-awesome icons @ "14px grid"
      descent: 64
    }))
    .on('glyphs', function (glyphs) {
      gulp.src('src/assets/scss/templates/_icons.scss')
        .pipe(P.consolidate('lodash', {
          glyphs: glyphs,
          fontName: 'iconsVente',
          fontPath: '../fonts/',
          className: 'iconVente',
          timestamp: 0
        }))
        .pipe(gulp.dest('src/assets/scss'));

      // json for back usage in CQ
      gulp.src('src/assets/scss/templates/fontIcons.json')
        .pipe(P.consolidate('lodash', {
          glyphs: glyphs
        }))
        .pipe(gulp.dest('../dist/'+ S.pkg.name +'/json'));
    })
    .pipe(gulp.dest('../dist/'+ S.pkg.name +'/fonts/'))
    .pipe(P.browserSync.stream());
});


// Browser-sync ----------------------------------------
gulp.task('venteBrowserSync', ['nodemon'], function(){
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
  gulp.watch(['src/**/*.scss', S.common +'/src/**/*.scss'],            ['sass']);
  gulp.watch(['src/**/*.js', S.common +'/src/**/*.js'],                ['jsHaut', 'jsBas', 'jsDemo'], P.browserSync.reload);
});


// Executions ---------------------------------------------
gulp.task('build', ['del'], function(callback) {
  P.sequence(
    ['images'],
    'iconfont',
    'iconfontTunnel',
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
    'copy:prod',
    'iconfontTunnel:prod',
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
    ['venteBrowserSync']
  )(callback);
});

/* GENERIQUE PROD */
gulp.task('prod', ['build:prod']);
