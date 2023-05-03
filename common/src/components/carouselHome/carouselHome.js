/*
  carouselHome.js
  -----------

  Description:
  -----------
  switch entre block et carousel selon breakpoint.
  en mobile, pas de carousel et affichage élément spécifique
*/

;(function (window, document, E, undefined) {

  'use strict';

  window.addEventListener('load', function(){
    var imgIndex = 0;

    // Fonction récursive : assigne au src de l'image le contenu de l'attribut data-slick-img-src :
    var loadImg = function(elem){

      if (imgIndex === elem.length) return;

      var target = elem[imgIndex],
          imgSrc = target.getAttribute('data-slick-img-src');

      target.setAttribute('src', imgSrc);

      target.addEventListener('load', function(){
        imgIndex++;
        loadImg(elem);
      });
    };

    // init slick quand nécessaire: éléments avec data-slick-home au lieu de data-slick
    var initCarouHome = function(){

      if (AB.mediaQuery.is('medium')) {
        var home = document.querySelector('[data-slick-home]');

        if (!home) return;

        var slickOptions = home.getAttribute('data-slick-home'),
            homeImg      = home.querySelectorAll('[data-slick-img-src]');

        home.setAttribute('data-slick', slickOptions);
        home.removeAttribute('data-slick-home');

        if (E.initSlick) {
          E.initSlick();

          loadImg(homeImg);
        }
      }
    };

    window.setTimeout(initCarouHome, 1000);
  });

})(window, document, window.E || {});
