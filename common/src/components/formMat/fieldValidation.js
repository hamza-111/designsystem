/*
  Description:
  validation champs

  JS usage:
  Initialisation :
  E.plugins.eFieldValidation();

  Envoyer une erreur custom :
  $0 étant l'élément [data-e-field-validation]
  $0.eFieldValidation.setCustomError('Mon erreur custom');
*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eFieldValidation',
      attr       = 'data-e-field-validation',
      attrError  = 'data-e-field-validation-error';

  var defaults = {
    typing: false,
    validations: {
      badInput:        'Erreur type badInput',
      typeMismatch:    'Erreur type typeMismatch',
      patternMismatch: 'Erreur type patternMismatch',
      rangeOverflow:   'Erreur type rangeOverflow',
      rangeUnderflow:  'Erreur type rangeUnderflow',
      stepMismatch:    'Erreur type stepMismatch',
      tooLong:         'Erreur type tooLong',
      tooShort:        'Erreur type tooShort',
      valueMissing:    'Erreur type valueMissing'
    }
  };

  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.inputEls     = this.el.querySelectorAll('input, select, textarea');
    this.inputEl      = this.inputEls[0];
    this.inputElName  = this.inputEl.name;
    this.formEl       = this.el.closest('[data-e-form-validation]');
    this.errorEl      = this.el.querySelector('[' + attrError +']');
    this.isValid      = this.inputEl.validity.valid;

    this._init();


  }

  Plugin.prototype = {
    _init: function() {
      if (!this.errorEl)
        console.warn("formulaires: un <ul> avec l'attribut data-e-field-validation-error est manquant !");

      this._events();

      if (this.attrFiledset)

        console.log(this.attrFiledset);
    },

    _events: function() {
      var that = this;

      if (this.settings.typing) {
        this.inputEl.addEventListener('keyup', that.checkValidity.bind(that));
      } else {
        // retirer l'état valide/invalid (c'est fait au change)
        this.inputEl.addEventListener('keyup', that.removeStatus.bind(that));
      }

      for (var i = 0, len = this.inputEls.length; i < len; i++) {
        this.inputEls[i].addEventListener('change', that.checkValidity.bind(that));
      }
    },

    checkValidity: function(mode) {
      var that = this;

      // firefox et IE valides même dans filedset disabled...
      if (!this.inputEl.willValidate || this.el.closest('[disabled]'))
        return this;

      // ne pas checker sur 'enter', c'est un submit
      if (mode) {
        var keyupOnEmptyField = (mode.type && mode.type === 'keyup' && !this.inputEl.value);

        if (keyupOnEmptyField)
          return this;
      }

      // chrome et Firefox/IE ne gèrent pas les espace de fin de la même façon malgrès la regex... shame
      if (this.inputEl.type === 'email')
        this.inputEl.value = this.inputEl.value.trim();

      that.isValid = this.inputEl.validity.valid;

      that.isValid ?
        that.setValid() : that.setInvalid(mode);

      // trigger event to listen outside
      var event = new CustomEvent('onValidation', {
        detail: {
          fieldValidation: that
        }
      });
      document.dispatchEvent(event);

      // update form status (when submit, it's already done)
      if (mode !== 'submit' && this.formEl)
        this.formEl.eFormValidation.checkValidation('fields');
    },

    setInvalid: function(mode) {
      var newList = '';

      // on traite les customError spécifiquement pour garder le message
      if (this.inputEl.validity.customError && mode === 'submit')
        return this;

      this.inputEl.setCustomValidity('');

      // loop sur toutes les validités
      /*jshint forin:false */
      for (var prop in this.inputEl.validity) {
        // on boucle sur les propriété natives de 'validity'
        if (!this.inputEl.validity.hasOwnProperty(prop)) {
          if (prop === 'valid' || prop === 'typeMismatch' || prop === 'customError')
            continue;

          if (this.inputEl.validity[prop])
            newList += '<li>' + this.settings.validations[prop] + '</li>';
        }
      }
      /*jshint forin:true */

      this.errorEl.innerHTML = newList;
      this.el.classList.add('is-error');
      this.el.classList.remove('is-success');
    },

    setValid: function() {
      this.errorEl.innerHTML = '';

      this.el.classList.remove('is-error');
      if (this.inputEl.value)
        this.el.classList.add('is-success');
    },

    isRealInput: function(key) {
      switch (E.keyNames[key]) {
        case 'tab':
        case 'shift':
        case 'ctrl':
        case 'escape':
        case 'left':
        case 'right':
        case 'down':
        case 'up':
        case 'enter':
          return false;
        default:
          return true;
      }
    },

    removeStatus: function(e) {
      // Ne pas changer le status à la pression de certaines touches
      if (!this.isRealInput(e.which))
        return this;

      this.errorEl.innerHTML = '';

      this.el.classList.remove('is-error');
      this.el.classList.remove('is-success');
    },

    setCustomError: function(message) {
      var that = this;

      this.el.classList.add('is-error');
      this.el.classList.remove('is-success');

      this.inputEl.setCustomValidity(message);
      this.valid = this.inputEl.validity.valid;

      this.errorEl.innerHTML = '<li>'+ message +'</li>';

      // trigger event to listen outside
      var event = new CustomEvent('onValidation', {
        detail: {
          fieldValidation: that
        }
      });
      document.dispatchEvent(event);
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
