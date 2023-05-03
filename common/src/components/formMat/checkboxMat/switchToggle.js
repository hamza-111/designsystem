/*
  Description:
  eSwitchToggle is a toggle switch with 2 elements
  - for a connection with the event element and the blocContent, put the same Value
  - in the blocContent put the attribute
    - [aria-hidden="true"] => to reference for the bloc default who will be appear
    - [aria-hidden="false"] => to reference the bloc who will be hidden
    - [hidden] => put in the blocContent who will be hidden

  HTML:
  <button data-e-switch-toggle="tata"> Switch Toggle </button>

  <section data-e-switch-toggle-name="tata"></section>
  <section data-e-switch-toggle-name="tata"></section>

  data-e-switch-toggle sert à déclencher le toggle, data-e-switch-toggle-name est la cible du toggle.
  Le script fonctionne en injectant un attribut aria-hidden à la cible du toggle, lui attribuant la valeur false pour l'afficher ou true pour le masquer.

  JS usage:
  Initialisation :
  E.plugins.eSwitchToggle();

  Appler une méthode de l'extérieur :
  $0.eSwitchToggle.callMe();
  $0.eSwitchToggle.event()
  $0.eSwitchToggle.hideBloc()
  $0.eSwitchToggle.showBloc()
  $0.eSwitchToggle.switchToggle()
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eSwitchToggle',
      attr       = 'data-e-switch-toggle';

  var defaults   = {};

  // Our constructor
  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.elValue       = this.el.getAttribute(attr);
    this.blocContent   = document.querySelectorAll('[data-e-switch-toggle-name="'+ this.elValue +'"]');
    this.inputCheckbox = this.el.querySelector('input[type="checkbox"], input[type="radio"]');

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.initToggle()
          .events();

      return this;
    },

    initToggle: function () {
      for (var i = 0, len = this.blocContent.length; i < len; i++) {
        if (this.blocContent[i].hasAttribute("hidden")) {
          this.blocContent[i].setAttribute("aria-hidden", "true");
        } else {
          this.blocContent[i].setAttribute("aria-hidden", "false");
        }
      }

      return this;
    },

    events: function() {
      var that = this;

      if (this.inputCheckbox) {
        this.el.addEventListener('change', that.switchToggle.bind(that));
      } else {
        this.el.addEventListener('click', E.debounce(function (e) {
          that.switchToggle();
        }, 150));
      }

      return this;
    },

    hideBloc: function(el) {
      el.setAttribute("aria-hidden", "true");
      el.setAttribute("hidden", "hidden");

      if (el.tagName === 'FIELDSET')
        el.setAttribute("disabled", "disabled");
    },

    showBloc: function(el) {
      el.setAttribute("aria-hidden", "false");
      el.removeAttribute("hidden");

      if (el.tagName === 'FIELDSET')
        el.removeAttribute("disabled");
    },

    switchToggle: function() {
      for (var i = 0, len = this.blocContent.length; i < len; i++) {
        if (this.blocContent[i].hasAttribute('hidden'))
          this.showBloc(this.blocContent[i]);
        else
          this.hideBloc(this.blocContent[i]);
      }

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

})(window, document, window.E || {});
