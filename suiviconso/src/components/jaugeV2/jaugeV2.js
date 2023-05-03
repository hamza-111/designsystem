/*
inputMat password
*/


;(function(window, document, E, undefined){

    'use strict';
  
    var pluginName = 'eJauge',
        attr       = 'data-e-jauge';
  
    var defaults   = {};
  
    function Plugin(el, options) {
      this.el = el;
      this.animate = this.el.querySelector('.c-jaugeV2__animate');
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
  
          this.el.addEventListener('mouseover', that.isHovered.bind(that));
      },
  
    isHovered: function() {
        this.animate.style.display = "none";
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
  
  