/*
  sticky.js
 */

;(function(window, document, E, undefined){

  'use strict';

  var pluginName    = 'eSticky',
      attr          = 'data-e-sticky',
      container     = 'data-e-sticky-container',
      containerMain = 'data-e-sticky-container-main';

  // don't forget to define default settings values
  var defaults = {
    container:  '',
    hAlign:     'right',
    keepBottom: false,
    scrollTop: false,
    sousMenu: false
  };

  // Contructor
  function Plugin(el, options) {
    this.item       = el;
    this.scrollPos = 0;
    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    // pas pour mobile
    if (!AB.mediaQuery.is('large'))
      return;

    this.originalStyles = {
       // donne la  valeur calculée finale de toutes les propriétés CSS sur un élément.
      top: window.getComputedStyle(this.item).top,
      bottom: window.getComputedStyle(this.item).bottom
    };

    this.itemHeight = this.item.offsetHeight;
    this.mode       = '';
    this.valueTop = 0

    // container principal utilisé si pas de container cible
    this.containerMain = document.querySelector('['+ containerMain +']') || document.body;

    // container cible pour limiter la zone sticky
    if (this.settings.container) {
      this.container = document.querySelector('['+ container +'='+ this.settings.container +']');
    }

    // pas de container spécifique ou si ce container n'existe pas
    if (!this.settings.container || !this.container) {
      this.container = this.containerMain;
    }

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.item.classList.add('c-sticky');
      this.item.classList.add('c-sticky--fixed');
      
      this.setStickyMode()
          .events();
    },

    events: function() {
      window.addEventListener('scroll', this.setStickyMode.bind(this));
      window.addEventListener('resize', E.debounce(this.setStickyMode.bind(this), 200));
    },

    setStickyMode: function () {
      // mode sticky partiel
      if ((document.body.getBoundingClientRect()).top === this.scrollPos){
        this.item.classList.remove('c-sticky--stickyHalf');
      }

      if ((document.body.getBoundingClientRect()).top < this.scrollPos) {
        this.item.classList.add('c-sticky--stickyHalf');
      }

      // composant positionné en BAS
      if (this.settings.keepBottom) {
        if (this.container.getBoundingClientRect().top + this.itemHeight + parseInt(this.originalStyles.bottom, 10) > window.innerHeight) {
          this.setStickyTop();
          return this;
        }

        if (this.container.getBoundingClientRect().bottom < window.innerHeight) {
          this.setStickyBottom();
          return this;
        }

        this.setSticky();
        return this;
      }

      // composant positionné en HAUT
      if (!this.settings.scrollTop) {
        if (this.container.getBoundingClientRect().top + this.itemHeight > 0) {
          this.setStickyTop();
          return this;
        }

        if (this.container.getBoundingClientRect().bottom - parseInt(this.originalStyles.top, 10) - this.itemHeight < 0) {
          this.setStickyBottom();
          return this;
        }

        this.setSticky();
        return this;
      } else {
        this.currentTop = (document.body.getBoundingClientRect()).top;

        // redefini la valeur de ValueTop pour le comportement du header sousMenu a false
        if (!this.settings.sousMenu) {
          this.valueTop = (this.scrollPos + this.itemHeight)
        }
     
        if ((this.currentTop + this.itemHeight) > this.valueTop ) {
          
          if (this.scrollPos !== this.itemHeight) {
            this.item.classList.add('c-sticky--fixed');
            this.item.classList.remove('c-sticky--unstickyTop');
          } 
          if ((this.currentTop + this.itemHeight) === 0) {
            this.item.classList.remove('c-sticky--fixed');
          }
        } else if (this.container.getBoundingClientRect().top + this.itemHeight < 0)  {
            this.item.classList.remove('c-sticky--fixed');
            this.item.classList.add('c-sticky--unstickyTop');
        } 

        this.scrollPos = this.currentTop;

        return this;
      }
    },



    setSticky: function() {
      // toujours besoin de recalculer la position horizontale
      this.setPositionHorizontal();

      if (this.mode === 'fixed')
        return;

      this.mode = 'fixed';
      this.item.style.position = 'fixed';

      if (this.settings.keepBottom) {
        this.item.style.top      = 'auto';
        this.item.style.bottom   = this.originalStyles.bottom;
      } else {
        this.item.style.top      = this.originalStyles.top;
        this.item.style.bottom   = 'auto';
      }

      this.item.classList.add('c-sticky--fixed');
      this.item.classList.remove('c-sticky--unstickyTop');
      this.item.classList.remove('c-sticky--unstickyBottom');

      return;
    },

    setStickyTop: function() {
      if (this.mode === 'top')
        return;

      this.mode = 'top';
      this.resetPositionHorizontal();

      this.item.style.position = 'absolute';
      this.item.style.bottom   = 'auto';

      if (this.settings.keepBottom) {
        this.item.style.top = this.originalStyles.bottom - this.itemHeight;
      } else {
        this.item.style.top = this.originalStyles.top;
      }

      this.item.classList.remove('c-sticky--fixed');
      this.item.classList.add('c-sticky--unstickyTop');
      this.item.classList.remove('c-sticky--unstickyBottom');
    },

    setStickyBottom: function() {
      if (this.mode === 'bottom')
        return;

      this.mode = 'bottom';
      this.resetPositionHorizontal();

      this.item.style.position = 'absolute';
      this.item.style.top      = 'auto';

      if (this.settings.keepBottom) {
        this.item.style.bottom = this.originalStyles.bottom;
      } else {
        this.item.style.bottom = 0;
      }

      this.item.classList.remove('c-sticky--fixed');
      this.item.classList.remove('c-sticky--unstickyTop');
      this.item.classList.add('c-sticky--unstickyBottom');
    },

    resetPositionHorizontal: function() {
      if (this.settings.hAlign === 'right') {
        this.item.style.right = 0;
        this.item.style.left  = 'auto';
      } else {
        this.item.style.left  = 0;
        this.item.style.right = 'auto';
      }
    },

    setPositionHorizontal: function() {
      var container        = !this.container ? this.containerMain : this.container,
          containerBoxLeft = container.getBoundingClientRect().left +'px';

      if (this.settings.hAlign === 'right') {
        this.item.style.right = containerBoxLeft;
      } else {
        this.item.style.left = containerBoxLeft;
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
