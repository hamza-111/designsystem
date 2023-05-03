/*
inputMat password
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'ePassword',
      attr       = 'data-e-password';

  var defaults   = {};

  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.input      = this.el.querySelector('input');
    this.btn        = this.el.querySelector('[data-e-showpassword]');

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();
    },

    events: function() {
      var that = this;

      that.btn.addEventListener('click', that.togglePassword.bind(that));
    },

    togglePassword: function() {
      this.btn.classList.toggle('icon-eye');
      this.btn.classList.toggle('icon-eye-slash');

      if (this.input.getAttribute('type') === 'password') {
        this.input.setAttribute('type', 'text');
      } else {
        this.input.setAttribute('type', 'password');
      }
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

