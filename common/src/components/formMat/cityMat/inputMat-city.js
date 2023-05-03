/*
inputMat-city.js
*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName       = 'eCity',
      attr             = 'data-e-citymat',
      zipAttr          = 'data-e-citymat-zip',
      cityAttr         = 'data-e-citymat-city',
      cityAttrFallback = 'data-e-citymat-city-fallback';

  var defaults   = {
    url: '',
    wrongZipMessage: 'Le code postal ne semble pas correct',
    errorResponse: 'un erreur est servenu !!!'
  };

  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.zipBlock          = this.el.querySelector('['+ zipAttr +']');
    this.cityBlock         = this.el.querySelector('['+ cityAttr +']');
    this.cityFallbackBlock = this.el.querySelector('['+ cityAttrFallback +']');

    this.resp = {};

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();
    },

    events: function() {
      var that = this;

      // event de validation de champs envoyé par fieldValidation
      this.zipBlock.addEventListener('keyup', that.callApi.bind(that));
    },

    callApi: function(e) {
      var that    = this,
          input   = e.target,
          isValid = input.checkValidity(),
          request = new XMLHttpRequest(),
          xhr     = this.settings.url;

      if (!isValid) {
        this.emptyCityBlock();
        return;
      }

      if (E.debug) {
        // Fake - exemple pour villes multiples
        if (input.value === '47600')
          xhr = '../fake/zip2city-multiple.json';
        else
          xhr = '../fake/zip2city-single.json';
      } else {
        xhr = xhr + input.value;
      }

      request.open('GET', xhr, true);

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          if (!E.isJson(request.response)) {
            that.zipBlock.eFieldValidation.setCustomError(that.settings.wrongZipMessage);
            return;
          }

          that.resp = JSON.parse(request.response);
          that.updateCityBlock();
        } else {
          that.zipBlock.eFieldValidation.setCustomError(that.settings.errorResponse);
          console.warn('La réponse a eu un problème');
          that.cityFallback();
        }
      };

      request.onerror = function() {
        that.cityFallback();
      };

      request.send();
    },

    cityFallback: function() {
      var input = this.cityFallbackBlock.querySelector('input');

      this.cityFallbackBlock.hidden = false;
      this.cityFallbackBlock.classList.remove('is-disabled');

      input.disabled = false;

      this.cityBlock.hidden = true;
    },

    updateCityBlock: function() {
      var select  = this.cityBlock.querySelector('select'),
          options = [];

      for (var i = 0, len = this.resp.listeCommunes.length; i < len; i++) {
        options.push('<option value="'+ this.resp.listeCommunes[i].nomCommune +'">'+ this.resp.listeCommunes[i].nomCommune +'</option>');
      }

      select.innerHTML = options.join('');

      select.removeAttribute('disabled');
      this.cityBlock.classList.remove('is-disabled');
    },

    emptyCityBlock: function() {
      var select = this.cityBlock.querySelector('select');
      select.innerHTML = '';
      select.setAttribute('disabled', 'disabled');
      this.cityBlock.classList.add('is-disabled');
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
