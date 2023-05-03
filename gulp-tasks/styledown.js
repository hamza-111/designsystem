module.exports = function (gulp, P, S) {

  'use strict';

  gulp.task('styledown', function () {
    return gulp.src('temp/css/**/'+ S.pkg.name +'.css')
      .pipe(
        P.if(P.fileExists(S.common +'/src/assets/scss/styledown.md'), P.styledown({
          config: 'src/assets/scss/styledown.md',
          filename: 'styledown.html'
        }))
      )
      .pipe(gulp.dest('temp/pages'));
  });

  gulp.task('styledown:prod', function () {
    return gulp.src('../dist/'+ S.pkg.name +'/css/**/' + S.pkg.name + '.css')
      .pipe(
      P.if(P.fileExists(S.common + '/src/assets/scss/styledown.md'), P.styledown({
        config: 'src/assets/scss/styledown.md',
        filename: 'styledown.html'
      }))
      )
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/pages'));
  });
};