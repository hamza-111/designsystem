/*
  START fullModal
*/
$(function(){

  'use strict';

  var $btnOpen = $('[data-e-fullModal-demo-open]'),
      $btnClose = $('[data-e-fullModal-demo-close]');


  $btnOpen.on('click', function(e) {
    var $fullModal = $(this).next('.c-fullModal');

    e.preventDefault();

    $fullModal.addClass('is-opened');
    E.noScroll.prevent();
  });

  $btnClose.on('click', function(e) {
    var $fullModal = $(this).closest('.c-fullModal');

    e.preventDefault();

    $fullModal.removeClass('is-opened');
    E.noScroll.allow();
  });

});
/*
  END fullModal
*/