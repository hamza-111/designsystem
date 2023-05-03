/*
  textareaMat.js

  Compteur de charactères dans un textarea.

  HTML
  ----
  - data-e-textcounter sur le container
  - un textarea avec un maxlength
  - data-e-textcounter-count sur un enfant pour afficher le compte
*/

;(function (window, document, E, undefined) {

  'use strict';

  var pluginName = 'eTextcounter',
      attr       = 'data-e-textcounter',
      defaults   = {};

  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.textarea = this.el.querySelector('textarea');
    this.count    = this.el.querySelector('[data-e-textcounter-count]');
    this.val      = 0;
    this.max      = this.textarea.maxLength;

    this.init();
  }

  Plugin.prototype = {
    init: function () {
      this.events();
    },

    events: function () {
      var that = this;

      that.el.addEventListener('keyup', that.update.bind(that));
    },

    update: function() {
      this.val = this.textarea.value.length;

      this.count.innerText = this.val;
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
