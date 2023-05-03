/*
  toggle.js
  ---------

  Description:
  -----------
  Ouvrir/fermer un panneau.
  Utiliser le CSS pour l'affichage en vous appuyant sur les classes.

  HTML:
  ----
  <button data-e-toggle='{"target": "legal"}'>Mentions légales</button>

  <div data-e-toggle-target="legal">
    <p>Lorem ipsum dolor sit amet.</p>
  </div>

  Options facultatives:
  ----
  "btnActiveClass"     : "is-close"
  "contentOpenedClass" : "is-opened"
  "autoClose"          : false // se fermera automatiquement si un autre toggle est ouvert (voir siteHeader)
  "opened"             : false // ouvert au chargement
  "delayClose"         : null  // delai de fermeture automatique
  "delayOpen"          : null  // delai d'ouverture automatique
*/

;(function (window, document, E, undefined) {

  'use strict';

  var pluginName   = 'eToggle',
      attr         = 'data-e-toggle',
      target       = 'data-e-toggle-target',
      closeTrigger = 'data-e-toggle-close';

  var defaults = {
    target:             '',
    btnActiveClass:     'is-active',
    contentOpenedClass: 'is-opened',
    autoClose:          false,
    autoCloseWrap:      false,
    opened:             false,
    delayClose:         null,
    delayOpen:          null,
    mq:                 '',
    blockScroll:        false
  };

  function Plugin(el, options) {
    this.item       = el;

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.isClosed   = true;
    this.inMediaQuery = true;
    this.timerClose;
    this.timerOpen;

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      if (this.settings.mq) {
        if (Array.isArray(this.settings.mq)) {
          this.inMediaQuery = this.settings.mq.some(function(mq) {
            return AB.mediaQuery.is(mq);
          });
        } else {
          this.inMediaQuery = AB.mediaQuery.is(this.settings.mq);
        }
      }

      if (!this.settings.target || !this.inMediaQuery)
        return;

      this.content = document.querySelector('['+ target +'="'+ this.settings.target +'"]');
      // si pas de target, on return...
      if (!this.content)
        return;

      // if (this.settings.opened) this.open();
      this.settings.opened ? this.open() : this.close();

      this._events();

      // on lance le timer de fermeture
      if (this.settings.delayClose) this._delayClose();
      if (this.settings.delayOpen) this._delayOpen();
    },

    _events: function() {
      var that = this;

      that.item.addEventListener('click', that.toggle.bind(that));

      that.item.addEventListener('keydown', function(e) {
        if (E.keyNames[e.which] === 'enter')
          that.toggle(e);
      });

      // boutons de fermeture
      document.addEventListener('click', function(e){
        for (var target = e.target; target && target !== this; target = target.parentNode) {
          if (target.matches('['+ closeTrigger +'="'+ that.settings.target +'"]')) {
            e.preventDefault();
            that.close();
            break;
          }
        }
      });

      if (that.settings.autoClose) {
        document.addEventListener('e-toggle.close-all', that.close.bind(that));
      }
    },

    toggle: function(e) {
      e.preventDefault();

      // remove focus on button
      this.item.blur();

      // on vide les timers qui ne sont plus nécessaires
      if (this.settings.delayClose) clearTimeout(this.timerClose);
      if (this.settings.delayOpen) clearTimeout(this.timerOpen);

      this.isClosed ? this.open() : this.close();
    },

    close: function() {
      var that = this;

      if (this.isClosed) return;

      this.isClosed = true;

      if (this.settings.blockScroll && AB.mediaQuery.is('smallOnly'))
        E.noScroll.allow();

      // update du DOM
      this.item.setAttribute('aria-expanded', 'false');
      this.item.classList.remove('is-active');
      this.content.setAttribute('aria-hidden', 'true');
      this.content.classList.remove('is-opened');

      // trigger event to listen outside
      var event = new CustomEvent('onToggleClose', {
        detail: { toggle: that }
      });
      this.item.dispatchEvent(event);
    },

    open: function() {
      var that = this;

      if (!that.isClosed) return;

      that.isClosed = false;

      if (this.settings.blockScroll && AB.mediaQuery.is('smallOnly'))
        E.noScroll.prevent();

      if (this.settings.autoClose)
        this.closeOthers();

      if ( that.settings.autoCloseWrap)
        that.closeOthersWrap();

      // on lance le timer de fermeture
      if (this.settings.delayClose)
        this.delayClose();

      // update du DOM
      this.item.setAttribute('aria-expanded', 'true');
      this.item.classList.add('is-active');
      this.content.setAttribute('aria-hidden', 'false');
      this.content.classList.add('is-opened');

      // trigger event to listen outside
      var event = new CustomEvent('onToggleOpen', {
        detail: { toggle: that }
      });
      this.item.dispatchEvent(event);
    },

    _delayClose: function() {
      var that = this;
      that.timerClose = setTimeout(that.close.bind(this), that.settings.delayClose);
    },

    _delayOpen: function() {
      var that = this;
      that.timerOpen = setTimeout(that.open.bind(that), that.settings.delayOpen);
    },

    // close other toggles with autoClose: true
    closeOthers: function() {
      var openedToggles = document.querySelectorAll('['+ attr +'][aria-expanded="true"]');

      // s'il n'y a pas de toggles ouverts
      if (openedToggles.length <= 0)
        return this;

      for (var i = 0, len = openedToggles.length; i < len; i++) {
        // s'il n'y a pas l'option autoClose
        if (openedToggles[i] === this.item || !openedToggles[i].eToggle.settings.autoClose)
          continue;

        openedToggles[i].eToggle.close();
      }
    },

    closeOthersWrap: function() {
      var openedTogglesWrapParent = this.item.closest(this.settings.autoCloseWrap),
          itemToggle = openedTogglesWrapParent.querySelectorAll('[aria-expanded="true"]');

      for (var i = 0, len = itemToggle.length; i < len; i++) {
          itemToggle[i].eToggle.close();
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

    // close quand on clique sur la page
    document.addEventListener('click', function(e) {
      var target   = e.target,
          event    = new CustomEvent('e-toggle.close-all'),
          inToggle = target.closest('[data-e-toggle], [data-e-toggle-target]');

      if (!inToggle)
        document.dispatchEvent(event);
    });
  });

})(window, document, window.E || {});
