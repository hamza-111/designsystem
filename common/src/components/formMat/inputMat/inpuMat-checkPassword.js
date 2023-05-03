/*
inputMat password
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eFormPassword',
      attr       = 'data-e-form-password',
      attrCheckPassword = 'data-e-form-password-check';

  var defaults   = {
    equal:        'Erreur type not equal',
  };

  function Plugin(el, options) {
    this.el = el;
    this.checkPasswords = this.el.querySelectorAll('[' + attrCheckPassword + ']');
    this.checkPasswordInputs = this.el.querySelectorAll('[' + attrCheckPassword + '] input');
    this.btn = this.el.querySelector('[data-e-form-validation-submit]');

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

      this.checkPasswords[0].addEventListener('change', that.checkPassword.bind(that));
      this.checkPasswords[1].addEventListener('change', that.checkPassword.bind(that));

    },

    checkPassword : function() {
        var valueAttr0 = this.checkPasswords[0].getAttribute("data-e-form-password-check");
        var valueAttr1 = this.checkPasswords[1].getAttribute("data-e-form-password-check");
        var valutinput0 = this.checkPasswordInputs[0].value;
        var valutinput1 = this.checkPasswordInputs[1].value;
        if (valutinput1 !== "" && valutinput1 !== "") {
          if ((valueAttr0 === valueAttr1) && (valutinput0 === valutinput1)) {
            this.checkPasswords[1].eFieldValidation.setValid();
            this.btn.classList.remove('is-disabled');
            this.btn.removeAttribute('disabled');
          }else {
            this.checkPasswords[1].eFieldValidation.setCustomError(this.settings.equal);
            this.btn.classList.add('is-disabled');
            this.btn.setAttribute('disabled', 'disabled');
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

