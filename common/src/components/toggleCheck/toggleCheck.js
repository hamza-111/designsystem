/*
  toggleCheck.js
  -------

  Description:
  -----------

  HTML:
  ----


  JS usage:
  --------

*/


;(function (window, document, E, undefined) {

    'use strict';

    var pluginName = 'eToggleCheck',
        attr       = 'data-e-toggleCheck';

    var links = '[data-e-tabs-link]',
        panel = '[data-e-tabs-panel]',
        tabbable = 'button, input, select, textarea, [tabindex], [contenteditable], a, video, iframe, embed, object, summary';

    var defaults = {};

    function Plugin( el, options ) {
      this.item = el;

      var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
      this.settings   = E.extend(true, defaults, options, dataOptions);

      this.titleNode = this.item.querySelector('.c-toggleCheckElem__title');
      this.inputNode = this.item.querySelector('.c-toggleCheckElem__header .c-checkboxMat__field');

      this.init();
    }

    Plugin.prototype = {
      init: function() {
        var that = this;

        this.events();

        return this;
      },

      events: function() {
        var that = this;

        this.inputNode.addEventListener('change', that.toggleChecking.bind(that));
        if (this.titleNode) {
          this.titleNode.addEventListener('click', that.toggleChecking.bind(that));
        }

        return this;
      },

      toggleChecking: function(e){
        this.item.classList.toggle('is-checked');

        // Si le déclencheur est le titre, coche/décohe la checkbox :
        if (e.currentTarget === this.titleNode ) {
          this.item.classList.contains('is-checked') ? this.inputNode.checked = true : this.inputNode.checked = false;
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