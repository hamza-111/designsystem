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
/*
DEMO: affichage suggestions (inputMat avec suggestions)
*/
;(function (window, document, E, undefined) {

  'use strict';

  $('.c-inputMat--suggest').find('input')
    .on('keyup.suggest', function(){
      var $this = $(this),
          $suggest = $this.siblings('.c-suggest');

      if ($this.val()) {
        $suggest.addClass('is-active');
      } else {
        $suggest.removeClass('is-active');
      }
    });

  $('.c-suggest').on('click', '.c-suggest__item', function(){
    var $this  = $(this),
        $list  = $this.closest('.c-suggest'),
        $input = $this.closest('.c-inputMat').find('input'),
        text   = $this.find('.c-suggest__label').text();

    $input.val(text);
    $list.removeClass('is-active');
  });

})(window, document, window.E || {});



/*
DEMO: Label flottant
*/
;(function (window, document, E, undefined) {

  'use strict';

  var pluginName = 'eFloatLabel',
    attr = 'data-e-float-label';

  var defaults = {
    classUp: 'is-focus'
  };

  function Plugin(el, options) {
    this.el = el;
    this.input = this.el.querySelector('input');

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings = E.extend(true, defaults, options, dataOptions);

    this.init();
  }

  Plugin.prototype = {
    init: function () {
      var that = this;

      // for browser autofill without user interaction
      // based on value for Firefox
      // based on -webkit-autofill for Chrome (see CSS)
      setTimeout(function () {
        if (that.input.value || getComputedStyle(that.input, ':-webkit-autofill').content === '"filled"') {
          that.up();
        }
      }, 100);

      that.events();
    },

    events: function () {
      var that = this;

      that.input.addEventListener('focus', that.moveLabel.bind(that));
      that.input.addEventListener('change', that.moveLabel.bind(that));

      that.input.addEventListener('blur', that.moveLabel.bind(that));
    },

    moveLabel: function (e) {
      if (e.type === 'focus' || e.type === 'change') {
        if (!this.el.classList.contains(this.settings.classUp)) {
          this.up();
        }
        return this;
      }

      if (e.type === 'blur' && !this.input.value) {
        this.down();
        return this;
      }
    },

    up: function () {
      this.el.classList.add(this.settings.classUp);
    },

    down: function () {
      this.el.classList.remove(this.settings.classUp);
    }
  };

  E.plugins[pluginName] = function (options) {
    var elements = document.querySelectorAll('[' + attr + ']');
    for (var i = 0, len = elements.length; i < len; i++) {
      if (elements[i][pluginName]) continue;
      elements[i][pluginName] = new Plugin(elements[i], options);
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    E.plugins[pluginName]();
    E.updaters[pluginName] = function () {
      E.plugins[pluginName]();
    };
  });

})(window, document, window.E || {});


