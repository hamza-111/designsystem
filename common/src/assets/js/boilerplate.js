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

  var pluginName = 'eMyplugin', // a naming convention with our 'e' inside
      attr       = 'data-e-myplugin', // to prevent collision with other data-attributes, '-e-'
      defaults   = {
        aString: '',
        aBolean: true
      }; // default options (always list ALL possible options here with default values)

  // Our constructor
  function Plugin(el, options) { //argument "option" is optionel when we want override the params
    this.el = el;

    // options taken from data-attribute
    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};

    // merge: defaults, specified when calling plugin and data-attribute
    this.settings   = E.extend(true, defaults, options, dataOptions);

    // we init the plugin
    this.init();
  }

  Plugin.prototype = {
    // all actions when doing init (usually building DOM, binding events)
    init: function() {
      this.events();

      // that allows us to chain methods,
      // for ex.: this.init().events() is possible
      return this;
    },

    events: function() {
      // sometimes it's needed to assign 'this' into a var
      // in order to use it side by side with other 'this'.
      // After that, always use 'that' for the plugin instance
      // to make code more readable (not mixing 'this' and 'that' everywhere)
      var that = this;

      // we need to call the 'this.callMe' method with 'that' as context.
      // Reminder: The 'this' value is given from the caller of the function,
      // Here, it's the clicked element, not the actual context of the plugin.
      this.el.addEventListener('click', this.callMe.bind(this));

      return this;
    },

    // Miscellaneous method
    callMe: function() {
      // in IIFE, if passing 'window' and 'document',
      // You better specify 'window.' or 'document.'
      // to optimize performance a little bit
      window.console.log(this.settings.aString);
      return this;
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
