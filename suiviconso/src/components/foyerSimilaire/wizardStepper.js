/*
  Description:
  ...

  HTML:
  ...

  JS usage:
  Initialisation :
  E.plugins.wizardLineStep(); // avec éventuellement des paramètres

  Appler une méthode de l'extérieur :
  $0.wizardStepper.goStep();
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'wizardStepper', 
      attr       = 'data-e-wizardStepper', 
      defaults   = {
        aString: '',
        aBolean: true
      };

  // Our constructor
  function Plugin(el, options) { //argument "option" is optionel when we want override the params
    this.el = el;
    this.link = this.el.querySelectorAll('[data-e-wizardStep]');
    this.step = document.querySelectorAll('[data-e-wizard]');
  
    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);
    
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();
      return this;
    },

    events: function() {
      var that = this;
      for(var j = 0; j < this.link.length; j++ ) {
        this.link[j].addEventListener('click' , this.goStep.bind(this));
      }

      return this;
    },

    //methods

    goStep: function(e) {
      var getAttrTarget = e.target.getAttribute('data-e-wizardStep');

      this.stepActive = document.querySelector('[data-e-wizard].is-active');
      this.selector = '.c-inputMat__field, .c-radioStyle__field, .c-radioMat__field';
      this.StepValidity = this.stepActive.querySelector(this.selector).checkValidity(); 

      if(this.StepValidity) {

        this.stepActive.classList.add('u-visibilityHidden');
        this.stepActive.classList.remove('is-active');
        
        for (var i = 0; i < this.link.length; i++) {
          this.link[i].classList.remove('is-current');
        }

        e.target.classList.add('is-current');

        // check same value ith data-e-wizard and data-e-wizardStepper
        for (var a = 0; a < this.step.length; a++) {
          this.tempStep = this.step[a].getAttribute('data-e-wizard');
          this.jsonParse = JSON.parse(this.tempStep);
          
          if (this.jsonParse.step === getAttrTarget) {
            this.step[a].classList.add('is-active');
            this.step[a].classList.remove('u-visibilityHidden');
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
    E.updaters[pluginName] = function() {
      E.plugins[pluginName]();
    };
  });

})(window, document, window.E || {});
