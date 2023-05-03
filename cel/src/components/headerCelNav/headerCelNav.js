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
  
    var pluginName = 'eMaskCalc',
        attr       = 'data-e-maskCalc', 
        defaults   = {
          aString: '',
          aBolean: true
        };
  
    function Plugin(el, options) {
      this.el = el;
      this.nav = document.querySelector(".c-headerCelNav__wrapper");
      this.mask = this.el.querySelector(".c-headerCel__maskClose");
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
        document.addEventListener('mouseover', this.calcule.bind(this));
  
        return this;
      },
  
      // Miscellaneous method
      calcule: function() {
        if (this.nav != null) {
          var NavHeight = this.nav.offsetHeight;
          var wrapperHeight = this.el.offsetHeight;
          this.mask.style.height = (wrapperHeight - NavHeight) +"px";
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
  