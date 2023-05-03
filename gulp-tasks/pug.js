module.exports = function (gulp, P, S) {

  'use strict';

  gulp.task('pug:pages', function () {
    return gulp.src('src/pages/*.pug')
      .pipe(P.pug({
        pretty: true
      }))
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/pages'))
      .pipe(P.browserSync.stream());
  });

  gulp.task('pug:index', function () {
    return gulp.src('src/index.pug')
      .pipe(P.pug({
        pretty: true
      }))
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/'))
      .pipe(P.browserSync.stream());
  });

  gulp.task('pug:partials', function () {
    return gulp.src('src/pages/partials/*.pug')
      .pipe(P.pug({
        pretty: true
      }))
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/pages/partials'));
  });

  gulp.task('pug', [
    'pug:pages',
    'pug:index',
    'pug:partials'
  ]);

};