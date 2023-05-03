/*
  START promoBanner
*/
$(function(){

  'use strict';

  $('.c-promoBanner__wrapper').each(function(){
    var $this      = $(this),
        interval   = false,
        $items     = $this.find('.c-promoBanner__item'),
        nbr        = 0;

    var animate = function() {
      $items
        .removeClass('is-active')
        .eq(nbr)
          .addClass('is-active');
      nbr++;

      if (nbr === $items.length) nbr = 0;
    };

    interval = setInterval(animate, 3000);
  });
});
/*
  END promoBanner
*/