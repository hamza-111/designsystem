/*
visualChoice
Description:
- l'attribut <code>data-e-visualchoice</code> doit etre dans le block wrapper <code>c-visualChoiceWrap</code> qui contiendra les item vi
- la valeur de du <code>for</code> doit etre le même que l'<code>id</code> de l'input
- les input doivent avoir le même name pour formé un groupe de choix

  JS usage:
  Initialisation :
  E.plugins.eVisualChoice(); // avec éventuellement des paramètres

  Appler une méthode de l'extérieur :
  $0.eVisualChoice.focusTarget();

*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eVisualChoice',
      attr       = 'data-e-visualchoice';

  var defaults   = {};

  function Plugin(el, options) {
    this.el = el;
    this.visualChoice = this.el.querySelectorAll('.c-visualChoice');

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

      for (var itemVisual = 0; itemVisual < this.visualChoice.length; itemVisual++) {
        this.visualChoice[itemVisual].addEventListener('click', that.focusTarget.bind(that));
      }
    },

    _initStats: function() {
      for (var i = 0; i < this.visualChoice.length; i++) {
          this.visualChoice[i].classList.add("is-unChecked");
          this.visualChoice[i].classList.remove("is-checked");
      }
    },

    _selected: function(e) {
      e.currentTarget.classList.add("is-checked");
      e.currentTarget.classList.remove("is-unChecked");
    },

    focusTarget: function(e) {
      this._initStats();
      this._selected(e);
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

