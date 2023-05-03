/*
inputMat password
*/


;(function(window, document, E, undefined){

    'use strict';
  
    var pluginName = 'eSpeedScroll',
        attr       = 'data-e-speed-scroll';
  
    var defaults   = {};
  
    function Plugin(el, options) {
      this.el = el;
      
      this.scroll_position = 0;
      this.scroll_direction;
      this.timer = undefined;
      this.prior = window.scrollY;
      this.scrolling = false;
      this.target = document.querySelector(".c-headerCel--sousMenu")
  
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
          document.addEventListener('scroll', that.scrollVelocity.bind(that));
      },
  

      scrollVelocity : function(e) {
        this.scroll_direction = (document.body.getBoundingClientRect()).top > this.scroll_position ? true : false;
        this.scroll_position = (document.body.getBoundingClientRect()).top;
        //console.log(this.scroll_direction);
        if (this.scroll_direction) {
            //console.log( Math.abs(window.scrollY - this.prior))
            if (Math.abs(window.scrollY - this.prior) > 80) {
                this.target.classList.add("c-headerCel--sousMenuPartiel");
            }
          //end scroll velocity  
        }
        else {
            console.log("down");
            this.target.classList.remove("c-headerCel--sousMenuPartiel");
        }
        this.prior = window.scrollY


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
  
  