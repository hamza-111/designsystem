;(function (window, document, E, undefined) {
  'use strict';

  // Assigner l'attribut [data-e-noscroll] au wrapper du contenu du site pour éviter un effet de scroll

  E.noScroll = {
    siteWrapperAttr: '[data-e-no-scroll]',
    noScrollClass:   'no-scroll',
    currentPos:      0,

    prevent: function () {
      var siteWrapper = document.querySelectorAll(this.siteWrapperAttr);
      this.currentPos = window.scrollY;

      document.documentElement.classList.add(this.noScrollClass);

      // si pas de wrapper, on applique au body
      if (siteWrapper.length <= 0) {
        document.body.style.position = 'fixed';
        document.body.style.top = - this.currentPos + 'px';
        document.body.style.left = 0;
        document.body.style.right = 0;
        return;
      }

      for (var i = 0, len = siteWrapper.length; i < len; i++) {
        siteWrapper[i].style.position = 'fixed';
        siteWrapper[i].style.top = - this.currentPos + 'px';
        siteWrapper[i].style.left = 0;
        siteWrapper[i].style.right = 0;
      }
    },

    allow: function() {
      var siteWrapper = document.querySelectorAll(this.siteWrapperAttr);

      document.documentElement.classList.remove(this.noScrollClass);

      if (siteWrapper.length <= 0) {
        document.body.style.position = 'static';
        window.scrollTo(0, this.currentPos);

        return;
      }

      for (var i = 0, len = siteWrapper.length; i < len; i++) {
        siteWrapper[i].style.position = 'static';
      }

      window.scrollTo(0, this.currentPos);
    }
  };

})(window, document, window.E || {});
