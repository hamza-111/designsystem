/*
  formMatSwap.js

  Description:
  permet d'afficher des éléments par rapport à une value d'un input

  HTML:
  <div data-e-formmat-swap='{"name": "tata"}'>
    <input type="radio" value="toto" />
    <input type="radio" value="baba" />
  </div>

  <FIELDSET data-e-formmat-swap-target='["toto"]' data-e-formmat-swap-name='tata' >
    <p>
      lorem Ipsum
    </p>
  </FIELDSET>

  <FIELDSET data-e-formmat-swap-target='["toto", "baba"]' data-e-formmat-swap-name='tata' >
    <p>
      lorem Ipsum
    </p>
  </FIELDSET>
*/

;(function(window, document, E, undefined){

    'use strict';

    var pluginName = 'eFormMatSwap',
        attr       = 'data-e-formmat-swap',
        target     = 'data-e-formmat-swap-target',
        targetName = 'data-e-formmat-swap-name',
        defaults   = {
          name: ''
        };

    function Plugin(el, options) {
      this.el = el;

      var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
      this.settings   = E.extend(true, defaults, options, dataOptions);

      this.name       = this.settings.name;

      if (!this.name)
        return;

      this.checkboxNode  = this.el.querySelector('input[type="checkbox"]');
      this.blockNameNode = document.querySelectorAll('[' +targetName+ '="'+ this.name +'" ]');

      this.init();
    }

    Plugin.prototype = {
      init: function() {
        this.initFormMatSwap()
            .events();
      },

      events: function() {
        this.el.addEventListener('change', this.swapBlock.bind(this));
      },

      initFormMatSwap: function() {
        for (var i = 0, len = this.blockNameNode.length; i < len; i++) {
          this.hideBlock(this.blockNameNode[i]);
        }
        return this;
      },

      showBlock: function(el) {
        el.removeAttribute("hidden");

        if (el.tagName === 'FIELDSET')
          el.removeAttribute("disabled");
      },

      hideBlock: function(el) {
        el.setAttribute("hidden", "hidden");

        if (el.tagName === 'FIELDSET')
          el.setAttribute("disabled", "disabled");
      },

      hideAllBlocks: function () {
        for (var i = 0, len = this.blockNameNode.length; i < len; i++) {
          this.hideBlock(this.blockNameNode[i]);
        }
      },

      swapBlock: function(e) {
        var getValue  = e.target.value,
            getTarget = '';

        // verification supplémentaire pour la checkbox
        if (this.checkboxNode && !this.checkboxNode.checked) {
          this.hideAllBlocks();
          return;
        }

        // si valeur null
        if (!getValue) {
          this.hideAllBlocks();
          return;
        } else {
          for (var i = 0, len = this.blockNameNode.length; i < len; i++) {
            getTarget = JSON.parse(this.blockNameNode[i].getAttribute(target));

            if (getTarget.indexOf(getValue) > -1) {
              this.showBlock(this.blockNameNode[i]);
            } else {
              this.hideBlock(this.blockNameNode[i]);
            }
          }
        }
      },
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
