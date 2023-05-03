/*
  Description:
  data-e-redirect permet de gerer les redirections
  par rapport à un retour d'un webservive qui renvois true ou false
  - true renvoi l'url1
  - false renvoi l'url2
  - indiquer l'url du webservice à la clé "service"

  HTML exemple:
  <div data-e-redirect='{
    "url1": "/pages/formulaire-contact.html",
    "url2": "/pages/homepage.html",
    "service": "../fake/fake-ec-redirect.txt"}'>
  </div>

  NOTE:
  le webservice "../fake/fake-ec-redirect.txt", doit renvoyé un booléen
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eRedirect',
      attr       = 'data-e-redirect',
      btn        = 'data-e-redirect-btn',
      defaults   = {
        url1:      'url1',
        url2:      'url2',
        service:   ""
      };

  function Plugin(el, options) {
    this.el = el;

    this.link    = this.el.querySelector('['+btn+']');

    var dataOptions = E.isJson(this.link.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();
    },

    events: function() {
      this.link.addEventListener('click', this.redirect.bind(this));
    },

    _ajax: function() {
      var request = new XMLHttpRequest(),
          that    = this;

      request.open('GET', that.settings.service , true);

      request.onerror = function() {
        window.location.href = that.settings.url2;
        console.log("An error occurred during the transaction");
      };

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          var response = request.response;

          if (response === "true") {
            window.location.href = that.settings.url1;
          } else if (response === "false") {
            window.location.href = that.settings.url2;
          } else {
            window.location.href = that.settings.url2;
            console.log("Error, response invalid");
          }
        }
      };

      request.send();
    },

    redirect: function(e) {
      e.preventDefault();

      if (this.settings.service === "") {
        console.log("service not found");
        window.location.href = this.settings.url2;

        return this;
      }

      this.el.classList.add('is-loading');

      this._ajax();

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
