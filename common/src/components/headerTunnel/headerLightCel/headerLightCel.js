/*
headerLightCel.js
*/

;(function(window, document, E, undefined){

  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    var lastScrollPos   = 0,
        ticking         = false,
        header          = document.querySelector('[data-e-sticky-header]'),
        // bannerApp       = document.querySelector('[data-e-bannerapp]'),
        // isBannerVisible = false,
        hasTitle        = document.querySelector('.c-headerLightCel__title');


    if (!header || !hasTitle) return;

    // function manageBanner(scroll_pos) {
    //   var bannerAppHeight = bannerApp.offsetHeight;

    //   if (scroll_pos < bannerAppHeight) {
    //     isBannerVisible       = true;
    //     header.style.position = 'absolute';
    //     header.style.top      = bannerAppHeight + 'px';
    //     return;
    //   }

    //   isBannerVisible       = false;
    //   header.style.position = 'fixed';
    //   header.style.top      = 0;
    // }

    function changeHeader(scroll_pos) {
      // Solution pas vraiment parfaite...
      // if (document.documentElement.classList.contains('has-bannerApp') && bannerApp) {
      //   manageBanner(scroll_pos);
      // }

      // if (isBannerVisible) return;

      if (window.scrollY < scroll_pos) {
        if (header.classList.contains('is-small')) {
          header.classList.remove('is-small');
        }
        return;
      }

      if (!header.classList.contains('is-small') && window.scrollY > 0) {
        header.classList.add('is-small');
      }
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
