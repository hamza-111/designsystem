/*
  carousel.js
  ----------

  Description:
  -----------
  Init pour slick carousel

  HTML:
  ---
  Pour initialiser directement
  data-slick

  ou pour initialiser en JS
  data-slick-delayed

  JS usage:
  --------
  Pour initialiser à nouveau (après changement DOM par exemple)
  E.initSlick();
*/

;(function ($, window, document, E, undefined) {

  'use strict';

  document.addEventListener('DOMContentLoaded', function(){

    var delayedSlick = function() {
      var $delayed = $('[data-slick-delayed]');

      $delayed.each(function() {
        var $this = $(this),
            slickOptions = $this.data('slick-delayed');

        $this
          .attr('data-slick', JSON.stringify(slickOptions))
          .removeAttr('data-slick-delayed');
      });
    };

    // init Slick Carousel
    E.initSlick = function() {
      // init slick quand nécessaire: éléments avec data-slick-delayed au lieu de data-slick
      if (AB.mediaQuery.is('smallOnly')) {
        delayedSlick();
      }

      var removeCenterMode = function() {
        if (this.slick.options.centerMode && this.slick.slideCount <= this.slick.options.slidesToShow) {
          this.slick.options.centerMode = false;
        }
      };

      var $dataSlick = $('[data-slick]').not('.slick-initialized');

      $dataSlick.each(function () {
        var $this = $(this),
            settings = {
              speed: 500,
              prevArrow: '<div class="slick-prev"><button type="button"><span class="u-theme-color icon icon-big-chevron-left"></span><span class="u-visibilityHidden">Précédent</span></button></div>',
              nextArrow: '<div class="slick-next"><button type="button"><span class="u-theme-color icon icon-big-chevron-right"></span><span class="u-visibilityHidden">Suivant</span></button></div>',
              customPaging: function(slider, i) {
                var customPage   = $('<div class="c-carousel__dot u-theme-color" />'),
                    customButton = $('<button type="button" data-role="none" role="button" tabindex="0" />').text(i + 1);
                return customPage.append(customButton);
              }
            };

        // avec l'option data-slick-singleNav: navigation déportée
        if ($this.is('[data-slick-singlenav]')) {
          var $nav           = $this.siblings('[data-slick-nav]'),
              singleNavClass = $this.data('slick-singlenav'),
              iconLeft       = 'icon-big-chevron-left',
              iconRight      = 'icon-big-chevron-right';

          settings.appendDots   = $nav.find('[data-slick-dots]');
          settings.appendArrows = $nav.find('[data-slick-arrows]');
          settings.prevArrow    = '<div class="slick-prev"><button type="button"><span class="icon '+iconLeft+'"></span><span class="u-visibilityHidden">Précédent</span></button></div>';
          settings.nextArrow    = '<div class="slick-next"><button type="button"><span class="icon '+iconRight+'"></span><span class="u-visibilityHidden">Suivant</span></button></div>';

          $this
            .slick(settings)
            // on breakpoint change : Fix centerMode bug when not enough slides
            .on('breakpoint', removeCenterMode);

        } else {
          $this
            .slick(settings)
            // on breakpoint change : Fix centerMode bug when not enough slides
            .on('breakpoint', removeCenterMode);
        }
      });

      // to fix that bug: https://github.com/kenwheeler/slick/issues/1808
      window.addEventListener('changed.ab-mediaquery', function(){
        $dataSlick.slick('resize');
      });

      // Init : Fix centerMode bug when not enough slides
      for (var i = 0, len = $dataSlick.length; i < len; i++) {
        removeCenterMode.call($dataSlick[i]);
      }
    };

    E.initSlick();

  });

})(jQuery, window, document, window.E || {});
