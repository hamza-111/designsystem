module.exports = function (gulp, P, S) {

  'use strict';

  gulp.task('nodemon', function (cb) {
    var started = false;
    return P.nodemon({
      script: 'src/server.js',
      ignore: [
        'assets/',
        'components/',
        'utilities/'
      ],
      ext: 'js',
      env: { 'NODE_ENV': 'production' }
    }).on('start', function () {
      if (!started) {
        started = true;
        cb();
      }
    });
  });

};