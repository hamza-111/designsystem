;(function(window, document, E, undefined) {
  'use strict';

  E.isJson = function(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

})(window, document, window.E || {});