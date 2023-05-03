/*
  accordion.js
  -----------

  Description:
  -----------
  Plugin accordéon

  HTML:
  ----
  data-e-accordion='{"jsSlideAnimation": true, "multiselectable": true}'
  data-e-accordion-tab id="tab1" (aria-expanded="true" pour ouvrir à l'ouverture)
  data-e-accordion-panel aria-labelledby="tab1"

  JS usage:
  --------
  Options facultatives (passer plutôt par data-e-accordion) :
  $0.eAccordion({
    jsSlideAnimation: true, // slide animé en JS
    multiselectable:  true  // ouverture multiple
  });

  Détruire l'instance du plugin sur un élément :
  $0.eAccordion.destroy();
*/

;(function ($, window, document, E, undefined) {

  'use strict';

  var pluginName = 'eAccordion',
      attr       = 'data-e-accordion';

  var tab        = '[data-e-accordion-tab]',
      panel      = '[data-e-accordion-panel]',
      // https://allyjs.io/data-tables/focusable.html#document-elements
      tabbable   = 'button, input, select, textarea, [tabindex], [contenteditable], a, video, iframe, embed, object, summary';

  function getHeight($panel) {
    // regles css permettant de recuperer la hauteur du panel avant de le setter
    var panelHeight = $panel.css({
                        visibility: 'hidden',
                        display: 'block',
                        height: 'auto'
                      }).outerHeight();

    $panel.css({
      visibility: '',
      display:    '',
      height:     0
    });

    return panelHeight;
  }

  var defaults = {
    jsSlideAnimation: true,
    multiselectable:  true
  };

  function Plugin(el, options) {
    this.item       = el;
    this.$item      = $(el);

    this.$tabs      = this.$item.find(tab);
    this.$panels    = this.$item.find(panel);

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.currentIndex = 0;
    this.tabsNbr      = this.$tabs.length - 1;

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.build()
          .events();

      return this;
    },

    // Put right attributes
    build: function() {
      var that    = this,
          $opened = that.$tabs.filter('[aria-expanded="true"]');

      that.$item.attr({
        'role': 'tablist',
        'aria-multiselectable': that.settings.multiselectable
      });
      that.$tabs.attr('role', 'tab');
      that.$panels.attr('role', 'tabpanel');

      that.close();

      // après fermeture... on ouvre le ou les tabs choisis
      setTimeout(function(){
        if (that.settings.multiselectable) {
          // ouvrir les tabs ayant aria-expanded="true"
          $opened.each(function() {
            that.currentIndex = that.$item.find(tab).index(this);
            that.open($(this));
          });
          return this;
        }

        that.open(that.$tabs.eq(that.currentIndex));
      }, 0);

      return this;
    },

    // Destroy the plugin
    destroy: function () {
      // fermeture
      this.settings.jsSlideAnimation = false;
      this.close();

      // clean des éléments
      this.$tabs
          .off('keydown.e-accordion')
          .removeAttr('role aria-selected aria-expanded tabindex');

      this.$panels
          .off('keydown.e-accordion')
          .removeAttr('role aria-hidden');

      this.$item
          .off('click.e-accordion')
          .removeAttr('role');

      delete this.item.eAccordion;

      return this;
    },

    events: function() {
      var that = this;

      that.$item.on('click.e-accordion', tab, function(e) {
        var $this  = $(this),
            closed = $this.attr('aria-expanded') === 'false';

        e.preventDefault();

        // set active tab
        that.currentIndex = that.$item.find(tab).index(this);

        // if NOT multiselectable -> close all first
        if (!that.settings.multiselectable) {
          if (closed) {
            that.close.call(that);
            that.open.call(that, $this);
          } else {
            that.close.call(that);
          }

          return false;
        }

        // if multiselectable
        if (closed) {
          that.open.call(that, $this);
          return false;
        }

        that.close.call(that, $this);
      });

      // Keys on tabs
      that.$item.on('keydown.e-accordion', function(e) {
        var keycode = e.which;

        switch (E.keyNames[keycode]) {
          // To previous tab
          case 'up':
          case 'left':
            e.preventDefault();
            that.focusUp.call(that);
            break;

          // To next tab
          case 'down':
          case 'right':
            e.preventDefault();
            that.focusDown.call(that);
            break;

          // To 1st tab
          case 'start':
            e.preventDefault();
            that.currentIndex = 0;
            that.setFocus();
            break;

          // To last tab
          case 'end':
            e.preventDefault();
            that.currentIndex = that.tabsNbr;
            that.setFocus();
            break;

          // Open current panel
          case 'enter':
          case 'space':
            e.preventDefault();
            that.$tabs.eq(that.currentIndex).trigger('click.e-accordion');
            break;
        }
      });

      // keyup dans les panneaux
      that.$panels.on('keydown.e-accordion', function(e) {
        var keycode = e.which;

        switch (E.keyNames[keycode]) {
          case 'up':
            if (e.ctrlKey) {
              e.preventDefault();
              that.setFocus();
            }
            break;

          // To previous tab
          case 'prev':
            if (e.ctrlKey) {
              e.preventDefault();
              that.focusUp.call(that);
            }
            break;

          // To next tab
          case 'next':
            if (e.ctrlKey) {
              e.preventDefault();
              that.focusDown.call(that);
            }
            break;
        }
      });
    },

    setFocus: function() {
      this.$tabs.eq(this.currentIndex).focus();
      return this;
    },

    focusDown: function() {
      if (this.currentIndex === this.tabsNbr) {
        this.currentIndex = 0;
        this.setFocus();
        return this;
      }

      if (this.currentIndex < this.tabsNbr) {
        this.currentIndex++;
        this.setFocus();
      }

      return this;
    },

    focusUp: function() {
      if (this.currentIndex === 0) {
        this.currentIndex = this.tabsNbr;
        this.setFocus();
        return this;
      }

      if (this.currentIndex >= 0) {
        this.currentIndex--;
        this.setFocus();
      }

      return this;
    },

    // Open current panel
    open: function ($tab) {
      var $panel = this.$panels.eq(this.currentIndex);

      this.$tabs.attr('tabindex', '-1');
      $tab.attr({
        'aria-selected': 'true',
        'aria-expanded': 'true',
        'tabindex':      '0'
      });

      $panel.attr('aria-hidden', 'false');

      this.allowFocus($panel);

      $(document).trigger('e-accordion.open', [this.currentIndex]);

      if (this.settings.jsSlideAnimation) {
        $panel
          .stop()
          .animate({'height': getHeight($panel) +'px'}, 250, function() {
            $(this).css('height', 'auto');
          });

        return this;
      }

      $panel.css('height', 'auto');

      return this;
    },

    // Close tabs
    close: function (tab) {
      // if no tab specified, close all tabs
      var $tab   = tab || this.$tabs,
          $panel = tab ? this.$panels.eq(this.currentIndex) : this.$panels;

      this.$tabs.attr('tabindex', '-1');
      $tab.attr({
        'aria-selected': 'false',
        'aria-expanded': 'false',
        'tabindex':      '0'
      });

      $panel.attr('aria-hidden', 'true');

      this.preventFocus($panel);

      if (this.settings.jsSlideAnimation) {
        $panel
          .stop()
          .animate({'height': 0}, 250);
        return this;
      }

      $panel.css('height', 0);

      return this;
    },

    // Les enfants de panels fermés ne sont pas focussables
    preventFocus: function($panel) {
      $panel.find(tabbable).attr('tabindex', -1);
    },

    allowFocus: function($panel) {
      $panel.find(tabbable).removeAttr('tabindex');
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

})(jQuery, window, document, window.E || {});
