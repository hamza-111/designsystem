/*
  espritService-comments.js
  -------------

*/

;(function ($, window, document, E, undefined) {

  'use strict';

  var $esComments = $('[data-e-es-comments]'),
      $accordion  = $esComments.find('[data-e-accordion]');

  // destroy l'instance de l'accordéon
  function destroyAccordion(cb) {
    $accordion.each(function(){
      if (this.eAccordion)
        this.eAccordion.destroy();
    });
  }

  // float en CSS ne place pas l'élément en haut du container -> on calcule un margin négatif
  function setMarginTop(e, i) {
    var thisTab      = $esComments.find('[data-e-accordion-tab]')[i],
        tabBottom    = thisTab.offsetTop + thisTab.offsetHeight,
        $thisPanel   = $esComments.find('[data-e-accordion-panel]'),
        accordionTop = $esComments.length === 0 ? 0 : $esComments.get(0).offsetTop;

    $thisPanel.css('margin-top', accordionTop - tabBottom +'px');
  }

  // à partir de la tablette...
  function initMedium() {
    destroyAccordion();

    // accordéon sans animation et non multiselectable
    E.plugins.eAccordion({
      jsSlideAnimation: false,
      multiselectable: false
    });

    $(document)
      .off('e-accordion.open')
      .on('e-accordion.open', setMarginTop);
  }


  // sur mobiles
  function initSmall() {
    $esComments.find('[data-e-accordion-panel]').css('margin-top', 0);

    $(document).off('e-accordion.open');

    destroyAccordion();

    // accordéon réinitialisé
    //$accordion.eAccordion();
    E.plugins.eAccordion();
  }

  if ($esComments.length > 0 && $accordion.length > 0) {
    // mobile -> init normal de l'accordéon, sinon:
    if (!AB.mediaQuery.is('smallOnly')) initMedium();

    $(window).on('resize.es-comments', E.debounce(function(){
      if (!AB.mediaQuery.is('smallOnly') && $accordion.attr('aria-multiselectable') === 'true') {
        initMedium();
        return;
      }

      if (AB.mediaQuery.is('smallOnly') && $accordion.attr('aria-multiselectable') === 'false') {
        initSmall();
        return;
      }
    }, 250));
  }

})(jQuery, window, document, window.E || {});