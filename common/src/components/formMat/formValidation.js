/*
  Description:
  validation formulaire.
  Check tout les champs contenu dans les formulaire

  HTML:
  <form class="c-formMat" novalidate="novalidate" data-e-form-validation="data-e-form-validation">
    [...]
    <button type="submit" data-e-form-validation-submit="data-e-form-validation-submit">Valider</button>
  </form>

  JS usage:
  Initialisation :
  E.plugins.eFormValidation();

  Appler une méthode de l'extérieur :
  $0 étant l'élément [data-e-form-validation]
  $0.eFormValidation.checkValidation()
*/

;(function(window, document, E, undefined){
  'use strict';

  var pluginName = 'eFormValidation',
      attr       = 'data-e-form-validation',
      defaults   = {
        switchBtnState: true
      };

  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(defaults, options, dataOptions);

    this.submitBtn = this.el.querySelector('[data-e-form-validation-submit]');
    this.timeout;

    this._init();
  }

  Plugin.prototype = {
    _init: function() {
      if (this.settings.switchBtnState)
        this.submitBtn.classList.add('is-disabled');

      this._events();
    },

    _events: function() {
      this.el.addEventListener('submit', this._onSubmit.bind(this));
    },

    _onSubmit: function(e) {
      if (!this.el.checkValidity())
        e.preventDefault();

      this.updateFields()
          .checkValidation();
    },

    updateFields: function() {
      var fields = this.el.querySelectorAll('[data-e-field-validation]');
      for (var i = 0, len = fields.length; i < len; i++) {
        fields[i].eFieldValidation.checkValidity('submit');
      }

      return this;
    },

    checkValidation: function(mode) {
      var that = this;

      // si le contrôle vient d'un champs, on ne vérifie pas les autres
      if (mode !== 'fields')
        this.updateFields();

      if (this.settings.switchBtnState) {
        if (this.el.checkValidity())
          this.submitBtn.classList.remove('is-disabled');
        else
          this.submitBtn.classList.add('is-disabled');
      }

      // scroll vers la 1ère erreur
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function() {
        if (!that.el.checkValidity() && mode !== 'fields')
          that.scroll2Error();
      }, 400);
    },

    scroll2Error: function() {
      var target = this.el.querySelector('[data-e-field-validation].is-error');

      E.scrollTo({
        next:   target,
        offset: 90
      });
    }
  };

  E.plugins[pluginName] = function(options) {
    var elements = document.querySelectorAll('['+ attr +']');
    for (var i = 0, len = elements.length; i < len; i++) {
      if (elements[i][pluginName]) continue;
      elements[i][pluginName] = new Plugin(elements[i], options);
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    E.plugins[pluginName]();

    E.updaters[pluginName] = function() {
      E.plugins[pluginName]();
    };
  });
})(window, document, window.E);


