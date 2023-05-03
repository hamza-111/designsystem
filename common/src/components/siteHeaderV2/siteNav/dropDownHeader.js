/*
  Description:
  ...

  HTML:
  ...

  JS usage:
  Initialisation :
  E.plugins.eDropDownHeader(); // avec éventuellement des paramètres

  Appler une méthode de l'extérieur :
  $0.eDropDownHeader.openWrap();
  $0.eDropDownHeader.closeWrap();
*/


;(function($, window, document, E, undefined){

  'use strict';

  var pluginName = 'eDropDownHeader',
      attr       = 'data-e-dropDownHeader',
      defaults   = {};

  function Plugin(el, options) {
    this.el = el;
    this.lien = this.el.querySelector('.c-siteHeaderV2CustomerArea__button');
    this.btn = this.el.querySelector('.c-siteHeaderV2__dropDown');
    this.close = this.btn.querySelector('.js-close');
    this.mask = this.el.querySelector('.c-siteHeaderV2__dropDown__mask');

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};

    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();

    if (this.el.classList.contains('no-js')) {
      this.el.classList.remove('no-js');
    }
      return this;
    },

    events: function() {
      var that = this;
      this.listener = {1:this.lien, 2:this.close, 3:this.mask};

      document.addEventListener('keyup', that.accessKeyboard.bind(that));

      for (var prop in this.listener) {
        this.listener[prop].addEventListener('click', this.toogleList.bind(this));
      }

      return this;
    },

    accessKeyboard: function(e) {
      var keycode = e.which;

      if (E.keyNames[keycode] === 'tab') {
        if (e.target.classList.contains('js-siteHeaderV2-lastChild')) {
          this.toogleList();
        }
      }
    },

    toogleList: function(e) {
        if (this.el.classList.contains('is-active')) {
          this.el.classList.remove('is-active');
        } else {
          this.el.classList.add('is-active');
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
    E.updaters[pluginName] = function() {
      E.plugins[pluginName]();
    };
  });

})(jQuery, window, document, window.E || {});
