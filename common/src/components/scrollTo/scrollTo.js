/*
  scrollTo.js
  -----------

  Description:
  Permet de créer un scrollTo
  - insérer l'attribut [data-e-scrollTo] dans une ancre <a> et définir l'ancre dans un attribut href sur lequel il doit pointer
  - pour des raisons d'accessibilité, l'attribut ne marche que si la balise <a> a une ancre spécifiée

  HTML:
  exemple :
  <a data-e-scrollto href="#monID">Tata</a>
  <button data-e-scrollto='{"target": ".toto"}'>Tata</a>
*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eScrollto',
      attr       = 'data-e-scrollto';

  var defaults   = {
    speed: 500,
    offset: 0,
    target: undefined
  };

  function Plugin( el, options ) {
    this.item       = el;

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.target;
    this.init();

  }

  Plugin.prototype = {
    init: function() {
      this.target = this.getTarget();

      if (this.target)
        this.events();
    },

    events: function() {
      this.item.addEventListener('click', this.scroll.bind(this));
    },
    // get the attribut of the href IF ELSE get setting.target
    getTarget: function() {
      if (this.settings.target === undefined) {
        var id = this.item.getAttribute('href');

        if (id && id.startsWith('#'))
          return document.querySelector(id);

      } else {
        if (this.settings.target)
          return document.querySelector(this.settings.target);
      }

      return false;

    },

    scroll: function() {
      E.scrollTo({
        next: this.target,
        offset: this.settings.offset
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

  document.addEventListener('DOMContentLoaded', function(){
    E.plugins[pluginName]();
    E.updaters[pluginName] = function() {
      E.plugins[pluginName]();
    };
  });

})(window, document, window.E || {});
