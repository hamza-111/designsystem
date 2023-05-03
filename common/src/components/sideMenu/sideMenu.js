/*
  sideMenu.js
  -----------

  Description:
  composant sideMenu

*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'esideMenu',
      attr       = 'data-e-side-menu';

  var defaults   = {
    target: '',
    sideContent: '',
    classToOpen: 'is-menu-open',
    classToClose: 'is-menu-close',
    preventScroll: false,
    runsOnPhone: true,
    runsOnPad: true,
    runsOnDesktop: true
  };

  function Plugin( el, options ) {
    this.item       = el;

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.target         = this.settings.target;
    this.sideContent    = this.settings.sideContent;
    this.classToOpen    = this.settings.classToOpen;
    this.classToClose   = this.settings.classToClose;
    this.preventScroll  = this.settings.preventScroll;
    this.runsOnPhone    = this.settings.runsOnPhone;
    this.runsOnPad      = this.settings.runsOnPad;
    this.runsOnDesktop  = this.settings.runsOnDesktop;
    this.toggleButton   = '';
    this.isOpened       = false;

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;

      if (!this.getValues()) return;

      this.events();
    },

    events: function() {
      var that = this;

      if ( !this.runsOnPhone && AB.mediaQuery.is('small')) return;
      if ( !this.runsOnPad && AB.mediaQuery.is('medium')) return;
      if ( !this.runsOnDesktop && AB.mediaQuery.is('large')) return;

      for (var i = 0, len = this.toggleButton.length; i < len; i++) {
        this.toggleButton[i].addEventListener('click', that.toggle.bind(that));
      }
    },

    getValues: function(){
      this.sideContent = this.sideContent ? document.querySelector('[data-e-side-menu-content="' + this.sideContent + '"]') : undefined;
      this.toggleButton = this.target ? document.querySelectorAll('[data-e-side-menu-target="' + this.target + '"]') : undefined;

      return this.sideContent && this.toggleButton;
    },

    toggle: function(){
      if ( this.isOpened ) {
        this.close();
      } else  {
        this.open();
      }
    },

    open: function(){
      // Utilise le noScroll pour empêcher le scroll du document à l'ouverture du menu
      if (this.preventScroll) {
        E.noScroll.prevent();
      }

      this.item.classList.remove(this.classToClose);
      this.item.classList.add(this.classToOpen);

      this.sideContent.classList.remove(this.classToClose);
      this.sideContent.classList.add(this.classToOpen);

      this.isOpened = true;
    },

    close: function(){
      // Réactive le scroll du document
      if (this.preventScroll) {
        E.noScroll.allow();
      }

      this.item.classList.remove(this.classToOpen);
      this.item.classList.add(this.classToClose);

      this.sideContent.classList.remove(this.classToOpen);
      this.sideContent.classList.add(this.classToClose);

      this.isOpened = false;
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