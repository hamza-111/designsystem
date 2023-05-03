/*
  moreLessInput.js
  -----------

  Description:
  composant moreLessInput

*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'emoreLessInput',
      attr       = 'data-e-more-lessinput';

  var defaults   = {
    input:        '',
    currentValue: '',
    minusButton:  '',
    plusButton:   '',
    plusExponent: '',
    min:          null,
    max:          null,
    step:         1,
    errorMsg:     'Ce champ ne peut recevoir que des chiffres',
  };

  function Plugin( el, options ) {
    this.item       = el;

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.minValue     = this.settings.min;
    this.maxValue     = this.settings.max;
    this.stepValue    = this.settings.step;
    this.errorMsg     = this.settings.errorMsg;

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

      this.updateBtnAvailability();

      this.minusBtnNode.addEventListener('click', that.decrement.bind(that));
      this.plusBtnNode.addEventListener('click', that.increment.bind(that));
      this.inputNode.addEventListener('keyup', that.checkUserKeyEntry.bind(that));
      this.inputNode.addEventListener('keyup', that.updateBtnAvailability.bind(that));
      this.inputNode.addEventListener('change', that.checkUserKeyEntry.bind(that));
      this.inputNode.addEventListener('change', that.updateBtnAvailability.bind(that));
    },

    getValues: function(){
      this.inputNode        = this.item.querySelector('.c-moreLessInput__input');
      this.currentValue     = parseFloat(this.inputNode.value);
      this.minusBtnNode     = this.item.querySelector('.c-moreLessInput__button--minus');
      this.plusBtnNode      = this.item.querySelector('.c-moreLessInput__button--plus');
      this.plusExponentNode = this.item.querySelector('.c-moreLessInput__sup');

      return this.inputNode && this.minusBtnNode && this.plusBtnNode;
    },

    updateBtnAvailability: function(){
      var inputValue = this.inputNode.value;

      // Désactive les boutons + et - si la valeur saisie n'est pas un nombre
      if (isNaN(inputValue)) {
        this.bothUnavailable();
        return;
      }

      // Actualise la variable qui stocke la valeur de l'input
      this.currentValue = parseFloat(inputValue);

      // Active / désactive les boutons d'incrémentation à travers l'attribut "disabled" et si l'option exposant + est activée l'affiche/le masque
      if (this.currentValue === this.minValue) {
        this.minusDisable();

        // Retire l'exposant "+"
        this.hidePlusExponent();
      } else if (this.currentValue === this.maxValue) {
        this.plusDisable();

        // Ajoute l'exposant "+"
        this.showPlusExponent();
      } else {
        this.bothAvailable();

        // Retire l'exposant "+"
        this.hidePlusExponent();
      }
    },

    checkUserKeyEntry: function(e){
      var regexNbr = /^(-)?(\d+(?:\.\d{2})?)$/;

      if (this.inputNode.value <= this.minValue) {
        this.inputNode.value = this.minValue;
      }

      if (this.inputNode.value >= this.maxValue) {
        this.inputNode.value = this.maxValue;
      }

      if (!regexNbr.test(this.inputNode.value)) {
        this.item.eFieldValidation.setCustomError(this.errorMsg);
      }
    },

    minusDisable: function(){
      this.minusBtnNode.setAttribute('disabled', 'disabled');
      this.plusBtnNode.removeAttribute('disabled');
    },

    plusDisable: function(){
      this.plusBtnNode.setAttribute('disabled', 'disabled');
      this.minusBtnNode.removeAttribute('disabled');
    },

    bothAvailable: function(){
      this.minusBtnNode.removeAttribute('disabled');
      this.plusBtnNode.removeAttribute('disabled');
    },

    bothUnavailable: function(){
      this.minusBtnNode.setAttribute('disabled', 'disabled');
      this.plusBtnNode.setAttribute('disabled', 'disabled');
    },

    decrement: function(){
      var inputValue = parseFloat(this.inputNode.value);

      if (this.currentValue === this.minValue) return;

      if (inputValue - this.stepValue <= this.minValue) {
        this.inputNode.value = this.minValue;
      } else {
        this.inputNode.value = inputValue - this.stepValue;
      }

      this.updateBtnAvailability();
    },

    increment: function(){
      var inputValue = parseFloat(this.inputNode.value);

      // Si le champs est vide le passe à 1
      if (this.currentValue === '') {
        this.currentValue = this.stepValue;

      this.inputNode.value = this.currentValue;
        return;
      }

      if (inputValue + this.stepValue >= this.maxValue) {
        this.inputNode.value = this.maxValue;
      } else {
        this.inputNode.value = inputValue + this.stepValue;
      }

      this.updateBtnAvailability();
    },

    showPlusExponent: function(){
      if (this.plusExponentNode) {
        this.plusExponentNode.classList.remove('u-hide');
      }
    },

    hidePlusExponent: function(){
      if (this.plusExponentNode) {
        this.plusExponentNode.classList.add('u-hide');
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