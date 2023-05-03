/*
  tabs.js
  -------

  Description:
  -----------
  Plugin d'onglets

  HTML:
  ----


  JS usage:
  --------

*/


;(function ($, window, document, E, undefined) {

  'use strict';

  var pluginName = 'eTabs',
      attr       = 'data-e-tabs';

  var links = '[data-e-tabs-link]',
      panel = '[data-e-tabs-panel]',
      tabbable = 'button, input, select, textarea, [tabindex], [contenteditable], a, video, iframe, embed, object, summary';

  var defaults = {
    autoplay:      false,
    autoplaySpeed: 3000,
    mobileSlide:   true,
    sameHeight:    true
  };

  function Plugin( el, options ) {
    this.item       = el;
    this.$item      = $(el);

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.$panels    = this.$item.find(panel);
    this.$links     = this.$item.find(links);
    this.total      = this.$links.length;
    this.active     = 0; // Le 1er onglet est ouvert par défaut

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;

      that.events();

      if (that.settings.mobileSlide) {
        if (that.settings.autoplay)
          that.setAutoplay();

        // init right mode: slider (mobile) or tabs (others: don't forget data-slick-delayed!)
        that.build();

        // switch mode on breakpoint change
        window.addEventListener('changed.ab-mediaquery', that.switchMode.bind(that));
      } else {
        that.build();
      }

      return that;
    },

    setAutoplay: function() {
      this.slickAutoplay()
          .tabAutoplay();
    },

    slickAutoplay: function() {
      // set right slick settings for autoplay
      var $slick    = this.$item.find('[data-slick-delayed]'),
          dataSlick = $slick.data('slick-delayed');

      dataSlick = E.extend(dataSlick, this.settings);
      $slick.data('slick-delayed', dataSlick);

      return this;
    },

    tabAutoplay: function() {
      // init tabs autoplay
      var that = this;
      that.tabAutoplayTimer;

      if (!that.settings.autoplay) return that;

      clearInterval(this.tabAutoplayTimer);
      that.tabAutoplayTimer = setInterval(that.playTabs.bind(that), that.settings.autoplaySpeed);

      return that;
    },

    stopAutoplay: function() {
      clearInterval(this.tabAutoplayTimer);
    },

    playTabs: function() {
      // activate the right tab in autoplay mode
      this.setActive();

      this.active++;
      if (this.active === this.total) this.active = 0;
    },

    switchMode: function() {
      // switch between tabs and slick
      if (AB.mediaQuery.is('medium')) {
        this.$item.find('[data-slick].slick-initialized').slick('unslick');
        this.build();
      } else {
        // on laisse slick gérer la hauteur
        $(window).off('resize.es-comments');
        this.$panels.css('height', 'auto');

        E.initSlick();
      }

      return this;
    },

    events: function() {
      var that = this;

      // pause tabs autoplay on mouse hover
      this.$item
        .on('mouseenter.tabPlugin', that.stopAutoplay.bind(that))
        .on('mouseleave.tabPlugin', that.tabAutoplay.bind(that));

      this.$item.on('click.tabs', links, function(e){
        e.preventDefault();
        // define new active tab
        that.active = that.$item.find(links).index(this);

        // deactivate tabs autoplay on tab click
        that.stopAutoplay();
        that.$item.off('mouseenter.tabPlugin mouseleave.tabPlugin');

        that.setActive();
      });

      return this;
    },

    build: function() {
      var that = this;
      var launchTimer;
      var setInt = 0;

      function alertFunc() {
        that.setHeight();
        setInt++;
        if (setInt === 4) {
          clearInterval(launchTimer);
        }
      }

      // clean slick carousel attributes
      that.$panels.removeAttr('tabindex aria-describedby role');

      if (that.settings.sameHeight) {
        that.setHeight();

        // tuleap 4401 Test bug patch for ie and Safari, take height of the element tabs
        launchTimer = setInterval(alertFunc, 1100);
        // End Patch tuleap 4401

        // update max height on resize
        $(window)
          .off('resize.es-comments')
          .on('resize.es-comments', E.debounce(function () {
            that.setHeight();
          }, 250));
      }

      // activate 1st tab
      that.setActive();

      return that;
    },

    setActive: function() {
      this.$panels.removeClass('is-active');
      this.$panels.find(tabbable).attr('tabindex', -1);
      this.$links.removeClass('is-active');

      this.$panels.eq(this.active).addClass('is-active');
      this.$panels.eq(this.active).find(tabbable).removeAttr('tabindex');
      this.$links.eq(this.active).addClass('is-active');

      return this;
    },

    setHeight: function() {
      var heights = this.$panels.height('').map(function() {
            return $(this).outerHeight();
          }).get(),
          maxHeight = Math.max.apply(null, heights);

      this.$panels.height(maxHeight);

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

})(jQuery, window, document, window.E || {});