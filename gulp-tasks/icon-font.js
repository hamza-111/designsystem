module.exports = function (gulp, P, S) {

  'use strict';

  var runTimestamp = Math.round(Date.now()/1000);

  gulp.task('svg-optim', function () {
    return gulp.src(S.common + '/src/assets/icons/**/*')
      .pipe(P.cache(P.imagemin()))
      .pipe(gulp.dest(S.common + '/src/assets/icons'))
      .pipe(P.browserSync.stream());
  });

  gulp.task('iconfont', ['svg-optim'], function () {
    return gulp.src(S.common +'/src/assets/icons/*.svg')
      .pipe(P.iconfont({
        fontName:           'icons',
        formats:            ['ttf', 'woff', 'woff2'],
        prependUnicode:     true,
        centerHorizontally: true,
        normalize:          true,
        fontHeight:         448, // matching IcoMoon's defaults for the font-awesome icons @ "14px grid"
        descent:            64
      }))
      .on('glyphs', function(glyphs) {
        gulp.src('src/assets/scss/templates/_icons.scss')
          .pipe(P.consolidate('lodash', {
            glyphs:    glyphs,
            fontName:  'icons',
            fontPath:  '../fonts/',
            className: 'icon',
            timestamp: 0
          }))
          .pipe(gulp.dest('src/assets/scss'));

        // json for back usage in CQ
        gulp.src('src/assets/scss/templates/fontIcons.json')
          .pipe(P.consolidate('lodash', {
            glyphs: glyphs
          }))
          .pipe(gulp.dest('temp/json'));
      })
      .pipe(gulp.dest('temp/fonts/'))
      .pipe(P.browserSync.stream());
  });

  gulp.task('iconfont:prod', ['svg-optim'], function () {
    return gulp.src(S.common + '/src/assets/icons/*.svg')
      .pipe(P.iconfont({
        fontName: 'icons',
        formats: ['ttf', 'woff', 'woff2'],
        prependUnicode: true,
        centerHorizontally: true,
        normalize: true,
        fontHeight: 448, // matching IcoMoon's defaults for the font-awesome icons @ "14px grid"
        descent: 64
      }))
      .on('glyphs', function (glyphs) {
        gulp.src('src/assets/scss/templates/_icons.scss')
          .pipe(P.consolidate('lodash', {
            glyphs: glyphs,
            fontName: 'icons',
            fontPath: '../fonts/',
            className: 'icon',
            timestamp: 0
          }))
          .pipe(gulp.dest('src/assets/scss'));

        // json for back usage in CQ
        gulp.src('src/assets/scss/templates/fontIcons.json')
          .pipe(P.consolidate('lodash', {
            glyphs: glyphs
          }))
          .pipe(gulp.dest('../dist/'+ S.pkg.name +'/json'));
      })
      .pipe(gulp.dest('../dist/'+ S.pkg.name +'/fonts/'))
      .pipe(P.browserSync.stream());
  });

};
