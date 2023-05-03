module.exports = function (gulp, P, S) {

  'use strict';

  // fichiers sans manipulation Gulp
  gulp.task('fake', function(){
    return gulp.src(['../common/src/assets/fake/**/*'])
      .pipe(gulp.dest('temp/fake'));
  });

  gulp.task('fake:prod', function () {
    return gulp.src(['../common/src/assets/fake/**/*'])
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/fake'));
  });

  gulp.task('media', function(){
    return gulp.src(['src/assets/media/**/*'])
      .pipe(gulp.dest('temp/media'));
  });

  gulp.task('media:prod', function () {
    return gulp.src(['src/assets/media/**/*'])
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/media'));
  });

  gulp.task('fonts', function(){
    return gulp.src(['../common/src/assets/fonts/**/*'])
      .pipe(gulp.dest('temp/fonts'));
  });

  gulp.task('fonts:prod', function () {
    return gulp.src(['../common/src/assets/fonts/**/*'])
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/fonts'));
  });

  gulp.task('copy', ['fake', 'media', 'fonts']);


  // fichiers générés par Gulp (common)
  gulp.task('copyIconFont', function () {
    return gulp.src(['../dist/common/fonts/**/*'])
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/fonts'));
  });

  gulp.task('copyImages', function () {
    return gulp.src(['../dist/common/images/**/*'])
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/images'));
  });

  gulp.task('copy:prod', ['fake:prod', 'media:prod', 'copyIconFont', 'copyImages', 'fonts:prod']);
};
