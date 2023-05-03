/*
  Description:
  Banner only for mobile
  the Banner propose to dowload the Gaz Tarif Réglementé's App
*/

;(function(window, document, E, undefined){

  'use strict';

  document.addEventListener('DOMContentLoaded', function(){
    var btnMenu       = document.querySelector('.c-siteHeaderV2__mainNav__menu'),
        menuMobilMask  = document.querySelector('.c-siteHeader__mask');
        //stickyHeader  = document.querySelector('c-sticky');

    btnMenu && btnMenu.addEventListener('click' , function() {
    if (!menuMobilMask.classList.contains("is-active")) {
      menuMobilMask.classList.add("is-active"); 
      //stickyHeader.style = 'position : initial !important';
    } else {
      menuMobilMask.classList.remove("is-active");   
      //stickyHeader.style = 'position : fixed !important';
      }
    });

    menuMobilMask && menuMobilMask.addEventListener('click' , function() {
      if (!menuMobilMask.classList.contains("is-active")) {
        menuMobilMask.classList.add("is-active")
      } else {
        menuMobilMask.classList.remove("is-active")
      }
    });
    

  });
})(window, document, window.E || {});



