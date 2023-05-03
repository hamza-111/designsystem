/*
  Description:
  TooltipPoopers is a plugin for create and use infobull responsive
  https://popper.js.org/tooltip-examples.html
  
  HTML: 
  <element data-e-tooltipPopper: {reference, options}

  JS usage:
  Initialisation :
  E.plugins.eTooltipPopper(); // avec éventuellement des paramètres

  Appler une méthode de l'extérieur :
  $0.eTooltipPopper.launchInfobull();
*/


;(function($, window, document, E, undefined){

    'use strict';
  
    var pluginName = 'eTooltipPopper', 
        attr       = 'data-e-tooltipPopper', 
        defaults   = {
          position: 'top',
          text: ''
        }; // default options (always list ALL possible options here with default values)
  
    function Plugin(el, options) { 
      this.el = el;

      var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
  

      this.settings   = E.extend(true, defaults, options, dataOptions);

      this.init();
    }
  
    Plugin.prototype = {
      init: function() {
        this._createTooltip();
        //this.events();
        return this;
      },
  
      events: function() {
        // var that = this;
        
        this.el.addEventListener('mouseover', this.launchInfobull.bind(this));
  
        return this;
      },
  
      launchInfobull: function() {
        tooltip.show();
        return this;
      },

      _createTooltip: function() {
        new Tooltip(this.el, {
          title: this.settings.text,
          placement : this.settings.position
        });

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
      E.updaters[pluginName] = function() {
        E.plugins[pluginName]();
      };
    });
  
  })(jQuery, window, document, window.E || {});
  