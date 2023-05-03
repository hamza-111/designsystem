// data-e-foreign-target
// data-e-foreign-toggle


;(function($, window, document, E, undefined){
  'use strict';

  $(function() {
    var $foreign = $('[data-e-foreign-toggle]');

    if ( !$foreign.length ) return;

    var foreign = document.querySelector('[data-e-foreign-toggle]');

    function foreignToggle( namevalue, pattern1, pattern2, maxlength1, maxlength2  ){

      var $inputMat = $("input[id='"+ namevalue + "']"),
          attr = $inputMat.attr('pattern'),
          attr2 = 'pattern 2';

      if ( $inputMat.attr("pattern") === pattern1 ) {
        $inputMat.attr('pattern', pattern2)
                 .attr('maxlength',maxlength2);
      } else {
        $inputMat.attr('pattern', pattern1)
                 .attr('maxlength',maxlength1);
      }
    }

    $foreign.on("click", function(e) {
      var foreignValue = JSON.parse(this.getAttribute('data-e-foreign-toggle'));

      foreignToggle(
        foreignValue.id.name,
        foreignValue.id.pattern1,
        foreignValue.id.pattern2,
        foreignValue.id.maxlength1,
        foreignValue.id.maxlength2
      );
    });
  });
})(jQuery, window, document, window.E || {});