/*
  iframe.js
  -----------

  Description:
  composant iframe

  HTML:
  "when" peut contenir : smallOnly, mediumOnly et large
  exemple :
  <div class="c-iframe__wrapper" data-e-iframe='{"when": ["smallOnly", "mediumOnly", "large"], "src": "homepage.html", "width": 900, "height": 400}'></div>

*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eIframe',
      attr       = 'data-e-iframe';

  var defaults   = {
    noTracking: false
  };

  function Plugin( el, options ) {
    this.item       = el;

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.iframe = null;

    this.isFluid = this.item.classList.contains('is-fluid');

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this
        .build()
        .events();
    },

    events: function() {
      var that = this;
      window.addEventListener('changed.ab-mediaquery', that.build.bind(that));

      return that;
    },

    build: function() {
      // Il y a une source ET le breakpoint est dans "when"
      if (this.settings.src && this.inBreakpoint()) {
        // seulement si l'iframe n'existe pas encore
        if (!this.iframe) {
          this.iframe = document.createElement('iframe');
          this.iframe.setAttribute('src', this.settings.src);
          this.iframe.setAttribute('frameborder', '0');
          this.iframe.setAttribute('allowfullscreen', '');
          this.iframe.setAttribute('allow', this.settings.allow);

          if (this.settings.noTracking)
            this.iframe.setAttribute('data-no-tracking', 'data-no-tracking');

          // si l'id est spécifié, l'ajoute
          if (this.settings.id) {
            this.iframe.setAttribute('id', this.settings.id);
          }

          if (this.isFluid)
            this.fluidify();

          this.item.appendChild(this.iframe);

          // [module carton] IFRAME resizer
          if (!this.isFluid) {
            window.iFrameResize({
              log: false,
              checkOrigin: false
            }, '.c-iframe__wrapper:not(.is-fluid) iframe');
          }

          // Trigger custom event to listen outside :
          var event = new CustomEvent('iFrameReady', {
            detail: {
              currentFrame: this.iframe
            }});
          document.dispatchEvent(event);
        }

        return this;
      }

      // sinon on détruit l'iframe
      this.iframe         = null;
      this.item.innerHTML = '';
      this.item.removeAttribute('style');

      return this;
    },

    inBreakpoint: function() {
      var current = AB.mediaQuery.current;

      for(var i = 0, len = current.length; i < len; i++) {
        if (this.settings.when.indexOf(current[i]) !== -1) return true;
      }

      return false;
    },

    fluidify: function() {
      // rendre l'iframe fluide
      this.item.style.height   = this.settings.height +'px';
      this.item.style.maxWidth = this.settings.width +'px';
      this.iframe.setAttribute('height', this.settings.height);
      this.iframe.setAttribute('width', this.settings.width);
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
