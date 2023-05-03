/*
  Description:
  ...

  HTML:
  ...

  JS usage:
  Initialisation :
  E.plugins.wizard(); // avec éventuellement des paramètres

  Appeler une méthode de l'extérieur :
  $0.eWizard.isValid();
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eWizard', 
      attr       = 'data-e-wizard', 
      defaults   = {
        step: '',
        ignor: false
      };

  // Our constructor
  function Plugin(el, options) { //argument "option" is optionel when we want override the params
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);
    
    this.inputEl    = this.el.querySelectorAll(".c-inputMat__field, .c-radioStyle__field, .c-radioMat__field");
    this.radio      = this.el.querySelectorAll('.c-radioStyle__fieldBorder')
    this.btn        = this.el.querySelector(".c-baseBtn ");
    this.linkReturn = this.el.querySelector('.js-foyerSimilaire_retour');

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();

      return this;
    },

    events: function() {
      var that = this;

      for (var i = 0; i < this.inputEl.length; i++) {
        
        if (E.debug) {
          if(this.inputEl[i].type === "tel")
            this.inputEl[i].addEventListener('keyup', this.isValid.bind(this));

          if(this.inputEl[i].type === "radio") {
            that.inputEl[i].parentNode.parentNode.addEventListener('click', that.isValid.bind(this));//parentNode Fixe for IE
          }
        } else {
          if(!this.settings.ignor) {
            if(this.inputEl[i].type === "tel")
            this.inputEl[i].addEventListener('keyup', this.isValid.bind(this));
  
            if(this.inputEl[i].type === "radio") {
              that.inputEl[i].parentNode.parentNode.addEventListener('click', that.isValid.bind(this));//parentNode Fixe for IE
            }
          }
        }


      }

      this.btn.addEventListener('click', this.nextStep.bind(this));
      
      if (this.linkReturn)
        this.linkReturn.addEventListener('click', this.prevStep.bind(this));

      return this;
    },

    // methods
    isValid: function(e) {

        for (var i = 0; i < this.inputEl.length; i++) {
        
          if( !this.inputEl[i].checkValidity() ) {
            this.btn.setAttribute('disabled', 'disabled');
            this.btn.classList.add('is-disabled');

            return;
          } else {
            this.btn.removeAttribute('disabled');
            this.btn.classList.remove('is-disabled');
          }
        }
      return this;
    },
    
    // for the stepper (timeline)
    _nexLineStep: function(goTo) {
      this.wizardstep = document.querySelectorAll('[data-e-wizardstep]');

      for(var j = 0; j < this.wizardstep.length; j++ ) {
        var attrValueEl = this.el.getAttribute(attr),
            attrValueWizardstep = this.wizardstep[j].getAttribute("data-e-wizardstep");

        if (this.settings.step === attrValueWizardstep) {
          this.wizardstep[j].removeAttribute('disabled');
          this.wizardstep[j].classList.add("is-done");
          this.wizardstep[j].classList.remove("is-current");
          
          if (goTo === "next") {
            if(this.wizardstep[j].nextElementSibling) {
              this.wizardstep[j].nextElementSibling.classList.add("is-current");
              this.wizardstep[j].nextElementSibling.classList.add("is-done");
              this.wizardstep[j].nextElementSibling.removeAttribute("disabled");
            }
          } else {
            this.wizardstep[j].previousElementSibling.classList.add("is-current");
          }
        }
      }
    },

    nextStep: function(e) {
      if (this.el.nextElementSibling) {
        this.el.classList.add('u-visibilityHidden');
        this.el.nextElementSibling.classList.remove('u-visibilityHidden');
        this.el.classList.remove('is-active');
        this.el.nextElementSibling.classList.add('is-active');
        this._nexLineStep("next");
      }

      return this;
    },

    prevStep: function(e) {
      e.preventDefault();
      this.el.classList.add('u-visibilityHidden');
      this.el.classList.remove('is-active');
      this.el.previousElementSibling.classList.remove('u-visibilityHidden');
      this.el.previousElementSibling.classList.add('is-active');
      this._nexLineStep("prev");
      
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
