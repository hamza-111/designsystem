/*
  Description:
  -----------

*/

;(function (window, document, E, undefined) {
    'use strict';
  
    E.navigator = {};
    E.navigator.isFirefox = function () {
        //setting
        var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
            match = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./),
            ver = match ? parseInt(match[1]) : 0;
  
      // si le navigateur firefox très vieux il retourne un true
        if (isFirefox && (ver < 45)) {
            return true;
        }
        else
          return false;
    };
  })(window, document, window.E || {});
  