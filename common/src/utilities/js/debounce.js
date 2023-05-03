;(function(window, document, E, undefined) {
  'use strict';

  E.debounce = function(callback, delay) {
    var timer;

    return function() {
      var args    = arguments,
          context = this;

      window.clearTimeout(timer);
      timer = window.setTimeout(function() {
        callback.apply(context, args);
      }, delay);
    };
  };

})(window, document, window.E || {});