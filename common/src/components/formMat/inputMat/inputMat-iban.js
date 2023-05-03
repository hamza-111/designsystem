/*
inputMat-iban.js
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eIban',
      attr       = 'data-e-iban';

  var defaults   = {};

  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();
    },

    events: function() {
      var that = this;

      that.el.addEventListener('keyup', that.rewrite.bind(that));
    },

    rewrite: function() {
      var value          = this.el.value,
          foo            = value.split(' ').join(''),
          cursorPosition = this.el.selectionStart;

      if (foo.length > 0) {
        foo = foo.match(new RegExp('.{1,4}', 'g')).join(' ');
      }

      this.el.value = foo;

      this.el.selectionStart = this.el.selectionEnd = cursorPosition + (this.el.value.length - value.length);
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

})(window, document, window.E || {});

