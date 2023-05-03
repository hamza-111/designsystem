/*
headerLight
*/

;(function(window, document, E, undefined){

  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    var lastScrollPos = 0,
        ticking       = false,
        header        = document.querySelector('[data-e-sticky-header]');

    if (!header) return;

    function changeHeader(scroll_pos) {
      if (window.scrollY < scroll_pos) {
        if (header.classList.contains('is-small'))
          header.classList.remove('is-small');
        return;
      }

      if (!header.classList.contains('is-small') && window.scrollY > 0)
        header.classList.add('is-small');
    }

    if (AB.mediaQuery.is('smallOnly')) {
      window.addEventListener('scroll', function(e) {
        if (!ticking) {
          window.requestAnimationFrame(function() {
            changeHeader(lastScrollPos);
            ticking = false;
            lastScrollPos = window.scrollY;
          });
        }
        ticking = true;
      });
    }
  });

})(window, document, window.E || {});