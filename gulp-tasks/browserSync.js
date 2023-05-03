module.exports = function (gulp, P, S) {

  'use strict';

  gulp.task('js-watch', ['jsHaut', 'jsBas', 'jsDemo'], function(done) {
    P.browserSync.reload();
    done();
  });


  // Browser-sync ----------------------------------------
  gulp.task('browserSync', ['nodemon'], function() {
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
      ghostMode: false
    });

    gulp.watch('src/**/*.pug').on('change', P.browserSync.reload);
    gulp.watch(['src/**/*.scss', '!/src/assets/scss/_icons.scss'], ['sass']);
    gulp.watch('temp/css/'+ S.pkg.name +'.css',    ['styledown']);
    gulp.watch('src/**/*.js',                 ['js-watch']);
    gulp.watch('src/assets/images/**/*',      ['images'], P.browserSync.reload);
    gulp.watch('src/assets/icons/*.svg',      ['iconfont'], P.browserSync.reload);
    gulp.watch('src/assets/scss/templates/*', ['iconfont'], P.browserSync.reload);
    gulp.watch('src/assets/fake/**/*',        ['fake'], P.browserSync.reload);
    gulp.watch('src/assets/scss/*.md',        ['styledown'], P.browserSync.reload);
  });

};
