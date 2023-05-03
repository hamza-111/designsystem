;(function(window, document, E, undefined) {
  'use strict';

  E.ABtestHeaderHover2Click = function() {
    // Js pour AB-test burger desktop UNIQUEMENT
    // supprimer après AB-test

    var elements = document.querySelectorAll('[data-e-expand]');

    for (var i = 0, len = elements.length; i < len; i++) {
      elements[i].eExpand.hover2click();
    }

    $('.c-siteHeader').off('mouseleave.expand-body');

    $(document).on('click.expand-body', function(e) {
      var $target = $(e.target);

      if (!$target.closest('.c-siteHeader').length) {
        $('[data-e-expand]').each(function() {
          this.eExpand.close();
        });
      }
    });
  };

})(window, document, window.E || {});