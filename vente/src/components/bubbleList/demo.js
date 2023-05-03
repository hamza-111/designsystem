/*
  START bubbleList
  http://codepen.io/lordfpx/pen/OpQXgN?editors=0110
*/

$(function(){

  'use strict';

  $('.c-bubbleList__content').on('change', '.c-bubble__input', function(e){
    var $this           = $(this),
        $bubbleParent   = $this.closest('.c-bubble'),
        $bubbleWrap     = $this.closest('.c-bubbleList__content'),
        $bubbleAncester = $this.closest('.c-bubbleList'),
        $bubbles        = $bubbleWrap.find('.c-bubble'),
        stateClass      = 'c-bubble--',
        states          = [],
        thisIndex       = $bubbles.index($bubbleParent);

    /**
     * Ajout d'une classe "c-bubble--[xxx]" au composant parent "c-bubbleList__content" où pour [xxx] :
     * - x vaut 0 ou 1 (ex: c-bubble--001, c-bubble--10 etc... )
     * - la quantité de x indique la quantité de composant ".c-bubble" dans ".c-bubbleList__content" (c-bubble--[xx] pour deux, c-bubble--[xxx] pour trois)
     * - la valeur de x indique lequel des composants ".c-bubble" à la classe "is-checked" et l'état "checked" de l'input radio "c-bubble__input" : 0 par défaut et 1 pour checked (ex: c-bubble--[100] => le premier des trois est checked, c-bubble--[01] => le second des deux est checked)
     */
    for (var i = 0, len = $bubbles.length; i < len; i++) {
      if (i === thisIndex) {
        states.push(1);
      } else {
        states.push(0);
      }
    }
    stateClass = stateClass + states.join("");

    // Ajout dynamique d'une classe "is-checked" au composant ".c-bubble"
    $bubbleParent
      .addClass('is-checked')
      .siblings('.c-bubble')
        .removeClass('is-checked');

    // Ajout dynamique d'une classe c-bubble--[xxx]" au composant "c-bubbleList__content"
    $bubbleWrap
      .removeClass('c-bubble--10 c-bubble--01 c-bubble--100 c-bubble--010 c-bubble--001')
      .addClass(stateClass);

    $bubbleAncester.removeClass('is-waiting');

    return;
  });

});
/*
  END bubbleList
*/