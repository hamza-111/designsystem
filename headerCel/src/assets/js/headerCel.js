;(function ($, window, document, E, undefined) {

  'use strict';

  window.E = {
    version: '<% version %>', // remplacé via gulp-replace par le tag de version
    updaters: {}, // utilisé pour réinitialiser les plugin après réponse ajax
    plugins: {} // we store our plugins here
  };

  $(function() {
    // activate debug mode
    if (document.documentElement.hasAttribute('data-debug')) {
      E.debug = true;
    }

    // IE8 needs the console object to be created
    if (!window.console) {
      window.console = {
        log: function () { },
        warn: function () { },
        error: function () { },
        time: function () { },
        timeEnd: function () { }
      };
    }

    // init AB-mediaQuery: https://github.com/lordfpx/AB-mediaQuery
    abMediaQuery();

    if (E.debug) {
      // display current media queries
      console.log(AB.mediaQuery.current);
      window.addEventListener('changed.ab-mediaquery', function(){
        console.log(AB.mediaQuery.current);
      });
    }
  });

})(jQuery, window, document, window.E || {});
