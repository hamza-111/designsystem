;(function ($, window, document, E, undefined) {

  'use strict';

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
  abMediaQuery({
    delay: 500
  });

  if (E.debug) {
    // display current media queries
    console.log(AB.mediaQuery.current);
    window.addEventListener('changed.ab-mediaquery', function(){
      console.log(AB.mediaQuery.current);
    });
  }

  // init AB-interchange: https://github.com/lordfpx/AB-interchange
  abInterchange({
    lazy:       false,
    delay:      100,
    offscreen:  1.5
  });


  $(document).ajaxComplete(function(event, xhr, settings) {
    // vérification du format de réponse (HTML)
    try {
      $(xhr.responseText);
    } catch(e) {
      return;
    }

    // re-init AB-interchange in xhr
    if ($(xhr.responseText).find('[data-ab-interchange]').length > 0) {
      abInterchange({
        lazy:       false,
        delay:      100,
        offscreen:  1.5
      });
    }

    // reinit des plugins
    E.launchUpdaters();
  });

})(jQuery, window, document, window.E || {});