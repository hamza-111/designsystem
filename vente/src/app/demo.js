/*
START formStep
pour provoquer la transition des étapes (dans une modale ou non)
*/
$(function(){

  'use strict';

  var bubbleInput     = document.querySelectorAll('.c-bubble__input'),
      submitBtn       = document.querySelectorAll('button[type=submit]');

  // au changement des bubble (adapter suivant 'event' souhaité...)
  for (var i = 0, len = bubbleInput.length; i < len; i++) {
    bubbleInput[i].addEventListener('change', changeStep);
  }

  // au changement des bubble (adapter suivant 'event' souhaité...)
  for (var j = 0, len2 = submitBtn.length; j < len2; j++) {
    submitBtn[j].addEventListener('click', changeStep);
  }

  // Existe-t'il une nouvelle étape ?
  function changeStep() {
    /*jshint validthis: true */
    var source = this.closest('.c-formStep'), // -> étape courante
        next   = source.nextElementSibling;   // -> étape suivante

    if (next) {
      next.classList.add('is-active');

      // méthode incluse dans l'objet E
      E.scrollTo({
        source: source,
        next:   next,
        center: true,
        offset: 90
      });
    }
  }

});
/*
END formStep
*/