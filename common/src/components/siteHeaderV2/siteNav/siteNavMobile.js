;(function($, window, document, E, undefined){

  'use strict';

  var pluginName = 'eExpandMobile',
      attr       = 'data-e-expand-mobile';

  var target  = 'data-e-expand-mobile-target';

  // don't forget to define default settings values
  var defaults = {
    target:             '',
    btnActiveClass:     'is-active',
    contentOpenedClass: 'is-opened'
  };

  //close all layers
  function closeAll() {

    $('['+ attr +']').each(function(){
      this.eExpandMobile.close();
    });
  }

  //when keypress tabPrev, open prev layer
  function openCloseOnKeyPrev() {
    var $triggers      = $('['+ attr +']'),
        $targets       = $('['+ target +']'),

        $focusEl       = $targets.find(':focus'),
        $closestTarget = $focusEl.closest($targets),

        active         = $targets.index($closestTarget);

    if (!$closestTarget.hasClass('is-opened')) {
      if (active > '-1') {
        $triggers.eq(active).trigger('key-open');
      }
    }
  }


  function Plugin( el, options ) {
    this.item       = el;
    this.$item      = $(el);

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.isClosed   = true;
    this.$target    = this.settings.target ? $('['+ target +'='+ this.settings.target +']') : false;

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();

      return this;
    },

    events: function() {
      var that = this;
      
      //prevent default if link has no layer

      that.$item.on('click.expand-prevent', function(e) {
        if (that.settings.target !== '') e.preventDefault();
      });

      that.$item
        .off('mouseenter.expand focus.expand key-open')
        .on('click.expand', that.changeStatus.bind(that));



      //close all opened layer
      $('[data-e-expand-close]').on('click.expand', closeAll);

      return that;
    },

    // pour E.ABtestHeaderHover2Click()
    // Js pour AB-test burger desktop UNIQUEMENT
    // supprimer après AB-test
    hover2click: function() {
      var that = this;

      that.$item.on('click.expand-prevent', function (e) {
        if (that.settings.target !== '') e.preventDefault();
      });

      that.$item
        .off('mouseenter.expand focus.expand key-open')
        .on('click.expand', that.changeStatus.bind(that));
    },

    changeStatus: function() {
      if (!this.isClosed) {
        // ferme simplement le menu si déjà ouvert
        closeAll();
        return this;
      }

      openCloseOnKeyPrev();
      if (this.settings.target) this.open();
      return this;
    },

    scroll: function() {

      if (window.matchMedia('(max-width: 1024px)').matches) {
        var reg =  this.item.getBoundingClientRect().top;

        window.scrollTo({
          top: reg,
          behavior: 'smooth'
        })        
      }

      return this;
    },

    open: function() {
      closeAll();
      this.isClosed = false;

      this.$item.addClass(this.settings.btnActiveClass);
      this.$target.addClass(this.settings.contentOpenedClass);

      this.scroll()

      return this;
    },

    close: function() {
      if (this.settings.target) {
        this.isClosed = true;

        this.$item.removeClass(this.settings.btnActiveClass);
        this.$target.removeClass(this.settings.contentOpenedClass);
      }

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

    //close all opened layer on body mouseenter
    $('.c-siteHeaderV2').on('mouseleave.expand-body', closeAll);

    //close opened menu on escape key
    $(document).on('keydown.expand', function(e) {
      var keycode = e.which;
      if (E.keyNames[keycode] === 'escape') closeAll();
    });

    $('#siteNavMobile').on('keyup.expand', function(e) {
      var keycode = e.which;

      if (E.keyNames[keycode] === 'tab') {
        if (e.shiftKey) openCloseOnKeyPrev();
      }
    });
  });

})(jQuery, window, document, window.E || {});