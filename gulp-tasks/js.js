module.exports = function (gulp, P, S) {

  'use strict';

  gulp.task('modernizr', function() {
    return gulp.src('src/**/*.js')
      .pipe(P.modernizr('modernizr-custom.js', {
        "crawl": false,
        "tests": [
          "touchevents",
          "localstorage"
        ],
        "options": [
          //"html5printshiv",
          //"html5shiv",
          "setClasses"
        ]
      }))
      .pipe(gulp.dest('temp/js/haut'));
  });

  gulp.task('modernizr:prod', function () {
    return gulp.src('src/**/*.js')
      .pipe(P.modernizr('modernizr-custom.js', {
        "crawl": false,
        "tests": [
          "touchevents",
          "localstorage"
        ],
        "options": [
          //"html5printshiv",
          //"html5shiv",
          "setClasses"
        ]
      }))
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/js/haut'));
  });

  gulp.task('jslint', function() {
    return gulp.src('src/**/*.js')
      .pipe(P.jshint())
      .pipe(P.jshint.reporter(P.stylish))
      .pipe(P.browserSync.stream());
  });


  // VENDORS
  gulp.task('jsVendors', function(){
    return gulp.src(S.vendorsSrc)
      .pipe(P.concat('vendors.js'))
      .pipe(gulp.dest('temp/js/bas'));
  });

  gulp.task('jsVendors:prod', function () {
    return gulp.src(S.vendorsSrc)
      .pipe(P.concat('vendors.js'))
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/js/bas'));
  });
  // -------------------


  // JS HAUT
  gulp.task('jsHaut', ['modernizr'], function(){
    return gulp.src(S.jsHaut)
      .pipe(P.concat('init.js'))
      .pipe(gulp.dest('temp/js/haut'));
  });

  gulp.task('jsHaut:prod', ['modernizr:prod'], function(){
    var version = 'dev',
        i = process.argv.indexOf("--rebornVersion");

    if (i > -1) {
      // on récupère la version de la ligne de commande "gulp prod --rebornVersion x.x.x"" lancé via "npm version patch""
      version = process.argv[i+1];
    }

    return gulp.src(S.jsHaut)
      .pipe(P.concat('init.js'))
      .pipe(P.replace('<% version %>', version)) // met la version dans E.version
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/js/haut'));
  });
  // ----------------


  // JS BAS
  var jsBasSrc = [
    'src/assets/js/'+ S.pkg.name +'.js',
    '!**/demo.js' // sauf les demo.js
  ];

  // Ajout des composants (jsBas de gulpfile.js)
  jsBasSrc = jsBasSrc.concat(S.jsBas);

  gulp.task('jsBas', ['jslint'], function() {
    return gulp.src(jsBasSrc)
      .pipe(P.concat(S.pkg.name +'.js'))
      .pipe(gulp.dest('temp/js/bas'));
  });

  gulp.task('jsBas:prod', ['jslint'], function() {
    return gulp.src(jsBasSrc)
      .pipe(P.concat(S.pkg.name +'.js'))
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/js/bas'));
  });
  // ---------------


  // JS de démo -----------------
  gulp.task('jsDemo', ['jslint'], function () {
    //return gulp.src('src/**/*/demo.js')
    return gulp.src(S.jsDemo)
      .pipe(P.concat('demo.js'))
      .pipe(gulp.dest('temp/js/bas'));
  });
  gulp.task('jsDemo:prod', ['jslint'], function () {
    return gulp.src(S.jsDemo)
      .pipe(P.concat('demo.js'))
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/js/bas'));
  });
  // -----------------------------------------------
};
