'use strict';

var S = {
  pkg:    require('./package.json'),
};

var gulp = require('gulp');
var _    = require('lodash');

// require all gulp-modules
var P = require('gulp-load-plugins')({
  config: S.pkg
});

gulp.task('deploy:dev', function() {
  return gulp.src('dist/**/*')
    .pipe(P.ghPages({
      remoteUrl: "https://github.com/hamza-111/designsystem.git",
      branch: "dev"
    }));
});

gulp.task('deploy:main', function() {
  return gulp.src('dist/**/*')
    .pipe(P.ghPages({
      remoteUrl: "https://github.com/hamza-111/designsystem.git",
      branch: "main"
    }));
});
