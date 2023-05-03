/*
  Description:
  renderPAge();

  HTML:

  data-e-filters-article='{"page" : 1, "articlePerPage": 9}'
  data-e-filters-article-content // cible le block qui affiche les articles

  JS usage:
  _renderPage(); // rendu d'une page d'articles

  Appler une méthode de l'extérieur :
*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eFiltersArticle',
      attr       = 'data-e-filters-article',
      content    = 'data-e-filters-article-content',
      defaults   = {
        page:           1, // référence de la page, par defaults
        articlePerPage: 9, // nombre d'article contenu par section de page
        lastArticle:    0  // index du 1er article à l'affichage
      };

  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.page            = this.settings.page;
    this.articlePerPage  = this.settings.articlePerPage;
    this.lastArticle     = this.settings.lastArticle;
    this.blocContent     = this.el.querySelector('[' + content + ']');
    this.templateArticle = document.querySelector('[data-tpl="listArticles"]').innerHTML;
    this.listArticles    = E.listArticles;

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      // demo
      this.blocContent.innerHTML = '';
      this._renderPage();
      // end demo

      return this;
    },

    _renderPage: function() {
      var html = [];

      for (var i = this.lastArticle; i < this.articlePerPage; i++) {
        if (!this.listArticles[i]) break;
        html.push(E.templateEngine(this.templateArticle, this.listArticles[i]));
      }

      this.blocContent.innerHTML += html.join('');

      // mise à jour dernier article affiché
      this.lastArticle += this.articlePerPage;

      return this;
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
