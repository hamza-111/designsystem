/*
  Description:
  ...

  HTML:
  ...

  JS usage:
  Initialisation :
  E.plugins.eMyplugin(); // avec éventuellement des paramètres

  Appler une méthode de l'extérieur :
  $0.eMyplugin.callMe();
*/


;(function($, window, document, E, undefined){

  'use strict';

  var pluginName = 'eFocus',
      attr       = 'data-e-focus',
      defaults   = {
        aString: '',
        aBolean: true
      };

  // Our constructor
  function Plugin(el, options) {
    this.el = el;
    this.target = this.el.querySelector('.c-inputMat__field');

   
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
      var that = this;
      window.addEventListener('DOMContentLoaded', this.getFocus.bind(this));

      return this;
    },
    getFocus: function() {
      window.console.log(this.target);
      this.target.focus();
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
