module.exports = function (gulp, P, S) {

  'use strict';

  var browsers = ['last 2 major versions'];

  gulp.task('sass', function () {
    return gulp.src('src/assets/scss/*.scss')
      .pipe(P.sass({
        includePaths: ['./../node_modules']
      }).on('error', P.sass.logError))
      .pipe(P.autoprefixer({
        browsers: browsers
      }))
      .pipe(gulp.dest('temp/css'))
      .pipe(P.browserSync.stream({match: '**/*.css'}));
  });

  gulp.task('sass:prod', function() {
    return gulp.src('src/assets/scss/*.scss')
      .pipe(P.sass({
        includePaths: ['./../node_modules']
      }).on('error', P.sass.logError))
      .pipe(P.autoprefixer({
        browsers: browsers
      }))
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/css'))
      .pipe(P.replace('../images', S.cqPath +'/images'))
      .pipe(P.replace('../fonts', S.cqPath +'/fonts'))
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/css4prod'))
      .pipe(P.browserSync.stream({match: '**/*.css'}));
  });

};
