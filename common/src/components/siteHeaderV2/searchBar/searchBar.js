/*
  Description:
  read commentaire from boleplate.js
  gestion du comportement de la bar de recherche du header

  HTML:
  <div class="c-searchBar v3 is-active" data-e-searchbar="data-e-searchbar"></div>

  JS usage:
  Initialisation :
  E.plugins.eMyplugin(); // avec éventuellement des paramètres

  Appler une méthode de l'extérieur :
  $0.eSearchbar.activeMod()
  $0.eSearchbar.closeMod()
*/


;(function($, window, document, E, undefined){

    'use strict';
  
    var pluginName = 'eSearchbar', 
        attr       = 'data-e-searchbar', 
        defaults   = {
          aString: '',
          aBolean: true
        }; 
        
    var tabbable    = 'button, input, select, textarea, [tabindex], [contenteditable], a, video, iframe, embed, object, summary'

    // Our constructor
    function Plugin(el, options) { 
      this.el = el;

  
      // options taken from data-attribute
      var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
  
      // merge: defaults, specified when calling plugin and data-attribute
      this.settings   = E.extend(true, defaults, options, dataOptions);
  
      this.input    = this.el.querySelector('.c-searchBar__input');
      this.submit   = this.el.querySelector('.c-searchBar__submit');
      this.mask     = document.querySelector('.c-searchBar__mask');
      this.form     = document.querySelector('.c-searchBar__wrap form');
      this.body     = document.querySelector('body');
      this.tabbable = this.el.querySelector(tabbable);
      this.init();
    }
  
    Plugin.prototype = {

      init: function() {


        this.events();

        return this;
      },
  
      events: function() {
        var that = this;

        if (!that.input.value === false) {
          that.form.submit();
        }
    
        this.submit.addEventListener('click', function(e) {
          e.preventDefault();
          if (!that.input.value === false) {
              that.form.submit();
          }
        });

        this.submit.addEventListener('click', this.activeMod.bind(this));
        this.input.addEventListener('focus', this.activeMod.bind(this));
        this.mask.addEventListener('click', this.closeMod.bind(this));
        document.addEventListener('keyup', that.accessKey.bind(this));
  
        return this;
      },
      
      // Miscellaneous method
      activeMod: function() {
        // in IIFE, if passing 'window' and 'document',
        // You better specify 'window.' or 'document.'
        // to optimize performance a little bit

        this.input.focus();
        console.log(this.input)

        if (!this.el.classList.contains("is-active")) {
          this.el.classList.add("is-active");
          this.mask.classList.add("is-active");
          this.body.classList.add('no-scroll');
        }

        return this;
      },

      closeMod: function() {
        if (this.el.classList.contains("is-active")) {
          this.el.classList.remove("is-active");
          this.mask.classList.remove("is-active");
          this.body.classList.remove('no-scroll');
        }
      },

      accessKey: function(e) {
        var that = this,
            keycode = e.which;
  
        if (that.el.classList.contains("is-active")) {
          if (E.keyNames[keycode] === 'escape' ) {
            that.closeMod();
          }
  
  
          if (E.keyNames[keycode] === 'tab') {
            var lastElement = e.target.classList.contains('is-lastItem');
  
            if (lastElement) {
              window.setTimeout(function() {
                that.closeMod();
              }, 0);
            }
          }
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
  