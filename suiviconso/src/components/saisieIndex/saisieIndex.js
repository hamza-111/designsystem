;(function(window, document, E, undefined) {

  'use strict';

  document.addEventListener("DOMContentLoaded", function() {
    if (!document.getElementById('c-saisieIndexDate'))
    return;

    var event = new Date();
    var options = { year: 'numeric', month: 'long', day: 'numeric' };

    var inputDate = document.getElementById("c-saisieIndexDate");
    inputDate.value = event.toLocaleDateString('fr-DE', options);

  });


})(window, document, window.E || {});