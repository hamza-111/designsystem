/*
  backToTop.js

  Description:
  spécificité js de ce composant permet de gere juste sont apparition au scroll

  HTML:
  Ajouter l'attribut [data-e-backtotop] sur un élément HTML
*/

;(function(window, document, E, undefined){

  'use strict';

  document.addEventListener('DOMContentLoaded', function(){
    var back2top = document.querySelector('[data-e-backtotop]'),
        ticking  = false;

    if (!back2top) return;

    function back2TopStatus() {
      document.documentElement.scrollTop >= 100 ?
        back2top.classList.add("is-active") : back2top.classList.remove("is-active");
    }

    if (AB.mediaQuery.is('smallOnly')) {
      window.addEventListener('scroll', function(e) {
        if (!ticking) {
          window.requestAnimationFrame(function() {
            back2TopStatus();
            ticking = false;
          });
        }
        ticking = true;
      });
    }
  });

})(window, document, window.E || {});
