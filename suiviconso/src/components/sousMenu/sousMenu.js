/*
inputMat password
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eSousMenu',
      attr       = 'data-e-sous-menu';

  var defaults   = {};

  function Plugin(el, options) {
    this.el = el;
    this.scrollPos = 0;
    this.nav = this.el.querySelectorAll('[' + attr + '] a');

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      document.querySelector('html').style.scrollBehavior = "smooth";
      this.events();
    },

    events: function() {
      var that = this;
      for (var i = 0, len = this.nav.length; i < len; i++) {
        this.nav[i].addEventListener('click', that.goTo.bind(that));
      }

      document.addEventListener('scroll', that.scrollNav.bind(that));
      //document.addEventListener('scroll', that.readScroll.bind(that));
    },

    goTo: function(e) {

      var clickedTab = e.currentTarget;
      var getId = clickedTab.getAttribute('target');
      location.href = "#"+getId;
      
      var uri = window.location.toString();
      if (uri.indexOf("#") > 0) {
        var clean_uri = uri.substring(0,
        uri.indexOf("#"));

        window.history.replaceState({},
        document.title, clean_uri);
      }

      // for (var i = 0, len = this.nav.length; i < len; i++) {
      //   this.nav[i].classList.remove("is-active");      
      // }
      // clickedTab.classList.add("is-active");
      // var target = document.querySelector('#' + getId);
      // E.scrollTo({
      //   next: target,
      //   offset: 90
      // });
    },
    scrollNav: function() {
      for (var i = 0, len = this.nav.length; i < len; i++) {
        var getId = this.nav[i].getAttribute('target');
        var target = document.querySelector('#' + getId);
        var navBarHeight = target.getBoundingClientRect().top;
        var height = target.offsetHeight;
        this.nav[i].classList.remove("is-active");
        if((navBarHeight < 160) && (navBarHeight > ((height * -1)+160))) {
          this.nav[i].classList.add("is-active");
        }
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

