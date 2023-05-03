/*
  openPopup.js
  ------------

  Description:
  -----------
  Ouverture des popup système

  HTML:
  ----
  data-e-popup="popup" ('popup' étant le nom de la popup)
*/

;(function (window, document, E, undefined) {

  'use strict';

  document.addEventListener('DOMContentLoaded', function(){

    document.addEventListener('click', function(e) {
      var clickedEl = e.target,
          link      = clickedEl.closest('[data-e-popup]');

      if(link) {
        e.preventDefault();
        var url        = link.getAttribute('href'),
            windowName = link.getAttribute('data-e-popup');

        window.open(url, windowName, 'height=700, width=600, toolbar=no, menubar=no, scrollbars=yes, resizable=no, location=no, directories=no, status=no');
      }
    });

  });

})(window, document, window.E || {});
