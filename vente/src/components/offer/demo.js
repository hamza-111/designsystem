/*
  START OFFER switch pour modifier
*/

$(function(){

  'use strict';

  $('.c-offer__editSwitch').on('click', function(e) {
    e.preventDefault();
    $(this).closest('.c-offer--shopList').addClass('is-active');
  });

  $(document).on('click', function(e) {
    if ($(e.target).closest('.c-offer__edit').length)
      return;

    $('.c-offer--shopList.is-active').removeClass('is-active');
  });
});

/*
  END OFFER switch pour modifier
*/