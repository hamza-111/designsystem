/*
  Description:
  -----------
  Retourne la position (X et Y) d'un élément par rapport au document
*/

;(function (window, document, E, undefined) {
  'use strict';

  E.getCoords = function(el) { // crossbrowser version
    var box = el.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
  };

})(window, document, window.E || {});
