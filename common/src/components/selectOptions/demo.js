/*
  START SELECTOPTIONS
*/
$(function(){

  'use strict';

  var toggleCheck = function($elem, $checkBox){
    if ($elem.hasClass('is-checked')){
      $elem.removeClass('is-checked');
      $checkBox.prop('checked', false);
    } else {
      $elem.addClass('is-checked');
      $checkBox.prop('checked', true);
    }
  };

  $('.c-selectOptionBlock--hasCheckbox').on('click', function(e){
    var $this     = $(this),
        $target   = $(e.target),
        $checkBox = $this.find('.c-checkboxMat__field');

    // ne doit pas se faire au click sur espritService
    if (!$target.closest('.c-espritService-note').length) {
      toggleCheck($this, $checkBox);
      e.preventDefault();
    }
  });
});
/*
  END SELECTOPTIONS
*/