/*
  formContact-display.js
*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eFormContactBlock',
      attr       = 'data-e-formcontact-block',
      defaults   = {
        id: ''
      };

  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, dataOptions);

    this.id = this.settings.id;
  }

  Plugin.prototype = {
    hide: function() {
      var fieldsetNodes = this.el.querySelectorAll('fieldset:not([disabled])');

      this.el.setAttribute('hidden', 'true');
      this.el.setAttribute('disabled', 'disabled');

      for (var i = 0, len = fieldsetNodes.length; i < len; i++) {
        fieldsetNodes[i].setAttribute('disabled', 'disabled');
      }
    },

    show: function () {
      var fieldsetNodes = this.el.querySelectorAll('fieldset:not([hidden])');

      this.el.hidden = false;
      this.el.disabled = false;

      for (var i = 0, len = fieldsetNodes.length; i < len; i++) {
        fieldsetNodes[i].removeAttribute('disabled');
      }
    }
  };

  E.plugins[pluginName] = function() {
    var elements = document.querySelectorAll('['+ attr +']');
    for (var i = 0, len = elements.length; i < len; i++) {
      if (elements[i][pluginName]) continue;
      elements[i][pluginName] = new Plugin(elements[i]);
    }
  };

})(window, document, window.E || {});
