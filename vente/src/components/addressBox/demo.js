/*
  START addressBox
*/

;(function($, window, document, E, undefined){

  'use strict';

  var pluginName = 'eaddressBox',
      attr       = 'data-e-addressBox';

  var defaults   = {};

  function Plugin(el, options) {
    this.el = el;
    this.$item  = $(el);
    this.$boxItem = this.$item.find('.c-addressBoxItem');

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.init();
  }

  Plugin.prototype = {

    init: function() {
      this.events();

      return this;
    },

    events: function() {
      var that = this,
          boxInput = '.c-inputMat__field';

      // Saisie clavier sur l'input ou copier-coller :
      that.$boxItem.on('keypress input', boxInput, function(e){
        var $currentBox = $(this).closest('.c-addressBoxItem');

        that.toggleBoxItem($currentBox);
      });

      that.$item
        // Sélection de .not-selected au clique :
        .on('click', '.c-addressBoxItem.not-selected', function(){
          that.toggleBoxItem($(this));
          that.focusOnFirstInput($(this));
        })
        // Sélection de .not-selected au keypress si focus :
        .on('keydown', '.c-addressBoxItem.not-selected', function(e){
          if ($(this).is(':focus')) {
            if (e.which === 13 || e.which === 32) {
              e.preventDefault();

              that.toggleBoxItem($(this));
              that.focusOnFirstInput($(this));
            }
          }
        });

      return that;
    },

    toggleBoxItem: function(elem){
      var target = elem,
          brother = target.siblings('.c-addressBoxItem');

      target.removeClass('not-selected').removeAttr('tabindex');
      target.find('input, select').removeAttr('disabled tabindex');
      target.find('.c-addressBox__link').removeAttr('tabindex');

      brother.addClass('not-selected').attr('tabindex', '0');
      brother.find('input, select').val('').attr({disabled: 'disabled', tabindex: '-1'});
      brother.find('.c-addressBox__link').attr('tabindex', '-1');
    },

    focusOnFirstInput: function(elem){
      elem.find('.c-addressBox__input:first-of-type').focus();
    }
  };

  E.plugins[pluginName] = function(options) {
    var elements = document.querySelectorAll('['+ attr +']');
    for (var i = 0, len = elements.length; i < len; i++) {
      if (elements[i][pluginName]) continue;
      elements[i][pluginName] = new Plugin(elements[i], options);
    }
  };

  document.addEventListener('DOMContentLoaded', function(){
    E.plugins[pluginName]();
    E.updaters[pluginName] = function() {
      E.plugins[pluginName]();
    };
  });

})(jQuery, window, document, window.E || {});

/*
  END addressBox
*/