/*
visualChoice
Description:
- l'attribut <code>data-e-visualchoice</code> doit etre dans le block wrapper <code>c-visualChoiceWrap</code> qui contiendra les item vi
- la valeur de du <code>for</code> doit etre le même que l'<code>id</code> de l'input
- les input doivent avoir le même name pour formé un groupe de choix

  JS usage:
  Initialisation :
  E.plugins.eVisualChoice(); // avec éventuellement des paramètres

  Appeler une méthode de l'extérieur :
  $0.eVisualChoice.focusTarget();

*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eVisualChoice',
      attr       = 'data-e-visualchoice';

  var defaults   = {
    mode:false
  };

  function Plugin(el, options) {
    this.el = el;


    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.mode = this.settings.mode;
    this.visualChoice = this.el.querySelectorAll('.c-visualChoice');
    
    this.choice01 = this.el.querySelector('#choice01');
    this.choice02 = this.el.querySelector('#choice02');

    this.blockChoice1 = this.el.querySelector('.c-evaluationFAQ__content__choice1');
    this.blockChoice2 = this.el.querySelector('.c-evaluationFAQ__content__choice2');



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



      this.choice01.addEventListener('click', that.evaluationFAQ_true.bind(that));
      this.choice02.addEventListener('click', that.evaluationFAQ_false.bind(that));


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
    },

    evaluationFAQ_true: function(e) {
      this.el.classList.add("is-true");
      this.el.classList.remove("is-false");
    },

    evaluationFAQ_false: function(e) {
      this.el.classList.add("is-false");
      this.el.classList.remove("is-true");
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

