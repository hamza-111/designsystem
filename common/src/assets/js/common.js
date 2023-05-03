;(function ($, window, document, E, undefined) {

  'use strict';

  // activate debug mode
  if (document.documentElement.hasAttribute('data-debug')) {
    E.debug = true;
  }


  //Add Modernizr test
  if (navigator.userAgentData) {
    // utiliser navigator.userAgentData pour récupérer des informations sur l'utilisateur et le navigateur
    var userAgentData = navigator.userAgentData;

    if (userAgentData && userAgentData.mobile) {
      if (userAgentData.platform === 'iOS') {
        // utilise un appareil iOS
        document.documentElement.classList.add('ios');
        Modernizr.ios = true;
      } else {
        // utilise un autre appareil mobile
        document.documentElement.classList.add('no-ios');
        Modernizr.ios = false;
      }
    }      
  } else {
    // alternative si navigator.userAgentData n'est pas pris en charge
    if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
      document.documentElement.classList.add('ios');
      Modernizr.ios = true;
    } else {
      document.documentElement.classList.add('no-ios');
      Modernizr.ios = false;
    }
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


  // tagging: mise à jour datalayer dans cas précis
  (function(){
    var tcCategories = ['form_newcustomer', 'form_cause', 'motif', 'sous_motif'],
        pathName     = window.location.pathname,
        thankYouPage = E.storage.getItem("thank_you_page");

    if (typeof tc_vars === 'undefined') window.tc_vars = {};

    if (thankYouPage !== null && thankYouPage.indexOf(pathName) !== -1 ) {
      for (var i = 0, len = tcCategories.length; i < len; i++) {
        window.tc_vars[tcCategories[i]] = E.storage.getItem(tcCategories[i]);
      }
      window.tc_vars.order_id = E.storage.getItem('order_id');
    }

    E.storage.removeItem(tcCategories);
    E.storage.removeItem(['order_id', 'thank_you_page']);
  })();


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