module.exports = function (gulp, P, S) {

  'use strict';

  gulp.task('del', function() {
    return P.del(['temp']);
  });

  gulp.task('del:prod', function () {
    return P.del(['../dist/'+  S.pkg.name], {
      force: true,
      dryRun: true
    });
  });

};