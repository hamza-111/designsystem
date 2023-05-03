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

  var pluginName = 'eToggleText',
      attr       = 'data-e-toggleText', 
      defaults   = {
        aString: '',
        aBolean: true
      };

  // Our constructor
  function Plugin(el, options) { 
    this.el = el;
    this.target = document.querySelector(".c-toggleBox__btn");
    this.text = document.querySelector(".c-toggleBox__btn span");

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

      this.target.addEventListener('click', this.toggleText.bind(this));

      return this;
    },

    toggleText: function() {
      if(this.target.classList.contains("is-active")) {
        this.text.innerHTML = "Fermer le détail de l'estimation";
      }

      else {
        this.text.innerHTML = "Ouvrir le détail de l'estimation";
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
    // when we use ajax, init again the plugin
    E.updaters[pluginName] = function() {
      E.plugins[pluginName]();
    };
  });

})(jQuery, window, document, window.E || {});
