/*
  Description:
  [data-e-modal] à mettre sur la modal
  [data-e-modal-target] à mettre sur le bouton
  NOTE : [data-e-modal] & [data-e-modal-target] doivent avoir le memem nom
  ex:  [data-e-modal = "myBlock"]  [data-e-modal-target = "myBlock"]
  NOTE : le reste des attribus de la modal sont injecter en js par init()

  HTML:
  <div data-e-modal="theName" ></div>
  <button data-e-modalTarge="theName"></button>

  JS usage:
  Initialisation :
  E.plugins.eModal();

  Appler une méthode de l'extérieur :

  $0.eModal.open();
    possibilité de faire un callback pour eModal.open()
  $0.eModal.close();

    NOTE:
    bug génant des modales ouvertes dans l'estimation. A la fermeture pour éviter cela, il faut ajouter dans l'attribut data-e-modal "preventBodyScroll": false
*/


;(function(window, document, E, undefined) {

  'use strict';

  var pluginName  = 'eModal',
      attr        = 'data-e-modal',
      dataContent = 'data-e-modal-content',
      dataClose   = 'data-e-modal-close',
      dataOpen    = 'data-e-modal-open',
      tabbable    = 'button, input, select, textarea, [tabindex], [contenteditable], a, video, iframe, embed, object, summary',
      defaults    = {
        target:    "",
        autoStart: false,
        preventBodyScroll: false,
        overlayClose: true
      };

  function Plugin(el, options) {
    this.el            = el;

    var dataOptions    = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
    this.settings      = E.extend(true, defaults, options, dataOptions);

    this.modalContent  = this.el.querySelector('['+ dataContent +']');
    this.btnClose      = this.el.querySelectorAll('['+ dataClose +']');
    this.modalTarget   = document.querySelectorAll('['+ dataOpen +'="'+ this.settings.target +'"]');
    this.main          = this.el.querySelector('.c-modal__main');
    this.tabbable      = this.el.querySelector(tabbable);
    this.modalCloseButton = this.el.querySelector(".c-modalCloseButton");

    this.body          = document.getElementsByTagName('body')[0];
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that    = this,
          lastElement = document.createElement('span');
          lastElement.className = 'is-lastItem';
          lastElement.setAttribute('tabindex', '0');

      that.modalContent.setAttribute('role', 'dialog');
      that.modalContent.setAttribute('aria-labelledby', 'modalMainTitle');
      that.modalContent.setAttribute('aria-describedby', 'modalDesc');
      that.modalContent.setAttribute('aria-hidden', 'true');
      that.modalContent.appendChild(lastElement);
      that.events().autoStart();
      return this;
    },

    events: function() {
      var that = this;

      document.addEventListener('keyup', that.accessKey.bind(that));

      for (var i = 0, len = that.btnClose.length; i < len; i++) {
        that.btnClose[i].addEventListener('click', that.close.bind(that));
      }
      console.log(that.settings.overlayClose);
      if (that.settings.overlayClose) {
        that.el.addEventListener('click', function(e) {
          if (e.target.className === 'c-modal__overlay')
            that.close();
        });
      }


      that.modalContent.addEventListener('click', function(e) {
        if (e.target.hasAttribute(dataClose))
          that.close();
      });

      for (var j = 0, len2 = that.modalTarget.length; j < len2; j++) {
        that.modalTarget[j].addEventListener('click', that.open.bind(that));
      }

      return that;
    },

    accessKey: function(e) {
      var that = this,
          keycode = e.which;

      if (that.el.classList.contains("is-active")) {
        if (that.settings.overlayClose && E.keyNames[keycode] === 'escape' ) {
          that.close();
        }


        if (E.keyNames[keycode] === 'tab') {
          var lastElement = e.target.classList.contains('is-lastItem');

          if (lastElement) {
            window.setTimeout(function() {
              that.tabbable.focus();
            }, 0);
          }
        }
      }
    },

    autoStart: function() {
      var that = this,
          timer = that.settings.autoStart * 1000 ;

      if(that.settings.autoStart) {
        setTimeout(function() {
          that.open();
        }, timer);
      }
    },

    open: function(callback) {
      var that= this;

      //When the modal appears, give to tje first elem inside the modal focusable the focus()
      window.setTimeout(function() {
        that.tabbable.focus();
      }, 0);

      if (this.settings.preventBodyScroll)
        E.noScroll.prevent();
      
      that.modalContent.setAttribute('aria-hidden', 'false');
      that.el.classList.remove('u-hide');

      setTimeout(function(){
        that.el.classList.add('is-active');
        that.el.style.opacity = 1;
        
        if(callback !== undefined && callback !== null)
          callback();
      }, 100);

      //chargement ifram
      if (that.settings.iframe)
        that._iframe();
    },

    close: function() {
      var that = this;
      that.modalContent.setAttribute('aria-hidden', 'true');
      that.el.style.opacity = 0;

      setTimeout(function(){
        that.el.classList.add('u-hide');
      }, 1000);

      that.el.classList.remove('is-active');

      if (this.settings.preventBodyScroll)
        E.noScroll.allow();

      // vide contenu
      if (that.settings.iframe) {
        this.main.innerHTML = '';
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
