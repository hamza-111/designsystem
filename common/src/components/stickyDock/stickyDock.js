/*
  stickyDock.js
  ---------
*/

;(function (window, document, E, undefined) {

  'use strict';

  var pluginName  = 'eStickydock',
      attr        = 'data-e-stickydock',
      attrTrigger = 'data-e-stickydock-trigger',
      attrLayer   = 'data-e-stickydock-layer';

  var defaults = {};

  function Plugin(el, options) {
    this.item       = el;

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.isOpened = false;

    if (!AB.mediaQuery.is('smallOnly')) {
      this._initSimple();
    } else {
      this._init();
    }
  }

  Plugin.prototype = {
    // ----- DESKTOP: seulement pour gérer hover/pas hover sur boutons ----
    _initSimple: function() {
      this.item.addEventListener('click', this.toggleSimple.bind(this));
      document.addEventListener('e-toggle.close-all', E.debounce(
        this.toggleSimple.bind(this)
      ), 250);
    },

    toggleSimple: function(e) {
      var expanded = this.item.querySelector('[aria-expanded="true"]');
      if (expanded) {
        this.item.classList.add('is-opened');
        return;
      } else {
        this.item.classList.remove('is-opened');
        return;
      }
    },
    // --------------------

    _init: function() {
      this.layer   = document.querySelector('['+ attrLayer +']');
      this.trigger = document.querySelector('['+ attrTrigger +']');

      this._events();
    },

    _events: function() {
      this.trigger.addEventListener('click', this.toggle.bind(this));
    },

    toggle: function(e) {
      this[this.isOpened ? 'close' : 'open']();
    },

    open: function(e) {
      if (this.isOpened) return;

      E.noScroll.prevent();
      this.isOpened = true;
      this.item.classList.add('is-opened');
      this.layer.classList.add('is-opened');
    },

    close: function(e) {
      if (!this.isOpened) return;

      E.noScroll.allow();
      this.isOpened = false;
      this.item.classList.remove('is-opened');
      this.layer.classList.remove('is-opened');
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
