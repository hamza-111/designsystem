/*
  floatingMenu.js
  -----------

  Description:
  composant floatingMenu

*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'efloatingMenu',
      attr       = 'data-e-floating-menu';

  var defaults   = {};

  function Plugin( el, options ) {
    this.item       = el;

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.listElem   = this.item.querySelectorAll('[data-e-floating-menu-target]');

    this.init();
  }

  Plugin.prototype = {
    init: function() {

      this.events();
    },

    events: function() {
      var that = this;

      for (var i = 0, len = this.listElem.length; i < len; i++) {
        this.listElem[i].addEventListener('click', that.toggleClass.bind(that));
      }

      return that;
    },

    toggleClass: function(e){
      var that = this,
          listElem = that.listElem,
          targetElem = e.currentTarget,
          elemBtn = targetElem.getElementsByClassName('c-floatingMenuBtn');

      // Vérifie que le bouton appartient bien à une étape qui a été visitée et qu'il n'est pas disabled:
      if ( !targetElem.classList.contains('is-viewed') || elemBtn[0].hasAttribute('disabled') ) return;

      // Injection de classes :
      for (var i = 0, listLen = listElem.length; i < listLen; i++) {
        // Vérifie que l'élément existe et que ce n'est pas la cible du clique
        if (!listElem[i] || listElem[i] === targetElem) continue;

        // Récupère le bouton contenu dans l'élément courant de la bouche
        var currentBtn = listElem[i].getElementsByClassName('c-floatingMenuBtn');

        // Vérifie que le bouton n'est pas disabled
        if ( currentBtn[0].hasAttribute('disabled') ) continue;

        listElem[i].classList.remove('is-active');
        listElem[i].classList.add('not-active');
      }

      if (targetElem){
        targetElem.classList.remove('not-active');
        targetElem.classList.add('is-active');
      }

      return that;
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