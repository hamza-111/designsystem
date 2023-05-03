module.exports = function (gulp, P, S) {

  'use strict';

  gulp.task('images', function() {
    return gulp.src(S.common +'/src/assets/images/**/*')
      .pipe(P.cache(P.imagemin({
        interlaced: true
      })))
      .pipe(gulp.dest(S.common +'/src/assets/images'))
      .pipe(gulp.dest('temp/images'))
      .pipe(P.browserSync.stream());
  });

  gulp.task('images:prod', function () {
    return gulp.src(S.common + '/src/assets/images/**/*')
      .pipe(P.cache(P.imagemin({
        interlaced: true
      })))
      .pipe(gulp.dest(S.common + '/src/assets/images'))
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/images'))
      .pipe(P.browserSync.stream());
  });

};
