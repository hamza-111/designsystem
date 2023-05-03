/*
  suggest.js
*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eCombobox',
      attr       = 'data-e-combobox';


  // don't forget to define default settings values
  var defaults   = {
    limit: 5,
    minLength: 3,
    allowSubmit: true
  };

  // Contructor
  function Plugin( el, options ) {
    this.el       = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    // pour 'aria-owns' et 'aria-activedescendant'
    this.randomId  = '_' + Math.random().toString(36).substr(2, 9);

    this.resp      = []; // Réponse XHR
    this.selected  = -1; // index de l'item lélectionné
    this.selectedItem; // item sélectionné
    this.userInput = '';
    this.isOpened  = false;

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      if (!this.getValues())
        return;

      this.build()
          .events();
    },

    getValues: function(){
      this.input     = this.el.querySelector('[data-e-combobox-input]');
      this.list      = this.el.querySelector('[data-e-combobox-list]');
      this.listBlock = this.el.querySelector('[data-e-combobox-listBlock]');
      this.template  = this.el.querySelector('[data-tpl]').innerHTML;

      return this.input && this.list && this.listBlock && this.template;
    },

    build: function() {
      this.input.setAttribute('role', 'combobox');
      this.input.setAttribute('aria-autocomplete', 'list');
      this.input.setAttribute('aria-expanded', 'false');
      this.input.setAttribute('aria-haspopup', 'false');

      // aria-owns
      this.input.setAttribute('aria-owns', this.randomId);
      this.listBlock.id = this.randomId;

      return this;
    },

    events: function() {
      var that = this;

      this.el.addEventListener('submit', that.onSubmit.bind(that));

      that.input.addEventListener('keydown', that.onKeydown.bind(that));
      that.input.addEventListener('keyup', that.onKeyup.bind(that));
      that.input.addEventListener('focus', that.open.bind(that));

      // besoin du debounce pour que le lien soit pris en compte avant le blur
      that.input.addEventListener('blur', E.debounce(function(e){
        that.close.call(that);
        return;
      }, 250));
    },

    onSubmit: function(e) {
      // Le submit est autorisé par défaut
      if (this.settings.allowSubmit)
        return;

      // si besoin d'autre chose qu'un submit...
      e.preventDefault();

      // écoutez cet event depuis votre script et exécuter les actions souhaitées
      var event = new CustomEvent('combobox.submit', {
        detail: this
      });
      document.dispatchEvent(event);
    },

    onKeydown: function(e) {
      var value = this.input.value;

      if (!value)
        return;

      if (value.length < this.settings.minLength - 1)
        return;

      switch (E.keyNames[e.which]) {
        case 'up':
          e.preventDefault();
          this.selected = (this.selected === - 1) ? this.resp.length - 1 : this.selected - 1;
          this.open();
          this.updateSelected.call(this);
          break;

        case 'down':
          e.preventDefault();
          this.selected = (this.selected === this.resp.length - 1) ? -1 : this.selected + 1;
          this.open();
          this.updateSelected.call(this);
          break;

        case 'escape':
          this.close();
          break;

        case 'tab':
          this.userInput = this.input.value;
          break;
      }
    },

    onKeyup: function(e) {
      var that    = this,
          value   = this.input.value,
          request = new XMLHttpRequest(),
          xhr     = this.settings.url +'?'+ this.input.name +'='+ encodeURIComponent(this.input.value);

      // Ces touches ne doivent pas appeler l'API
      switch (E.keyNames[e.which]) {
        case 'left':
        case 'right':
        case 'up':
        case 'down':
        case 'escape':
        case 'tab':
        case 'shift':
          return;
      }

      // on stock la saisie user
      this.userInput = value;

      // pas assez de caractères pour ouvrir la liste
      if (value.length < this.settings.minLength) {
        this.list.innerHTML = '';
        this.resp           = [];
        this.close();
        return;
      }

      request.open('GET', xhr, true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // si réponse vide ou cassée
          if (!E.isJson(request.response)) {
            that.list.innerHTML = '';
            that.resp           = [];
            that.close();
            return;
          }

          that.resp        = JSON.parse(request.response);
          that.resp.length = (that.resp.length <= that.settings.limit) ? that.resp.length : that.settings.limit;

          that.renderList.call(that);
        } else {
          console.warn('La réponse est mal formée');
        }
      };
      request.onerror = function() {
        console.warn('La requête a échouée');
      };
      request.send();
    },

    close: function() {
      if (!this.isOpened)
        return;

      this.selected    = -1;
      this.input.value = this.userInput;

      this.listBlock.classList.add('u-hide');
      this.input.setAttribute('aria-expanded', 'false');
      this.input.setAttribute('aria-haspopup', 'false');

      this.resetItems(this.list.querySelectorAll('li'));

      this.isOpened = false;
    },

    open: function() {
      if (this.isOpened || this.resp.length === 0)
        return;

      this.listBlock.classList.remove('u-hide');
      this.input.setAttribute('aria-expanded', 'true');
      this.input.setAttribute('aria-haspopup', 'true');

      this.isOpened = true;
    },

    resetItems: function(nodes) {
      this.input.removeAttribute('aria-activedescendant');

      // reset du contenu de la liste
      for (var i = 0, len = nodes.length; i < len; i++) {
        nodes[i].setAttribute('aria-selected', 'false');
        nodes[i].removeAttribute('id');
        nodes[i].classList.remove('is-active');
      }
    },

    renderList: function() {
      var html = [];

      for (var i = 0, len = this.resp.length; i < len; i++) {
        // user input pour le tracking
        this.resp[i].userInput = this.userInput;

        html.push(E.templateEngine(this.template, this.resp[i]));
      }

      this.list.innerHTML = html.join('');
      this.open();
    },

    updateSelected: function() {
      var list  = this.list.querySelectorAll('li'),
          nodes = Array.prototype.slice.call(list);

      // item sélectionné
      this.selectedItem = nodes[this.selected];

      // reset de tous les items
      this.resetItems(list);

      // si cursor hors de la liste, on remet saisie du user
      if (this.selected < 0) {
        this.input.value = this.userInput;
        return;
      }

      // pour lier l'input avec l'item lélectionné
      this.input.setAttribute('aria-activedescendant', this.randomId +'-item');
      this.selectedItem.id = this.randomId +'-item';

      this.selectedItem.setAttribute('aria-selected', 'true');
      this.selectedItem.classList.add('is-active');

      this.input.value = this.selectedItem.innerText;
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
