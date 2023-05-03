/*
  headerArticle.js
  -----------

  Description:
  composant headerArticle

*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eHeaderArticlePagination.',
      attr       = 'data-e-header-article-pagination';

  var defaults   = {
    elemTarget:        '',
    articleFooterLink: ''
  };

  function Plugin( el, options ) {
    this.item       = el;

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;

      if (!this.getValues()) return;

      this.events();
    },

    events: function() {
      var that = this;

      this.item.addEventListener('click', that.redirectUser.bind(that));
    },

    getValues: function(){
      this.elemTarget        = this.item.getAttribute(attr);
      this.articleFooterLink = document.querySelector('[' + this.elemTarget + ']');

      return this.elemTarget && this.articleFooterLink;
    },

    redirectUser: function(e){
      var articleFooterHref = this.articleFooterLink.getAttribute('href');

      e.preventDefault();

      if (this.articleFooterLink.classList.contains('tracking_lien')) {
        this.articleFooterLink.click();
      } else {
        document.location.href = articleFooterHref;
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