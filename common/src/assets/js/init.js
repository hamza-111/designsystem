;(function (window, undefined) {

  'use strict';

  // Create E global object
  // Use it to store variables, functions, etc...
  if (!window.E) {
    window.E = {
      version: '<% version %>', // remplacé via gulp-replace par le tag de version
      updaters: {}, // utilisé pour réinitialiser les plugin après réponse ajax
      plugins: {} // on garde les fonctions d'appel des plugins (pour les évboquer après un appel Ajax par ex.)
    };
  }

  // Pour reinitialiser les plugins en cas d'update du DOM (AJAX...)
  E.launchUpdaters = function() {
    for (var key in E.updaters) {
      if (!E.updaters.hasOwnProperty(key)) continue;
      E.updaters[key]();
    }
  };

}(window));

// document.addEventListener('DOMContentLoaded', (event) => {
//   if(window.location.hash !== null && window.location.hash !== ""){
//     window.scrollBy(0,-20);
//     setTimeout(function(){     
//       var classListHeader = document.querySelector(".c-siteHeaderV2.l-wrapper--hugue.c-sticky").classList;
//       classListHeader.remove("c-sticky--fixed");
//       classListHeader.add("c-sticky--unstickyTop");   },100);
//   }
// });