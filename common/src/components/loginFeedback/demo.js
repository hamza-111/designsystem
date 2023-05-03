/*
START loginFeedback
*/
$(function(){

  'use strict';

  var $loginFeedback = $('.c-loginFeedback');

  $loginFeedback.addClass('is-opened');

  setTimeout(function(){
    $loginFeedback.removeClass('is-opened').addClass('is-closed');
  }, 6000);

});
/*
END loginFeedback
*/