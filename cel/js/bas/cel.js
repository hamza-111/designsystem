;(function ($, window, document, E, undefined) {

  'use strict';

  // activate debug mode
  if (document.documentElement.hasAttribute('data-debug')) {
    E.debug = true;
  }

  // IE8 needs the console object to be created
  if (!window.console) {
    window.console = {
      log: function () { },
      warn: function () { },
      error: function () { },
      time: function () { },
      timeEnd: function () { }
    };
  }

  // init AB-mediaQuery: https://github.com/lordfpx/AB-mediaQuery
  abMediaQuery({
    delay: 500
  });

  if (E.debug) {
    // display current media queries
    console.log(AB.mediaQuery.current);
    window.addEventListener('changed.ab-mediaquery', function(){
      console.log(AB.mediaQuery.current);
    });
  }

  // init AB-interchange: https://github.com/lordfpx/AB-interchange
  abInterchange({
    lazy:       false,
    delay:      100,
    offscreen:  1.5
  });


  $(document).ajaxComplete(function(event, xhr, settings) {
    // vérification du format de réponse (HTML)
    try {
      $(xhr.responseText);
    } catch(e) {
      return;
    }

    // re-init AB-interchange in xhr
    if ($(xhr.responseText).find('[data-ab-interchange]').length > 0) {
      abInterchange({
        lazy:       false,
        delay:      100,
        offscreen:  1.5
      });
    }

    // reinit des plugins
    E.launchUpdaters();
  });

})(jQuery, window, document, window.E || {});
/*
  Description:
  Banner only for mobile
  the Banner propose to dowload the Gaz Tarif Réglementé's App
*/

;(function(window, document, E, undefined){

  'use strict';

  document.addEventListener('DOMContentLoaded', function(){
    var osUserAgent       = navigator.userAgent,
        bannerApp         = document.querySelector('[data-tpl="bannerApp"]'),
        listUserAgentTest = (/Android|iPhone|Windows Phone/i.test(osUserAgent)),
        localStorageTest  = Cookies.get('e-bannerApp') !== 'closed',
        metaAppsId        = E.bannerApp;

    // N'activer que si nécessaire
    if ( !(AB.mediaQuery.is('smallOnly') && listUserAgentTest && localStorageTest && bannerApp) )
      return;

    var tplBannerApp       = bannerApp.innerHTML,
        tplLayoutBannerApp = document.querySelector('[data-e-bannerapp]'),
        iPhoneTest         = /iPhone/i.test(osUserAgent),
        WindowsTest        = /Windows Phone/i.test(osUserAgent),
        AndroidTest        = /Android/i.test(osUserAgent),
        data               = { url: '' };

    // load the bannerApp in the element and get the url
    function appearBannerApp() {
      var metaRexContent = (/app-id=([^\s,]+)/),
          metaId         = '';

      if (iPhoneTest) {
        metaId = metaRexContent.exec(metaAppsId.iOS)[1];
        data.url =  'https://itunes.apple.com/fr/app/id'+ metaId;

      } else if (AndroidTest) {
        metaId = metaRexContent.exec(metaAppsId.Android)[1];
        data.url = "http://play.google.com/store/apps/details?id="+ metaId;
      }

      if (iPhoneTest || AndroidTest) {
        tplLayoutBannerApp.innerHTML = E.templateEngine(tplBannerApp, data);
        document.documentElement.classList.add('has-bannerApp');
        closeBanner();
      }
    }

    // close banner
    function closeBanner() {
      var btnClose = document.querySelector('[data-e-bannerapp-close]');

      if (!btnClose) return;

      btnClose.addEventListener('click' , function() {
        Cookies.set('e-bannerApp', 'closed', { expires: 7 });
        tplLayoutBannerApp.style.display = 'none';
      });
    }

    // on initialise tout
    appearBannerApp();
  });
})(window, document, window.E || {});




/*
  scrollTo.js
  -----------

  Description:
  Permet de créer un scrollTo
  - insérer l'attribut [data-e-scrollTo] dans une ancre <a> et définir l'ancre dans un attribut href sur lequel il doit pointer
  - pour des raisons d'accessibilité, l'attribut ne marche que si la balise <a> a une ancre spécifiée

  HTML:
  exemple :
  <a data-e-scrollto href="#monID">Tata</a>
  <button data-e-scrollto='{"target": ".toto"}'>Tata</a>
*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eScrollto',
      attr       = 'data-e-scrollto';

  var defaults   = {
    speed: 500,
    offset: 0,
    target: undefined
  };

  function Plugin( el, options ) {
    this.item       = el;

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.target;
    this.init();

  }

  Plugin.prototype = {
    init: function() {
      this.target = this.getTarget();

      if (this.target)
        this.events();
    },

    events: function() {
      this.item.addEventListener('click', this.scroll.bind(this));
    },
    // get the attribut of the href IF ELSE get setting.target
    getTarget: function() {
      if (this.settings.target === undefined) {
        var id = this.item.getAttribute('href');

        if (id && id.startsWith('#'))
          return document.querySelector(id);

      } else {
        if (this.settings.target)
          return document.querySelector(this.settings.target);
      }

      return false;

    },

    scroll: function() {
      E.scrollTo({
        next: this.target,
        offset: this.settings.offset
      });
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

/*
  backToTop.js

  Description:
  spécificité js de ce composant permet de gere juste sont apparition au scroll

  HTML:
  Ajouter l'attribut [data-e-backtotop] sur un élément HTML
*/

;(function(window, document, E, undefined){

  'use strict';

  document.addEventListener('DOMContentLoaded', function(){
    var back2top = document.querySelector('[data-e-backtotop]'),
        ticking  = false;

    if (!back2top) return;

    function back2TopStatus() {
      document.documentElement.scrollTop >= 100 ?
        back2top.classList.add("is-active") : back2top.classList.remove("is-active");
    }

    if (AB.mediaQuery.is('smallOnly')) {
      window.addEventListener('scroll', function(e) {
        if (!ticking) {
          window.requestAnimationFrame(function() {
            back2TopStatus();
            ticking = false;
          });
        }
        ticking = true;
      });
    }
  });

})(window, document, window.E || {});

/*
  openPopup.js
  ------------

  Description:
  -----------
  Ouverture des popup système

  HTML:
  ----
  data-e-popup="popup" ('popup' étant le nom de la popup)
*/

;(function (window, document, E, undefined) {

  'use strict';

  document.addEventListener('DOMContentLoaded', function(){

    document.addEventListener('click', function(e) {
      var clickedEl = e.target,
          link      = clickedEl.closest('[data-e-popup]');

      if(link) {
        e.preventDefault();
        var url        = link.getAttribute('href'),
            windowName = link.getAttribute('data-e-popup');

        window.open(url, windowName, 'height=700, width=600, toolbar=no, menubar=no, scrollbars=yes, resizable=no, location=no, directories=no, status=no');
      }
    });

  });

})(window, document, window.E || {});

/*
  sticky.js
 */

;(function(window, document, E, undefined){

  'use strict';

  var pluginName    = 'eSticky',
      attr          = 'data-e-sticky',
      container     = 'data-e-sticky-container',
      containerMain = 'data-e-sticky-container-main';

  // don't forget to define default settings values
  var defaults = {
    container:  '',
    hAlign:     'right',
    keepBottom: false,
    scrollTop: false,
    sousMenu: false
  };

  // Contructor
  function Plugin(el, options) {
    this.item       = el;
    this.scrollPos = 0;
    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    // pas pour mobile
    if (!AB.mediaQuery.is('large'))
      return;

    this.originalStyles = {
       // donne la  valeur calculée finale de toutes les propriétés CSS sur un élément.
      top: window.getComputedStyle(this.item).top,
      bottom: window.getComputedStyle(this.item).bottom
    };

    this.itemHeight = this.item.offsetHeight;
    this.mode       = '';
    this.valueTop = 0

    // container principal utilisé si pas de container cible
    this.containerMain = document.querySelector('['+ containerMain +']') || document.body;

    // container cible pour limiter la zone sticky
    if (this.settings.container) {
      this.container = document.querySelector('['+ container +'='+ this.settings.container +']');
    }

    // pas de container spécifique ou si ce container n'existe pas
    if (!this.settings.container || !this.container) {
      this.container = this.containerMain;
    }

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.item.classList.add('c-sticky');
      this.item.classList.add('c-sticky--fixed');
      
      this.setStickyMode()
          .events();
    },

    events: function() {
      window.addEventListener('scroll', this.setStickyMode.bind(this));
      window.addEventListener('resize', E.debounce(this.setStickyMode.bind(this), 200));
    },

    setStickyMode: function () {
      // mode sticky partiel
      if ((document.body.getBoundingClientRect()).top === this.scrollPos){
        this.item.classList.remove('c-sticky--stickyHalf');
      }

      if ((document.body.getBoundingClientRect()).top < this.scrollPos) {
        this.item.classList.add('c-sticky--stickyHalf');
      }

      // composant positionné en BAS
      if (this.settings.keepBottom) {
        if (this.container.getBoundingClientRect().top + this.itemHeight + parseInt(this.originalStyles.bottom, 10) > window.innerHeight) {
          this.setStickyTop();
          return this;
        }

        if (this.container.getBoundingClientRect().bottom < window.innerHeight) {
          this.setStickyBottom();
          return this;
        }

        this.setSticky();
        return this;
      }

      // composant positionné en HAUT
      if (!this.settings.scrollTop) {
        if (this.container.getBoundingClientRect().top + this.itemHeight > 0) {
          this.setStickyTop();
          return this;
        }

        if (this.container.getBoundingClientRect().bottom - parseInt(this.originalStyles.top, 10) - this.itemHeight < 0) {
          this.setStickyBottom();
          return this;
        }

        this.setSticky();
        return this;
      } else {
        this.currentTop = (document.body.getBoundingClientRect()).top;

        // redefini la valeur de ValueTop pour le comportement du header sousMenu a false
        if (!this.settings.sousMenu) {
          this.valueTop = (this.scrollPos + this.itemHeight)
        }
     
        if ((this.currentTop + this.itemHeight) > this.valueTop ) {
          
          if (this.scrollPos !== this.itemHeight) {
            this.item.classList.add('c-sticky--fixed');
            this.item.classList.remove('c-sticky--unstickyTop');
          } 
          if ((this.currentTop + this.itemHeight) === 0) {
            this.item.classList.remove('c-sticky--fixed');
          }
        } else if (this.container.getBoundingClientRect().top + this.itemHeight < 0)  {
            this.item.classList.remove('c-sticky--fixed');
            this.item.classList.add('c-sticky--unstickyTop');
        } 

        this.scrollPos = this.currentTop;

        return this;
      }
    },



    setSticky: function() {
      // toujours besoin de recalculer la position horizontale
      this.setPositionHorizontal();

      if (this.mode === 'fixed')
        return;

      this.mode = 'fixed';
      this.item.style.position = 'fixed';

      if (this.settings.keepBottom) {
        this.item.style.top      = 'auto';
        this.item.style.bottom   = this.originalStyles.bottom;
      } else {
        this.item.style.top      = this.originalStyles.top;
        this.item.style.bottom   = 'auto';
      }

      this.item.classList.add('c-sticky--fixed');
      this.item.classList.remove('c-sticky--unstickyTop');
      this.item.classList.remove('c-sticky--unstickyBottom');

      return;
    },

    setStickyTop: function() {
      if (this.mode === 'top')
        return;

      this.mode = 'top';
      this.resetPositionHorizontal();

      this.item.style.position = 'absolute';
      this.item.style.bottom   = 'auto';

      if (this.settings.keepBottom) {
        this.item.style.top = this.originalStyles.bottom - this.itemHeight;
      } else {
        this.item.style.top = this.originalStyles.top;
      }

      this.item.classList.remove('c-sticky--fixed');
      this.item.classList.add('c-sticky--unstickyTop');
      this.item.classList.remove('c-sticky--unstickyBottom');
    },

    setStickyBottom: function() {
      if (this.mode === 'bottom')
        return;

      this.mode = 'bottom';
      this.resetPositionHorizontal();

      this.item.style.position = 'absolute';
      this.item.style.top      = 'auto';

      if (this.settings.keepBottom) {
        this.item.style.bottom = this.originalStyles.bottom;
      } else {
        this.item.style.bottom = 0;
      }

      this.item.classList.remove('c-sticky--fixed');
      this.item.classList.remove('c-sticky--unstickyTop');
      this.item.classList.add('c-sticky--unstickyBottom');
    },

    resetPositionHorizontal: function() {
      if (this.settings.hAlign === 'right') {
        this.item.style.right = 0;
        this.item.style.left  = 'auto';
      } else {
        this.item.style.left  = 0;
        this.item.style.right = 'auto';
      }
    },

    setPositionHorizontal: function() {
      var container        = !this.container ? this.containerMain : this.container,
          containerBoxLeft = container.getBoundingClientRect().left +'px';

      if (this.settings.hAlign === 'right') {
        this.item.style.right = containerBoxLeft;
      } else {
        this.item.style.left = containerBoxLeft;
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

/*
  storageLink.js
  --------------

  Description:
  Créer un ou plusieurs localStorage au click
  Optionel: permet de supprimer des localStorage

  HTML:
  data-e-storage='[{"item": "VENTE-choixEnergie", "value": "G", "day": 0.083}, {"item": "VENTE-storageDate", "value": "", "day": 0.083}, {"item": "VENTE-choixStatut", "value": "EMDM", "day": 0.083}]'
  data-e-storage='{"item": "VENTE-choixEnergiexxx", "value": "G", "day": 0.083}'

  Pour supprimer, ajouter en plus cet attribut avec 1 localStorage ou un array de localStorage
  data-e-storage-remove='["VENTE-choixMarque", "VENTE-trDemande", "VENTE-codePostal", "VENTE-codeINSEE", "VENTE-nomCommune"]'
  data-e-storage-remove ne peut PAS s'utiliser sans data-e-storage
*/

;(function($, window, document, E, undefined){

  'use strict';

  var pluginName = 'eStorage',
      attr       = 'data-e-storage';

  var triggerDel = '[data-e-storage-remove]';

  var defaults   = {};

  function Plugin(el, options) {
    this.item       = el;
    this.$item      = $(el);

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.datas      = this.$item.data(pluginName);

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();

      return this;
    },

    events: function() {
      var that = this;

      that.$item
        .on('click.storageLink', that.setStorage.bind(that));

      return that;
    },

    // suppression de storage
    delStorage: function(e) {
      var listItems = this.$item.data('eStorageRemove');

      if (!listItems) return this;

      E.storage.removeItem(listItems);

      return this;
    },

    // création de storage
    setStorage: function(e) {
      var items = this.datas;

      // si on doit supprimer des storages
      if (this.$item.data('eStorageRemove')) this.delStorage();

      if (items.constructor === Array) {
        for (var i = 0, len = items.length; i < len; i++) {
          var item = items[i];

          // specifique à TEL
          if (item.item === 'VENTE-storageDate') item.value = new Date().getTime();

          E.storage.setItem(item.item, item.value, item.day);
        }

        return this;
      }

      // specifique à TEL
      if (items.item === 'VENTE-storageDate') items.value = new Date().getTime();

      E.storage.setItem(items.item, items.value, items.day);

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

/*
  Description:
  read commentaire from boleplate.js
  gestion du comportement de la bar de recherche du header

  HTML:
  <div class="c-searchBar v3 is-active" data-e-searchbar="data-e-searchbar"></div>

  JS usage:
  Initialisation :
  E.plugins.eMyplugin(); // avec éventuellement des paramètres

  Appler une méthode de l'extérieur :
  $0.eSearchbar.activeMod()
  $0.eSearchbar.closeMod()
*/


;(function($, window, document, E, undefined){

    'use strict';
  
    var pluginName = 'eSearchbar', 
        attr       = 'data-e-searchbar', 
        defaults   = {
          aString: '',
          aBolean: true
        }; 
        
    var tabbable    = 'button, input, select, textarea, [tabindex], [contenteditable], a, video, iframe, embed, object, summary'

    // Our constructor
    function Plugin(el, options) { 
      this.el = el;

  
      // options taken from data-attribute
      var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
  
      // merge: defaults, specified when calling plugin and data-attribute
      this.settings   = E.extend(true, defaults, options, dataOptions);
  
      this.input    = this.el.querySelector('.c-searchBar__input');
      this.submit   = this.el.querySelector('.c-searchBar__submit');
      this.mask     = document.querySelector('.c-searchBar__mask');
      this.form     = document.querySelector('.c-searchBar__wrap form');
      this.body     = document.querySelector('body');
      this.tabbable = this.el.querySelector(tabbable);
      this.init();
    }
  
    Plugin.prototype = {

      init: function() {


        this.events();

        return this;
      },
  
      events: function() {
        var that = this;

        if (!that.input.value === false) {
          that.form.submit();
        }
    
        this.submit.addEventListener('click', function(e) {
          e.preventDefault();
          if (!that.input.value === false) {
              that.form.submit();
          }
        });

        this.submit.addEventListener('click', this.activeMod.bind(this));
        this.input.addEventListener('focus', this.activeMod.bind(this));
        this.mask.addEventListener('click', this.closeMod.bind(this));
        document.addEventListener('keyup', that.accessKey.bind(this));
  
        return this;
      },
      
      // Miscellaneous method
      activeMod: function() {
        // in IIFE, if passing 'window' and 'document',
        // You better specify 'window.' or 'document.'
        // to optimize performance a little bit

        this.input.focus();
        console.log(this.input)

        if (!this.el.classList.contains("is-active")) {
          this.el.classList.add("is-active");
          this.mask.classList.add("is-active");
          this.body.classList.add('no-scroll');
        }

        return this;
      },

      closeMod: function() {
        if (this.el.classList.contains("is-active")) {
          this.el.classList.remove("is-active");
          this.mask.classList.remove("is-active");
          this.body.classList.remove('no-scroll');
        }
      },

      accessKey: function(e) {
        var that = this,
            keycode = e.which;
  
        if (that.el.classList.contains("is-active")) {
          if (E.keyNames[keycode] === 'escape' ) {
            that.closeMod();
          }
  
  
          if (E.keyNames[keycode] === 'tab') {
            var lastElement = e.target.classList.contains('is-lastItem');
  
            if (lastElement) {
              window.setTimeout(function() {
                that.closeMod();
              }, 0);
            }
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
      // when we use ajax, init again the plugin
      E.updaters[pluginName] = function() {
        E.plugins[pluginName]();
      };
    });
  
  })(jQuery, window, document, window.E || {});
  
/*
  Description:
  read commentaire from boleplate.js
  gestion du comportement de la bar de recherche du header

  HTML:
  <div class="c-searchBar v3 is-active" data-e-searchbar="data-e-searchbar"></div>

  JS usage:
  Initialisation :
  E.plugins.eMyplugin(); // avec éventuellement des paramètres

  Appler une méthode de l'extérieur :
  $0.eSearchbar.activeMod()
  $0.eSearchbar.closeMod()
*/


;(function($, window, document, E, undefined){

    'use strict';
  
    var pluginName = 'eSearchbarMobile', 
        attr       = 'data-e-searchbarmobile', 
        defaults   = {
          aString: '',
          aBolean: true
        }; 
        
    var tabbable    = 'button, input, select, textarea, [tabindex], [contenteditable], a, video, iframe, embed, object, summary'

    // Our constructor
    function Plugin(el, options) { 
      this.el = el;

  
      // options taken from data-attribute
      var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
  
      // merge: defaults, specified when calling plugin and data-attribute
      this.settings   = E.extend(true, defaults, options, dataOptions);
  
      this.input    = this.el.querySelector('.c-searchBarMobile__input');
      this.submit   = this.el.querySelector('.c-searchBarMobile__submit');
      this.mask     = document.querySelector('.c-searchBar__mask');
      this.form     = document.querySelector('.c-searchBarMobile__wrap form');
      this.close    = document.querySelector('.c-searchBarMobile__return');
      this.body     = document.querySelector('body');
      this.tabbable = this.el.querySelector(tabbable);
      this.maskNav     = document.querySelector('.c-siteHeader__mask');
      this.init();
    }
  
    Plugin.prototype = {

      init: function() {

        this.events();

        return this;
      },
  
      events: function() {
        var that = this;
    
        this.submit.addEventListener('click', function(e) {
          e.preventDefault();
          if (!that.input.value === false) {
            that.form.submit();
        }
          that.activeMod();
        });


        this.input.addEventListener('focus', this.activeMod.bind(this));
        this.close.addEventListener('click', this.closeMod.bind(this));
        this.mask.addEventListener('click', this.closeMod.bind(this));
        document.addEventListener('keyup', that.accessKey.bind(this));
  
        return this;
      },

      focusMethod: function () {
        this.input.focus()
      },

      activeMod: function() {
        
        if (!this.el.classList.contains('is-active')) {
          this.el.classList.add("is-active");
          this.body.classList.add('no-scroll');
          this.mask.classList.add("is-active");
        }

        this.input.focus();

        return this;
      },

      closeMod: function() {
        var that = this;

        if (this.el.classList.contains("is-active")) {
          this.el.classList.remove("is-active");
          this.mask.classList.remove("is-active");
          this.body.classList.remove('no-scroll');
        }
        
        if (this.maskNav.classList.contains("is-active")) {
          this.maskNav.classList.remove("is-active");
        }
      },

      accessKey: function(e) {
        var that = this,
            keycode = e.which;
  
        if (that.el.classList.contains("is-active")) {
          if (E.keyNames[keycode] === 'escape' ) {
            that.closeMod();
          }
  
  
          if (E.keyNames[keycode] === 'tab') {
            var lastElement = e.target.classList.contains('is-lastItem');
  
            if (lastElement) {
              window.setTimeout(function() {
                that.closeMod();
              }, 0);
            }
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
      // when we use ajax, init again the plugin
      E.updaters[pluginName] = function() {
        E.plugins[pluginName]();
      };
    });
  
  })(jQuery, window, document, window.E || {});
  
/*
  Description:
  Banner only for mobile
  the Banner propose to dowload the Gaz Tarif Réglementé's App
*/

;(function(window, document, E, undefined){

  'use strict';

  document.addEventListener('DOMContentLoaded', function(){
    var btnMenu       = document.querySelector('.c-siteHeaderV2__mainNav__menu'),
        menuMobilMask  = document.querySelector('.c-siteHeader__mask');
        //stickyHeader  = document.querySelector('c-sticky');

    btnMenu && btnMenu.addEventListener('click' , function() {
    if (!menuMobilMask.classList.contains("is-active")) {
      menuMobilMask.classList.add("is-active"); 
      //stickyHeader.style = 'position : initial !important';
    } else {
      menuMobilMask.classList.remove("is-active");   
      //stickyHeader.style = 'position : fixed !important';
      }
    });

    menuMobilMask && menuMobilMask.addEventListener('click' , function() {
      if (!menuMobilMask.classList.contains("is-active")) {
        menuMobilMask.classList.add("is-active")
      } else {
        menuMobilMask.classList.remove("is-active")
      }
    });
    

  });
})(window, document, window.E || {});




/*
  Description:
  ...

  HTML:
  ...

  JS usage:
  Initialisation :
  E.plugins.eDropDownHeader(); // avec éventuellement des paramètres

  Appler une méthode de l'extérieur :
  $0.eDropDownHeader.openWrap();
  $0.eDropDownHeader.closeWrap();
*/


;(function($, window, document, E, undefined){

  'use strict';

  var pluginName = 'eDropDownHeader',
      attr       = 'data-e-dropDownHeader',
      defaults   = {};

  function Plugin(el, options) {
    this.el = el;
    this.lien = this.el.querySelector('.c-siteHeaderV2CustomerArea__button');
    this.btn = this.el.querySelector('.c-siteHeaderV2__dropDown');
    this.close = this.btn.querySelector('.js-close');
    this.mask = this.el.querySelector('.c-siteHeaderV2__dropDown__mask');

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};

    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();

    if (this.el.classList.contains('no-js')) {
      this.el.classList.remove('no-js');
    }
      return this;
    },

    events: function() {
      var that = this;
      this.listener = {1:this.lien, 2:this.close, 3:this.mask};

      document.addEventListener('keyup', that.accessKeyboard.bind(that));

      for (var prop in this.listener) {
        this.listener[prop].addEventListener('click', this.toogleList.bind(this));
      }

      return this;
    },

    accessKeyboard: function(e) {
      var keycode = e.which;

      if (E.keyNames[keycode] === 'tab') {
        if (e.target.classList.contains('js-siteHeaderV2-lastChild')) {
          this.toogleList();
        }
      }
    },

    toogleList: function(e) {
        if (this.el.classList.contains('is-active')) {
          this.el.classList.remove('is-active');
        } else {
          this.el.classList.add('is-active');
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

})(jQuery, window, document, window.E || {});

;(function($, window, document, E, undefined){

  'use strict';

  var pluginName = 'eExpand',
      attr       = 'data-e-expand';

  var target  = 'data-e-expand-target';

  // don't forget to define default settings values
  var defaults = {
    target:             '',
    btnActiveClass:     'is-active',
    contentOpenedClass: 'is-opened'
  };

  //close all layers
  function closeAll() {

    $('['+ attr +']').each(function(){
      this.eExpand.close();
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
      that.$item
        .off('click.expand')
        .on('mouseenter.expand focus.expand key-open', that.changeStatus.bind(that));

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

      closeAll();
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
    $('.c-searchBar, .c-siteHeaderV2__logo, .c-siteHeaderV2__blocRight, .c-siteHeaderV2CustomerArea').on('mouseenter', closeAll);

    //close opened menu on escape key
    $(document).on('keydown.expand', function(e) {
      var keycode = e.which;
      if (E.keyNames[keycode] === 'escape') closeAll();
    });

    $('#siteNav').on('keyup.expand', function(e) {
      var keycode = e.which;

      if (E.keyNames[keycode] === 'tab') {
        if (e.shiftKey) openCloseOnKeyPrev();
      }
    });
  });

})(jQuery, window, document, window.E || {});
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
/*
  toggle.js
  ---------

  Description:
  -----------
  Ouvrir/fermer un panneau.
  Utiliser le CSS pour l'affichage en vous appuyant sur les classes.

  HTML:
  ----
  <button data-e-toggle='{"target": "legal"}'>Mentions légales</button>

  <div data-e-toggle-target="legal">
    <p>Lorem ipsum dolor sit amet.</p>
  </div>

  Options facultatives:
  ----
  "btnActiveClass"     : "is-close"
  "contentOpenedClass" : "is-opened"
  "autoClose"          : false // se fermera automatiquement si un autre toggle est ouvert (voir siteHeader)
  "opened"             : false // ouvert au chargement
  "delayClose"         : null  // delai de fermeture automatique
  "delayOpen"          : null  // delai d'ouverture automatique
*/

;(function (window, document, E, undefined) {

  'use strict';

  var pluginName   = 'eToggle',
      attr         = 'data-e-toggle',
      target       = 'data-e-toggle-target',
      closeTrigger = 'data-e-toggle-close';

  var defaults = {
    target:             '',
    btnActiveClass:     'is-active',
    contentOpenedClass: 'is-opened',
    autoClose:          false,
    autoCloseWrap:      false,
    opened:             false,
    delayClose:         null,
    delayOpen:          null,
    mq:                 '',
    blockScroll:        false
  };

  function Plugin(el, options) {
    this.item       = el;

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.isClosed   = true;
    this.inMediaQuery = true;
    this.timerClose;
    this.timerOpen;

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      if (this.settings.mq) {
        if (Array.isArray(this.settings.mq)) {
          this.inMediaQuery = this.settings.mq.some(function(mq) {
            return AB.mediaQuery.is(mq);
          });
        } else {
          this.inMediaQuery = AB.mediaQuery.is(this.settings.mq);
        }
      }

      if (!this.settings.target || !this.inMediaQuery)
        return;

      this.content = document.querySelector('['+ target +'="'+ this.settings.target +'"]');
      // si pas de target, on return...
      if (!this.content)
        return;

      // if (this.settings.opened) this.open();
      this.settings.opened ? this.open() : this.close();

      this._events();

      // on lance le timer de fermeture
      if (this.settings.delayClose) this._delayClose();
      if (this.settings.delayOpen) this._delayOpen();
    },

    _events: function() {
      var that = this;

      that.item.addEventListener('click', that.toggle.bind(that));

      that.item.addEventListener('keydown', function(e) {
        if (E.keyNames[e.which] === 'enter')
          that.toggle(e);
      });

      // boutons de fermeture
      document.addEventListener('click', function(e){
        for (var target = e.target; target && target !== this; target = target.parentNode) {
          if (target.matches('['+ closeTrigger +'="'+ that.settings.target +'"]')) {
            e.preventDefault();
            that.close();
            break;
          }
        }
      });

      if (that.settings.autoClose) {
        document.addEventListener('e-toggle.close-all', that.close.bind(that));
      }
    },

    toggle: function(e) {
      e.preventDefault();

      // remove focus on button
      this.item.blur();

      // on vide les timers qui ne sont plus nécessaires
      if (this.settings.delayClose) clearTimeout(this.timerClose);
      if (this.settings.delayOpen) clearTimeout(this.timerOpen);

      this.isClosed ? this.open() : this.close();
    },

    close: function() {
      var that = this;

      if (this.isClosed) return;

      this.isClosed = true;

      if (this.settings.blockScroll && AB.mediaQuery.is('smallOnly'))
        E.noScroll.allow();

      // update du DOM
      this.item.setAttribute('aria-expanded', 'false');
      this.item.classList.remove('is-active');
      this.content.setAttribute('aria-hidden', 'true');
      this.content.classList.remove('is-opened');

      // trigger event to listen outside
      var event = new CustomEvent('onToggleClose', {
        detail: { toggle: that }
      });
      this.item.dispatchEvent(event);
    },

    open: function() {
      var that = this;

      if (!that.isClosed) return;

      that.isClosed = false;

      if (this.settings.blockScroll && AB.mediaQuery.is('smallOnly'))
        E.noScroll.prevent();

      if (this.settings.autoClose)
        this.closeOthers();

      if ( that.settings.autoCloseWrap)
        that.closeOthersWrap();

      // on lance le timer de fermeture
      if (this.settings.delayClose)
        this.delayClose();

      // update du DOM
      this.item.setAttribute('aria-expanded', 'true');
      this.item.classList.add('is-active');
      this.content.setAttribute('aria-hidden', 'false');
      this.content.classList.add('is-opened');

      // trigger event to listen outside
      var event = new CustomEvent('onToggleOpen', {
        detail: { toggle: that }
      });
      this.item.dispatchEvent(event);
    },

    _delayClose: function() {
      var that = this;
      that.timerClose = setTimeout(that.close.bind(this), that.settings.delayClose);
    },

    _delayOpen: function() {
      var that = this;
      that.timerOpen = setTimeout(that.open.bind(that), that.settings.delayOpen);
    },

    // close other toggles with autoClose: true
    closeOthers: function() {
      var openedToggles = document.querySelectorAll('['+ attr +'][aria-expanded="true"]');

      // s'il n'y a pas de toggles ouverts
      if (openedToggles.length <= 0)
        return this;

      for (var i = 0, len = openedToggles.length; i < len; i++) {
        // s'il n'y a pas l'option autoClose
        if (openedToggles[i] === this.item || !openedToggles[i].eToggle.settings.autoClose)
          continue;

        openedToggles[i].eToggle.close();
      }
    },

    closeOthersWrap: function() {
      var openedTogglesWrapParent = this.item.closest(this.settings.autoCloseWrap),
          itemToggle = openedTogglesWrapParent.querySelectorAll('[aria-expanded="true"]');

      for (var i = 0, len = itemToggle.length; i < len; i++) {
          itemToggle[i].eToggle.close();
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

    // close quand on clique sur la page
    document.addEventListener('click', function(e) {
      var target   = e.target,
          event    = new CustomEvent('e-toggle.close-all'),
          inToggle = target.closest('[data-e-toggle], [data-e-toggle-target]');

      if (!inToggle)
        document.dispatchEvent(event);
    });
  });

})(window, document, window.E || {});

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
// Patch for IE 11
;(function(window, document, E, undefined) {
  
  'use strict';

  document.addEventListener('DOMContentLoaded', function(){
    if ( !window.MSInputMethodContext && !document.documentMode ) 
      return; // if ie11 return true
    
    if (!document.querySelector(".c-radioStyle"))
      return;

    var radioStyle = document.querySelectorAll(".c-radioStyle"),
        icon = document.querySelector('c-radioStyle__icon'),

    checked = function(e) {
      //init
      for (var i = 0; i < radioStyle.length; i++) {
        radioStyle[i].classList.remove('is-checked');
        radioStyle[i].querySelector('input').removeAttribute('checked');

        if(icon) {
          radioStyle[i].querySelector('.icon').classList.add("is-selected");
        }
      }

      this.classList.add('is-checked');
      this.querySelector('input').checked = true;

    };

    for (var i = 0; i < radioStyle.length; i++) {
      radioStyle[i].classList.add('js');
      radioStyle[i].addEventListener('click', checked);
    }

  });
})(window, document, window.E || {});
/*
  Description:
  validation champs

  JS usage:
  Initialisation :
  E.plugins.eFieldValidation();

  Envoyer une erreur custom :
  $0 étant l'élément [data-e-field-validation]
  $0.eFieldValidation.setCustomError('Mon erreur custom');
*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eFieldValidation',
      attr       = 'data-e-field-validation',
      attrError  = 'data-e-field-validation-error';

  var defaults = {
    typing: false,
    validations: {
      badInput:        'Erreur type badInput',
      typeMismatch:    'Erreur type typeMismatch',
      patternMismatch: 'Erreur type patternMismatch',
      rangeOverflow:   'Erreur type rangeOverflow',
      rangeUnderflow:  'Erreur type rangeUnderflow',
      stepMismatch:    'Erreur type stepMismatch',
      tooLong:         'Erreur type tooLong',
      tooShort:        'Erreur type tooShort',
      valueMissing:    'Erreur type valueMissing'
    }
  };

  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.inputEls     = this.el.querySelectorAll('input, select, textarea');
    this.inputEl      = this.inputEls[0];
    this.inputElName  = this.inputEl.name;
    this.formEl       = this.el.closest('[data-e-form-validation]');
    this.errorEl      = this.el.querySelector('[' + attrError +']');
    this.isValid      = this.inputEl.validity.valid;

    this._init();


  }

  Plugin.prototype = {
    _init: function() {
      if (!this.errorEl)
        console.warn("formulaires: un <ul> avec l'attribut data-e-field-validation-error est manquant !");

      this._events();

      if (this.attrFiledset)

        console.log(this.attrFiledset);
    },

    _events: function() {
      var that = this;

      if (this.settings.typing) {
        this.inputEl.addEventListener('keyup', that.checkValidity.bind(that));
      } else {
        // retirer l'état valide/invalid (c'est fait au change)
        this.inputEl.addEventListener('keyup', that.removeStatus.bind(that));
      }

      for (var i = 0, len = this.inputEls.length; i < len; i++) {
        this.inputEls[i].addEventListener('change', that.checkValidity.bind(that));
      }
    },

    checkValidity: function(mode) {
      var that = this;

      // firefox et IE valides même dans filedset disabled...
      if (!this.inputEl.willValidate || this.el.closest('[disabled]'))
        return this;

      // ne pas checker sur 'enter', c'est un submit
      if (mode) {
        var keyupOnEmptyField = (mode.type && mode.type === 'keyup' && !this.inputEl.value);

        if (keyupOnEmptyField)
          return this;
      }

      // chrome et Firefox/IE ne gèrent pas les espace de fin de la même façon malgrès la regex... shame
      if (this.inputEl.type === 'email')
        this.inputEl.value = this.inputEl.value.trim();

      that.isValid = this.inputEl.validity.valid;

      that.isValid ?
        that.setValid() : that.setInvalid(mode);

      // trigger event to listen outside
      var event = new CustomEvent('onValidation', {
        detail: {
          fieldValidation: that
        }
      });
      document.dispatchEvent(event);

      // update form status (when submit, it's already done)
      if (mode !== 'submit' && this.formEl)
        this.formEl.eFormValidation.checkValidation('fields');
    },

    setInvalid: function(mode) {
      var newList = '';

      // on traite les customError spécifiquement pour garder le message
      if (this.inputEl.validity.customError && mode === 'submit')
        return this;

      this.inputEl.setCustomValidity('');

      // loop sur toutes les validités
      /*jshint forin:false */
      for (var prop in this.inputEl.validity) {
        // on boucle sur les propriété natives de 'validity'
        if (!this.inputEl.validity.hasOwnProperty(prop)) {
          if (prop === 'valid' || prop === 'typeMismatch' || prop === 'customError')
            continue;

          if (this.inputEl.validity[prop])
            newList += '<li>' + this.settings.validations[prop] + '</li>';
        }
      }
      /*jshint forin:true */

      this.errorEl.innerHTML = newList;
      this.el.classList.add('is-error');
      this.el.classList.remove('is-success');
    },

    setValid: function() {
      this.errorEl.innerHTML = '';

      this.el.classList.remove('is-error');
      if (this.inputEl.value)
        this.el.classList.add('is-success');
    },

    isRealInput: function(key) {
      switch (E.keyNames[key]) {
        case 'tab':
        case 'shift':
        case 'ctrl':
        case 'escape':
        case 'left':
        case 'right':
        case 'down':
        case 'up':
        case 'enter':
          return false;
        default:
          return true;
      }
    },

    removeStatus: function(e) {
      // Ne pas changer le status à la pression de certaines touches
      if (!this.isRealInput(e.which))
        return this;

      this.errorEl.innerHTML = '';

      this.el.classList.remove('is-error');
      this.el.classList.remove('is-success');
    },

    setCustomError: function(message) {
      var that = this;

      this.el.classList.add('is-error');
      this.el.classList.remove('is-success');

      this.inputEl.setCustomValidity(message);
      this.valid = this.inputEl.validity.valid;

      this.errorEl.innerHTML = '<li>'+ message +'</li>';

      // trigger event to listen outside
      var event = new CustomEvent('onValidation', {
        detail: {
          fieldValidation: that
        }
      });
      document.dispatchEvent(event);
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

/*
  Description:
  validation formulaire.
  Check tout les champs contenu dans les formulaire

  HTML:
  <form class="c-formMat" novalidate="novalidate" data-e-form-validation="data-e-form-validation">
    [...]
    <button type="submit" data-e-form-validation-submit="data-e-form-validation-submit">Valider</button>
  </form>

  JS usage:
  Initialisation :
  E.plugins.eFormValidation();

  Appler une méthode de l'extérieur :
  $0 étant l'élément [data-e-form-validation]
  $0.eFormValidation.checkValidation()
*/

;(function(window, document, E, undefined){
  'use strict';

  var pluginName = 'eFormValidation',
      attr       = 'data-e-form-validation',
      defaults   = {
        switchBtnState: true
      };

  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(defaults, options, dataOptions);

    this.submitBtn = this.el.querySelector('[data-e-form-validation-submit]');
    this.timeout;

    this._init();
  }

  Plugin.prototype = {
    _init: function() {
      if (this.settings.switchBtnState)
        this.submitBtn.classList.add('is-disabled');

      this._events();
    },

    _events: function() {
      this.el.addEventListener('submit', this._onSubmit.bind(this));
    },

    _onSubmit: function(e) {
      if (!this.el.checkValidity())
        e.preventDefault();

      this.updateFields()
          .checkValidation();
    },

    updateFields: function() {
      var fields = this.el.querySelectorAll('[data-e-field-validation]');
      for (var i = 0, len = fields.length; i < len; i++) {
        fields[i].eFieldValidation.checkValidity('submit');
      }

      return this;
    },

    checkValidation: function(mode) {
      var that = this;

      // si le contrôle vient d'un champs, on ne vérifie pas les autres
      if (mode !== 'fields')
        this.updateFields();

      if (this.settings.switchBtnState) {
        if (this.el.checkValidity())
          this.submitBtn.classList.remove('is-disabled');
        else
          this.submitBtn.classList.add('is-disabled');
      }

      // scroll vers la 1ère erreur
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function() {
        if (!that.el.checkValidity() && mode !== 'fields')
          that.scroll2Error();
      }, 400);
    },

    scroll2Error: function() {
      var target = this.el.querySelector('[data-e-field-validation].is-error');

      E.scrollTo({
        next:   target,
        offset: 90
      });
    }
  };

  E.plugins[pluginName] = function(options) {
    var elements = document.querySelectorAll('['+ attr +']');
    for (var i = 0, len = elements.length; i < len; i++) {
      if (elements[i][pluginName]) continue;
      elements[i][pluginName] = new Plugin(elements[i], options);
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    E.plugins[pluginName]();

    E.updaters[pluginName] = function() {
      E.plugins[pluginName]();
    };
  });
})(window, document, window.E);



/*
inputMat-city.js
*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName       = 'eCity',
      attr             = 'data-e-citymat',
      zipAttr          = 'data-e-citymat-zip',
      cityAttr         = 'data-e-citymat-city',
      cityAttrFallback = 'data-e-citymat-city-fallback';

  var defaults   = {
    url: '',
    wrongZipMessage: 'Le code postal ne semble pas correct',
    errorResponse: 'un erreur est servenu !!!'
  };

  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.zipBlock          = this.el.querySelector('['+ zipAttr +']');
    this.cityBlock         = this.el.querySelector('['+ cityAttr +']');
    this.cityFallbackBlock = this.el.querySelector('['+ cityAttrFallback +']');

    this.resp = {};

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();
    },

    events: function() {
      var that = this;

      // event de validation de champs envoyé par fieldValidation
      this.zipBlock.addEventListener('keyup', that.callApi.bind(that));
    },

    callApi: function(e) {
      var that    = this,
          input   = e.target,
          isValid = input.checkValidity(),
          request = new XMLHttpRequest(),
          xhr     = this.settings.url;

      if (!isValid) {
        this.emptyCityBlock();
        return;
      }

      if (E.debug) {
        // Fake - exemple pour villes multiples
        if (input.value === '47600')
          xhr = '../fake/zip2city-multiple.json';
        else
          xhr = '../fake/zip2city-single.json';
      } else {
        xhr = xhr + input.value;
      }

      request.open('GET', xhr, true);

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          if (!E.isJson(request.response)) {
            that.zipBlock.eFieldValidation.setCustomError(that.settings.wrongZipMessage);
            return;
          }

          that.resp = JSON.parse(request.response);
          that.updateCityBlock();
        } else {
          that.zipBlock.eFieldValidation.setCustomError(that.settings.errorResponse);
          console.warn('La réponse a eu un problème');
          that.cityFallback();
        }
      };

      request.onerror = function() {
        that.cityFallback();
      };

      request.send();
    },

    cityFallback: function() {
      var input = this.cityFallbackBlock.querySelector('input');

      this.cityFallbackBlock.hidden = false;
      this.cityFallbackBlock.classList.remove('is-disabled');

      input.disabled = false;

      this.cityBlock.hidden = true;
    },

    updateCityBlock: function() {
      var select  = this.cityBlock.querySelector('select'),
          options = [];

      for (var i = 0, len = this.resp.listeCommunes.length; i < len; i++) {
        options.push('<option value="'+ this.resp.listeCommunes[i].nomCommune +'">'+ this.resp.listeCommunes[i].nomCommune +'</option>');
      }

      select.innerHTML = options.join('');

      select.removeAttribute('disabled');
      this.cityBlock.classList.remove('is-disabled');
    },

    emptyCityBlock: function() {
      var select = this.cityBlock.querySelector('select');
      select.innerHTML = '';
      select.setAttribute('disabled', 'disabled');
      this.cityBlock.classList.add('is-disabled');
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

/*
  Description:
  eSwitchToggle is a toggle switch with 2 elements
  - for a connection with the event element and the blocContent, put the same Value
  - in the blocContent put the attribute
    - [aria-hidden="true"] => to reference for the bloc default who will be appear
    - [aria-hidden="false"] => to reference the bloc who will be hidden
    - [hidden] => put in the blocContent who will be hidden

  HTML:
  <button data-e-switch-toggle="tata"> Switch Toggle </button>

  <section data-e-switch-toggle-name="tata"></section>
  <section data-e-switch-toggle-name="tata"></section>

  data-e-switch-toggle sert à déclencher le toggle, data-e-switch-toggle-name est la cible du toggle.
  Le script fonctionne en injectant un attribut aria-hidden à la cible du toggle, lui attribuant la valeur false pour l'afficher ou true pour le masquer.

  JS usage:
  Initialisation :
  E.plugins.eSwitchToggle();

  Appler une méthode de l'extérieur :
  $0.eSwitchToggle.callMe();
  $0.eSwitchToggle.event()
  $0.eSwitchToggle.hideBloc()
  $0.eSwitchToggle.showBloc()
  $0.eSwitchToggle.switchToggle()
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eSwitchToggle',
      attr       = 'data-e-switch-toggle';

  var defaults   = {};

  // Our constructor
  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.elValue       = this.el.getAttribute(attr);
    this.blocContent   = document.querySelectorAll('[data-e-switch-toggle-name="'+ this.elValue +'"]');
    this.inputCheckbox = this.el.querySelector('input[type="checkbox"], input[type="radio"]');

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.initToggle()
          .events();

      return this;
    },

    initToggle: function () {
      for (var i = 0, len = this.blocContent.length; i < len; i++) {
        if (this.blocContent[i].hasAttribute("hidden")) {
          this.blocContent[i].setAttribute("aria-hidden", "true");
        } else {
          this.blocContent[i].setAttribute("aria-hidden", "false");
        }
      }

      return this;
    },

    events: function() {
      var that = this;

      if (this.inputCheckbox) {
        this.el.addEventListener('change', that.switchToggle.bind(that));
      } else {
        this.el.addEventListener('click', E.debounce(function (e) {
          that.switchToggle();
        }, 150));
      }

      return this;
    },

    hideBloc: function(el) {
      el.setAttribute("aria-hidden", "true");
      el.setAttribute("hidden", "hidden");

      if (el.tagName === 'FIELDSET')
        el.setAttribute("disabled", "disabled");
    },

    showBloc: function(el) {
      el.setAttribute("aria-hidden", "false");
      el.removeAttribute("hidden");

      if (el.tagName === 'FIELDSET')
        el.removeAttribute("disabled");
    },

    switchToggle: function() {
      for (var i = 0, len = this.blocContent.length; i < len; i++) {
        if (this.blocContent[i].hasAttribute('hidden'))
          this.showBloc(this.blocContent[i]);
        else
          this.hideBloc(this.blocContent[i]);
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
  });

})(window, document, window.E || {});

/*
  Date-picker vendor flatepickr : https://chmln.github.io/flatpickr/
  - datePicker.input et datePicker.calendarContainer sont deux méthodes de flatepickr :
    * input renvoie à l'input associé au flatpickr
    * calendarContainer renvoie à l'élément div.flatpickr-calendar du datepicker

    $0._flatpickr permet d'acéder au flatpickr sur un input.

    minDate: 'tomorrow' est une option rajoçutée par ce script (pas native)
    minDate recupere egalement la valeur de l'option
    ex :  minDate: -5 = today - 5 jours

    maxDate recupere egalement la valeur de l'option
    ex :  maxDate: 5 = today + 5 jours


*/

;(function (window, document, E, undefined) {

  'use strict';

  var attr = 'data-flatpickr';

  if (!window.flatpickr ) return;


  function initFlatpickr(el) {
    var dataOptions = E.isJson(el.getAttribute(attr)) ? JSON.parse(el.getAttribute(attr)) : {},
        defaultOptions =  {
          dateFormat: 'd/m/Y',
          allowInput: true,
          onChange : undefined,
          maxPromoDate: undefined
        },
        settings = E.extend(true, defaultOptions, dataOptions);


    // ajout d'une option 'tomorrow' non prévue par flatpickr + setting.minDate
    if (settings.minDate) {
      if (settings.minDate === 'tomorrow') {
        settings.minDate = new Date().fp_incr(1);
      }

      if (!isNaN(settings.minDate) )
        settings.minDate = new Date().fp_incr(settings.minDate);
    }

    // pour le setting.maxDate
    if (settings.maxDate) {
      if (settings.maxDate === 'tomorrow')
        settings.maxDate = new Date().fp_incr(1);

      if (!isNaN(settings.maxDate) )
        settings.maxDate = new Date().fp_incr(settings.maxDate);
    }

    // target selectedDates for appear a blocInfo
    if (settings.onChange) {
      var infoBloc = document.querySelector("[data-e-flatpickrinfo]");

      if (!isNaN(settings.maxPromoDate) )
        settings.maxPromoDate = new Date().fp_incr(settings.maxPromoDate);

      // parametre selectedDates, dateStr, instance propre au plugin voirDoc :
      // https://flatpickr.js.org/events/
      settings.onChange = function(selectedDates, dateStr, instance) {

        if (selectedDates[0] <= settings.maxPromoDate) {
          infoBloc.classList.remove("u-hide");
        } else {
          infoBloc.classList.add("u-hide");
        }
      };
    }
    window.flatpickr.localize(flatpickr.l10ns.fr); // pour la version French

      window.flatpickr(el, settings);

    if (!AB.mediaQuery.is('smallOnly'))
      flatepickrTheme(el);
  }




  function flatepickrTheme(el) {
    var regex      = /u-theme-/,
        inputMat   = el.closest('.c-inputMat'),
        inputClass = inputMat.classList;

    // recherche d'un thème pour le copier sur flatpickr
    for (var i = 0, len = inputClass.length; i < len; i++) {
      if (regex.test(inputClass[i])) {
        el._flatpickr.calendarContainer.classList.add(inputClass[i]);
      }
    }
  }

  var elements = document.querySelectorAll('.c-inputMat--datepicker input');

  for (var i = 0, len = elements.length; i < len; i++) {
    initFlatpickr(elements[i]);
  }

})(window, document, window.E || {});



/*
DEMO: affichage suggestions (inputMat avec suggestions)
*/
;(function (window, document, E, undefined) {

  'use strict';

  $('.c-inputMat--suggest').find('input')
    .on('keyup.suggest', function(){
      var $this = $(this),
          $suggest = $this.siblings('.c-suggest');

      if ($this.val()) {
        $suggest.addClass('is-active');
      } else {
        $suggest.removeClass('is-active');
      }
    });

  $('.c-suggest').on('click', '.c-suggest__item', function(){
    var $this  = $(this),
        $list  = $this.closest('.c-suggest'),
        $input = $this.closest('.c-inputMat').find('input'),
        text   = $this.find('.c-suggest__label').text();

    $input.val(text);
    $list.removeClass('is-active');
  });

})(window, document, window.E || {});



/*
DEMO: Label flottant
*/
;(function (window, document, E, undefined) {

  'use strict';

  var pluginName = 'eFloatLabel',
    attr = 'data-e-float-label';

  var defaults = {
    classUp: 'is-focus'
  };

  function Plugin(el, options) {
    this.el = el;
    this.input = this.el.querySelector('input');

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings = E.extend(true, defaults, options, dataOptions);

    this.init();
  }

  Plugin.prototype = {
    init: function () {
      var that = this;

      // for browser autofill without user interaction
      // based on value for Firefox
      // based on -webkit-autofill for Chrome (see CSS)
      setTimeout(function () {
        if (that.input.value || getComputedStyle(that.input, ':-webkit-autofill').content === '"filled"') {
          that.up();
        }
      }, 100);

      that.events();
    },

    events: function () {
      var that = this;

      that.input.addEventListener('focus', that.moveLabel.bind(that));
      that.input.addEventListener('change', that.moveLabel.bind(that));

      that.input.addEventListener('blur', that.moveLabel.bind(that));
    },

    moveLabel: function (e) {
      if (e.type === 'focus' || e.type === 'change') {
        if (!this.el.classList.contains(this.settings.classUp)) {
          this.up();
        }
        return this;
      }

      if (e.type === 'blur' && !this.input.value) {
        this.down();
        return this;
      }
    },

    up: function () {
      this.el.classList.add(this.settings.classUp);
    },

    down: function () {
      this.el.classList.remove(this.settings.classUp);
    }
  };

  E.plugins[pluginName] = function (options) {
    var elements = document.querySelectorAll('[' + attr + ']');
    for (var i = 0, len = elements.length; i < len; i++) {
      if (elements[i][pluginName]) continue;
      elements[i][pluginName] = new Plugin(elements[i], options);
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    E.plugins[pluginName]();
    E.updaters[pluginName] = function () {
      E.plugins[pluginName]();
    };
  });

})(window, document, window.E || {});



/*
inputMat password
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eFormPassword',
      attr       = 'data-e-form-password',
      attrCheckPassword = 'data-e-form-password-check';

  var defaults   = {
    equal:        'Erreur type not equal',
  };

  function Plugin(el, options) {
    this.el = el;
    this.checkPasswords = this.el.querySelectorAll('[' + attrCheckPassword + ']');
    this.checkPasswordInputs = this.el.querySelectorAll('[' + attrCheckPassword + '] input');
    this.btn = this.el.querySelector('[data-e-form-validation-submit]');

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();
    },

    events: function() {
      var that = this;

      this.checkPasswords[0].addEventListener('change', that.checkPassword.bind(that));
      this.checkPasswords[1].addEventListener('change', that.checkPassword.bind(that));

    },

    checkPassword : function() {
        var valueAttr0 = this.checkPasswords[0].getAttribute("data-e-form-password-check");
        var valueAttr1 = this.checkPasswords[1].getAttribute("data-e-form-password-check");
        var valutinput0 = this.checkPasswordInputs[0].value;
        var valutinput1 = this.checkPasswordInputs[1].value;
        if (valutinput1 !== "" && valutinput1 !== "") {
          if ((valueAttr0 === valueAttr1) && (valutinput0 === valutinput1)) {
            this.checkPasswords[1].eFieldValidation.setValid();
            this.btn.classList.remove('is-disabled');
            this.btn.removeAttribute('disabled');
          }else {
            this.checkPasswords[1].eFieldValidation.setCustomError(this.settings.equal);
            this.btn.classList.add('is-disabled');
            this.btn.setAttribute('disabled', 'disabled');
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


/*
CHECK VALIDATION PASSWORD
regex ^(?=.*\d)(?=.*[A-Za-z]).{8,50}$

[data-e-help-password] => attribut sur le champs input
[data-e-help-password-target] => attribut sur le block helper
[data-e-btn-valid] => attribut sur le bouton de validation bloquer tant que le test n'est pas valide
*/

;(function(window, document, E, undefined){

  'use strict';

  document.addEventListener('DOMContentLoaded', function(e) {
    var dataHelpPassword = document.querySelector('[data-e-help-password]');

    if ( !dataHelpPassword) return;

    var inputPassword          = dataHelpPassword.querySelector('input'),
        inputPasswordMinlength = inputPassword.getAttribute('minlength'),
        msgMinLength           = document.querySelector('[data-e-help-password-target="minLength"]'),
        msgNb                  = document.querySelector('[data-e-help-password-target="requireNb"]'),
        msgLetter              = document.querySelector('[data-e-help-password-target="requireLetter"]'),
        msgSpecial             = document.querySelector('[data-e-help-password-target="special"]'),
        msgMinuscule           = document.querySelector('[data-e-help-password-target="minuscule"]');
        // btnValid               = document.querySelector('[data-e-btn-valid]');
        // msgSpecialPattern      = document.querySelector('[data-e-help-password-pattern]');

    //TOdo require : true => version standalone wihtout fmortMat  
    // btnValid.addEventListener("click", function(e) {
    //   !inputPassword.value
    //     dataHelpPassword.classList.add("is-error");
    // });

    inputPassword.addEventListener("keyup", function(evt) {
      var regMdp = {
              minLengh: inputPassword.value.length,
              nb:       /[0-9]/i,
              letter:   /[A-Z]/,
              special:  /^((?!.*[\s])(?=.*[^A-Za-z0-9\s]))/i,
              minuscule: /[a-z]/
            },

          //Test if the value password are valid [ 8 max caracteres| min 1 number| min 1 letter ]
          testMinLength = regMdp.minLengh >= inputPasswordMinlength,
          testNb        = regMdp.nb.test(inputPassword.value),
          testSpecial   = regMdp.special.test(inputPassword.value),
          testLetter    = regMdp.letter.test(inputPassword.value),
          testMinuscule = regMdp.minuscule.test(inputPassword.value);



      // change status in the blockHelper
      testSpecial ?
        msgSpecial.classList.remove("is-error"):
        msgSpecial.classList.add("is-error");

      testMinLength ?
        msgMinLength.classList.remove("is-error"):
        msgMinLength.classList.add("is-error");

      testNb ?
        msgNb.classList.remove("is-error"):
        msgNb.classList.add("is-error");

      testLetter ?
        msgLetter.classList.remove("is-error"):
        msgLetter.classList.add("is-error");

      testMinuscule ?
          msgMinuscule.classList.remove("is-error"):
          msgMinuscule.classList.add("is-error");

      if (testMinLength && testNb && testLetter && testSpecial && testMinuscule) {
        dataHelpPassword.classList.add("is-success");
        dataHelpPassword.classList.remove("is-error");
      } else {
        dataHelpPassword.classList.remove("is-success");
        dataHelpPassword.classList.add("is-error");
      }
    });
  });

})(window, document, window.E || {});


/*
inputMat-iban.js
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eIban',
      attr       = 'data-e-iban';

  var defaults   = {};

  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();
    },

    events: function() {
      var that = this;

      that.el.addEventListener('keyup', that.rewrite.bind(that));
    },

    rewrite: function() {
      var value          = this.el.value,
          foo            = value.split(' ').join(''),
          cursorPosition = this.el.selectionStart;

      if (foo.length > 0) {
        foo = foo.match(new RegExp('.{1,4}', 'g')).join(' ');
      }

      this.el.value = foo;

      this.el.selectionStart = this.el.selectionEnd = cursorPosition + (this.el.value.length - value.length);
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


/*
inputMat password
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'ePassword',
      attr       = 'data-e-password';

  var defaults   = {};

  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.input      = this.el.querySelector('input');
    this.btn        = this.el.querySelector('[data-e-showpassword]');

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();
    },

    events: function() {
      var that = this;

      that.btn.addEventListener('click', that.togglePassword.bind(that));
    },

    togglePassword: function() {
      this.btn.classList.toggle('icon-eye');
      this.btn.classList.toggle('icon-eye-slash');

      if (this.input.getAttribute('type') === 'password') {
        this.input.setAttribute('type', 'text');
      } else {
        this.input.setAttribute('type', 'password');
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


/*
  textareaMat.js

  Compteur de charactères dans un textarea.

  HTML
  ----
  - data-e-textcounter sur le container
  - un textarea avec un maxlength
  - data-e-textcounter-count sur un enfant pour afficher le compte
*/

;(function (window, document, E, undefined) {

  'use strict';

  var pluginName = 'eTextcounter',
      attr       = 'data-e-textcounter',
      defaults   = {};

  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.textarea = this.el.querySelector('textarea');
    this.count    = this.el.querySelector('[data-e-textcounter-count]');
    this.val      = 0;
    this.max      = this.textarea.maxLength;

    this.init();
  }

  Plugin.prototype = {
    init: function () {
      this.events();
    },

    events: function () {
      var that = this;

      that.el.addEventListener('keyup', that.update.bind(that));
    },

    update: function() {
      this.val = this.textarea.value.length;

      this.count.innerText = this.val;
    }
  };

  E.plugins[pluginName] = function (options) {
    var elements = document.querySelectorAll('[' + attr + ']');
    for (var i = 0, len = elements.length; i < len; i++) {
      if (elements[i][pluginName]) continue;
      elements[i][pluginName] = new Plugin(elements[i], options);
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    E.plugins[pluginName]();
    E.updaters[pluginName] = function () {
      E.plugins[pluginName]();
    };
  });

})(window, document, window.E || {});

/*
uploadMat.js
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eUploadMat',
      attr       = 'data-e-uploadmat';

  var defaults   = {
    maxSize: 1048576,
    maxSizeMessage: 'Fichier trop volumineux'
  };

  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.input = this.el.querySelector('input');
    this.list  = this.el.querySelector('[data-e-uploadmat-list]');

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();
    },

    events: function() {
      var that = this;

      that.input.addEventListener('change', that.updateFileList.bind(that));
    },

    updateFileList: function() {
      var li        = [],
          totalSize = 0;

      for (var i = 0, len = this.input.files.length; i < len; i++) {
        totalSize += this.input.files[i].size;
        li.push('<li><span class="icon icon-thin_check u-theme-color"></span>'+ this.input.files[i].name +'</li>');
      }

      if (len === 0 || totalSize > this.settings.maxSize) {
        this.list.style.display = 'none';
        this.el.eFieldValidation.setCustomError(this.settings.maxSizeMessage);
        this.input.value = '';

        // needed to reset input value (readonly on some browsers)
        this.input.type = '';
        this.input.type = 'file';
        return this;
      }

      this.list.style.display = 'block';
      this.list.innerHTML = li.join('');
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


/*
uploadMat.js
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eUploadMat2',
      attr       = 'data-e-uploadmat2';

  var defaults   = {
    maxSize:        1048576,
    maxSizeMessage: 'Fichier trop volumineux',
    types: [],
    fileTypeMessage: 'Format de fichier non supporté'
  };

  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.inputNode      = this.el.querySelector('input');
    this.fileNode       = this.el.querySelector('[data-e-uploadmat2-file]');
    this.resetBtnNode   = this.el.querySelector('[data-e-uploadmat2-reset]');
    this.chooseFileNode = this.el.querySelector('[data-e-uploadmat2-choose]');
    this.resetFileNode  = this.el.querySelector('[data-e-uploadmat2-display]');
    this.listFile       = [];

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this._getTypes()
          ._events();
    },

    _getTypes: function() {
      this.settings.types = this.inputNode.accept.split(/[ ,]+/);
      return this;
    },

    _events: function() {
      var that = this;

      that.inputNode.addEventListener('change', that._updateFileList.bind(that));
      this.resetBtnNode.addEventListener('click', that._reset.bind(that));
    },

    _updateFileList: function() {
      var totalSize = 0;

      this.listFile = [];

      for (var i = 0, len = this.inputNode.files.length; i < len; i++) {
        // check type de fichier
        if (!this._checkFileType(this.inputNode.files[i])) {
          this.el.eFieldValidation.setCustomError(this.settings.fileTypeMessage);
          this._reset();
          return this;
        }

        totalSize += this.inputNode.files[i].size;
        this.listFile.push('<div>'+ this.inputNode.files[i].name +'</div>');
      }

      // check présence de fichier et taille
      if (len === 0 || totalSize > this.settings.maxSize) {
        this.el.eFieldValidation.setCustomError(this.settings.maxSizeMessage);
        this._reset();
        return this;
      }

      this._display();
    },

    _checkFileType: function(file) {
      for (var i = 0, len = this.settings.types.length; i < len; i++) {
        if (file.type === this.settings.types[i])
          return true;
      }

      return false;
    },

    _display: function(){
      // Update du DOM et du wording :
      this.el.eFieldValidation.setValid();

      this.fileNode.innerHTML = this.listFile.join('');
      this.resetFileNode.hidden = false;
      this.chooseFileNode.hidden = true;
    },

    _reset: function(){
      // need to reset input value (readonly on some browsers)
      this.inputNode.value = '';
      this.inputNode.type = '';
      this.inputNode.type = 'file';

      // Update du DOM et du wording :
      this.el.classList.remove('is-success');
      this.fileNode.innerHTML = '';
      this.chooseFileNode.hidden = false;
      this.resetFileNode.hidden = true;
    }
  };

  E.plugins[pluginName] = function(options) {
    var elementsNode = document.querySelectorAll('['+ attr +']');

    for (var i = 0, len = elementsNode.length; i < len; i++) {
      if (elementsNode[i][pluginName]) continue;
      elementsNode[i][pluginName] = new Plugin(elementsNode[i], options);
    }
  };

  document.addEventListener('DOMContentLoaded', function(){
    E.plugins[pluginName]();
    E.updaters[pluginName] = function() {
      E.plugins[pluginName]();
    };
  });

})(window, document, window.E || {});


/*
Decompte pour Basebtn
---------------------
Description:
- [data-e-countdown] => attribut sur Basebtn
- [data-e-countdown-target] => attribut sur l'élément c-btnBase__timer

permet de mettre un minteur (decompte) dans un bouton btnBase disable et passe le btnBase cliquable
SI la valeur est un chiffre entre 0 et 9 prefixé le d'un 0 |00|02|03|04|05|06|07 etc...

HTML:
exemple :
TODO

<button type="button" data-e-countdown="{
        &quot;count&quot;: 5,
        &quot;autoStart&quot;: true,
      }">
    <span data-e-countdown-target="25">14</span>
  </span>
</button>

  Appler une méthode de l'extérieur :
  $0.eCount.timerCountDown();
  $0.eCount.initCountDown();
*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eCount',
        attr     = 'data-e-countdown';

  var defaults   = {
      count:     25,
      autoStart: false
  };

  // Our constructor
  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.countDownContent = this.el.querySelector('.c-btnBase__countDown');
    this.countTarget      = this.el.querySelector('[data-e-countdown-target]');
    this.count            = this.settings.count;
    this.finish           = false;
    this.seconds;
    this.timer            = this.count, this.seconds;


    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;

      that.countTarget.textContent = that.count;
      that.autoStart();

      return that;
    },

    autoStart: function() {
      var that = this;
      if (that.settings.autoStart)
        that.timerCountDown();
    },

    testTimer: function() {
        var that  = this;

        that.seconds = parseInt(that.timer % 60, 10);
        that.seconds = that.seconds; // < 10 ? "0" + that.seconds : that.seconds;
        that.countTarget.textContent = that.seconds;

        if(--that.timer < 0) {
          that.timer = 0;
          clearInterval(that.countDown);
          that.el.removeAttribute('disabled');
          this.countDownContent.classList.add('u-hide');
          that.el.classList.remove('has-countDown');
          this.finish = true;

          return;
        }

        return that;
      },

    initCountDown: function() {
      var that = this;

      that.timer = that.count, that.seconds;
      that.el.setAttribute('disabled', 'disabled');
      that.countTarget.textContent = that.count;
      that.el.classList.add('has-countDown');
      that.countDownContent.classList.remove('u-hide');
    },

    timerCountDown: function() {

      var that = this;
      if( this.finish === false ) {
        that.countDown = setInterval(that.testTimer.bind(that), 1000);
      } else {
        that.initCountDown();
        that.countDown = setInterval(that.testTimer.bind(that), 1000);
      }

      return that;
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

/*
Decompte pour Basebtn
---------------------
Description:
- [data-e-countdown] => attribut sur Basebtn
- [data-e-countdown-target] => attribut sur l'élément c-btnBase__timer

permet de mettre un minteur (decompte) dans un bouton btnBase disable et passe le btnBase cliquable
SI la valeur est un chiffre entre 0 et 9 prefixé le d'un 0 |00|02|03|04|05|06|07 etc...

HTML:
exemple :
TODO

<button type="button" data-e-countdown="{
        &quot;count&quot;: 5,
        &quot;autoStart&quot;: true,
      }">
    <span data-e-countdown-target="25">14</span>
  </span>
</button>

  Appler une méthode de l'extérieur :
  $0.eCount.timerCountDown();
  $0.eCount.initCountDown();
*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eCount',
        attr     = 'data-e-countdown';

  var defaults   = {
      count:     25,
      autoStart: false
  };

  // Our constructor
  function Plugin(el, options) {
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.countDownContent = this.el.querySelector('.c-btnBase__countDown');
    this.countTarget      = this.el.querySelector('[data-e-countdown-target]');
    this.count            = this.settings.count;
    this.finish           = false;
    this.seconds;
    this.timer            = this.count, this.seconds;


    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;

      that.countTarget.textContent = that.count;
      that.autoStart();

      return that;
    },

    autoStart: function() {
      var that = this;
      if (that.settings.autoStart)
        that.timerCountDown();
    },

    testTimer: function() {
        var that  = this;

        that.seconds = parseInt(that.timer % 60, 10);
        that.seconds = that.seconds; // < 10 ? "0" + that.seconds : that.seconds;
        that.countTarget.textContent = that.seconds;

        if(--that.timer < 0) {
          that.timer = 0;
          clearInterval(that.countDown);
          that.el.removeAttribute('disabled');
          this.countDownContent.classList.add('u-hide');
          that.el.classList.remove('has-countDown');
          this.finish = true;

          return;
        }

        return that;
      },

    initCountDown: function() {
      var that = this;

      that.timer = that.count, that.seconds;
      that.el.setAttribute('disabled', 'disabled');
      that.countTarget.textContent = that.count;
      that.el.classList.add('has-countDown');
      that.countDownContent.classList.remove('u-hide');
    },

    timerCountDown: function() {

      var that = this;
      if( this.finish === false ) {
        that.countDown = setInterval(that.testTimer.bind(that), 1000);
      } else {
        that.initCountDown();
        that.countDown = setInterval(that.testTimer.bind(that), 1000);
      }

      return that;
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

/*
  sideMenu.js
  -----------

  Description:
  composant sideMenu

*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'esideMenu',
      attr       = 'data-e-side-menu';

  var defaults   = {
    target: '',
    sideContent: '',
    classToOpen: 'is-menu-open',
    classToClose: 'is-menu-close',
    preventScroll: false,
    runsOnPhone: true,
    runsOnPad: true,
    runsOnDesktop: true
  };

  function Plugin( el, options ) {
    this.item       = el;

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.target         = this.settings.target;
    this.sideContent    = this.settings.sideContent;
    this.classToOpen    = this.settings.classToOpen;
    this.classToClose   = this.settings.classToClose;
    this.preventScroll  = this.settings.preventScroll;
    this.runsOnPhone    = this.settings.runsOnPhone;
    this.runsOnPad      = this.settings.runsOnPad;
    this.runsOnDesktop  = this.settings.runsOnDesktop;
    this.toggleButton   = '';
    this.isOpened       = false;

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

      if ( !this.runsOnPhone && AB.mediaQuery.is('small')) return;
      if ( !this.runsOnPad && AB.mediaQuery.is('medium')) return;
      if ( !this.runsOnDesktop && AB.mediaQuery.is('large')) return;

      for (var i = 0, len = this.toggleButton.length; i < len; i++) {
        this.toggleButton[i].addEventListener('click', that.toggle.bind(that));
      }
    },

    getValues: function(){
      this.sideContent = this.sideContent ? document.querySelector('[data-e-side-menu-content="' + this.sideContent + '"]') : undefined;
      this.toggleButton = this.target ? document.querySelectorAll('[data-e-side-menu-target="' + this.target + '"]') : undefined;

      return this.sideContent && this.toggleButton;
    },

    toggle: function(){
      if ( this.isOpened ) {
        this.close();
      } else  {
        this.open();
      }
    },

    open: function(){
      // Utilise le noScroll pour empêcher le scroll du document à l'ouverture du menu
      if (this.preventScroll) {
        E.noScroll.prevent();
      }

      this.item.classList.remove(this.classToClose);
      this.item.classList.add(this.classToOpen);

      this.sideContent.classList.remove(this.classToClose);
      this.sideContent.classList.add(this.classToOpen);

      this.isOpened = true;
    },

    close: function(){
      // Réactive le scroll du document
      if (this.preventScroll) {
        E.noScroll.allow();
      }

      this.item.classList.remove(this.classToOpen);
      this.item.classList.add(this.classToClose);

      this.sideContent.classList.remove(this.classToOpen);
      this.sideContent.classList.add(this.classToClose);

      this.isOpened = false;
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
/*
  floatingMenu.js
  -----------

  Description:
  composant floatingMenu

*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'efloatingMenu',
      attr       = 'data-e-floating-menu';

  var defaults   = {};

  function Plugin( el, options ) {
    this.item       = el;

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.listElem   = this.item.querySelectorAll('[data-e-floating-menu-target]');

    this.init();
  }

  Plugin.prototype = {
    init: function() {

      this.events();
    },

    events: function() {
      var that = this;

      for (var i = 0, len = this.listElem.length; i < len; i++) {
        this.listElem[i].addEventListener('click', that.toggleClass.bind(that));
      }

      return that;
    },

    toggleClass: function(e){
      var that = this,
          listElem = that.listElem,
          targetElem = e.currentTarget,
          elemBtn = targetElem.getElementsByClassName('c-floatingMenuBtn');

      // Vérifie que le bouton appartient bien à une étape qui a été visitée et qu'il n'est pas disabled:
      if ( !targetElem.classList.contains('is-viewed') || elemBtn[0].hasAttribute('disabled') ) return;

      // Injection de classes :
      for (var i = 0, listLen = listElem.length; i < listLen; i++) {
        // Vérifie que l'élément existe et que ce n'est pas la cible du clique
        if (!listElem[i] || listElem[i] === targetElem) continue;

        // Récupère le bouton contenu dans l'élément courant de la bouche
        var currentBtn = listElem[i].getElementsByClassName('c-floatingMenuBtn');

        // Vérifie que le bouton n'est pas disabled
        if ( currentBtn[0].hasAttribute('disabled') ) continue;

        listElem[i].classList.remove('is-active');
        listElem[i].classList.add('not-active');
      }

      if (targetElem){
        targetElem.classList.remove('not-active');
        targetElem.classList.add('is-active');
      }

      return that;
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
/*
  moreLessInput.js
  -----------

  Description:
  composant moreLessInput

*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'emoreLessInput',
      attr       = 'data-e-more-lessinput';

  var defaults   = {
    input:        '',
    currentValue: '',
    minusButton:  '',
    plusButton:   '',
    plusExponent: '',
    min:          null,
    max:          null,
    step:         1,
    errorMsg:     'Ce champ ne peut recevoir que des chiffres',
  };

  function Plugin( el, options ) {
    this.item       = el;

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.minValue     = this.settings.min;
    this.maxValue     = this.settings.max;
    this.stepValue    = this.settings.step;
    this.errorMsg     = this.settings.errorMsg;

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

      this.updateBtnAvailability();

      this.minusBtnNode.addEventListener('click', that.decrement.bind(that));
      this.plusBtnNode.addEventListener('click', that.increment.bind(that));
      this.inputNode.addEventListener('keyup', that.checkUserKeyEntry.bind(that));
      this.inputNode.addEventListener('keyup', that.updateBtnAvailability.bind(that));
      this.inputNode.addEventListener('change', that.checkUserKeyEntry.bind(that));
      this.inputNode.addEventListener('change', that.updateBtnAvailability.bind(that));
    },

    getValues: function(){
      this.inputNode        = this.item.querySelector('.c-moreLessInput__input');
      this.currentValue     = parseFloat(this.inputNode.value);
      this.minusBtnNode     = this.item.querySelector('.c-moreLessInput__button--minus');
      this.plusBtnNode      = this.item.querySelector('.c-moreLessInput__button--plus');
      this.plusExponentNode = this.item.querySelector('.c-moreLessInput__sup');

      return this.inputNode && this.minusBtnNode && this.plusBtnNode;
    },

    updateBtnAvailability: function(){
      var inputValue = this.inputNode.value;

      // Désactive les boutons + et - si la valeur saisie n'est pas un nombre
      if (isNaN(inputValue)) {
        this.bothUnavailable();
        return;
      }

      // Actualise la variable qui stocke la valeur de l'input
      this.currentValue = parseFloat(inputValue);

      // Active / désactive les boutons d'incrémentation à travers l'attribut "disabled" et si l'option exposant + est activée l'affiche/le masque
      if (this.currentValue === this.minValue) {
        this.minusDisable();

        // Retire l'exposant "+"
        this.hidePlusExponent();
      } else if (this.currentValue === this.maxValue) {
        this.plusDisable();

        // Ajoute l'exposant "+"
        this.showPlusExponent();
      } else {
        this.bothAvailable();

        // Retire l'exposant "+"
        this.hidePlusExponent();
      }
    },

    checkUserKeyEntry: function(e){
      var regexNbr = /^(-)?(\d+(?:\.\d{2})?)$/;

      if (this.inputNode.value <= this.minValue) {
        this.inputNode.value = this.minValue;
      }

      if (this.inputNode.value >= this.maxValue) {
        this.inputNode.value = this.maxValue;
      }

      if (!regexNbr.test(this.inputNode.value)) {
        this.item.eFieldValidation.setCustomError(this.errorMsg);
      }
    },

    minusDisable: function(){
      this.minusBtnNode.setAttribute('disabled', 'disabled');
      this.plusBtnNode.removeAttribute('disabled');
    },

    plusDisable: function(){
      this.plusBtnNode.setAttribute('disabled', 'disabled');
      this.minusBtnNode.removeAttribute('disabled');
    },

    bothAvailable: function(){
      this.minusBtnNode.removeAttribute('disabled');
      this.plusBtnNode.removeAttribute('disabled');
    },

    bothUnavailable: function(){
      this.minusBtnNode.setAttribute('disabled', 'disabled');
      this.plusBtnNode.setAttribute('disabled', 'disabled');
    },

    decrement: function(){
      var inputValue = parseFloat(this.inputNode.value);

      if (this.currentValue === this.minValue) return;

      if (inputValue - this.stepValue <= this.minValue) {
        this.inputNode.value = this.minValue;
      } else {
        this.inputNode.value = inputValue - this.stepValue;
      }

      this.updateBtnAvailability();
    },

    increment: function(){
      var inputValue = parseFloat(this.inputNode.value);

      // Si le champs est vide le passe à 1
      if (this.currentValue === '') {
        this.currentValue = this.stepValue;

      this.inputNode.value = this.currentValue;
        return;
      }

      if (inputValue + this.stepValue >= this.maxValue) {
        this.inputNode.value = this.maxValue;
      } else {
        this.inputNode.value = inputValue + this.stepValue;
      }

      this.updateBtnAvailability();
    },

    showPlusExponent: function(){
      if (this.plusExponentNode) {
        this.plusExponentNode.classList.remove('u-hide');
      }
    },

    hidePlusExponent: function(){
      if (this.plusExponentNode) {
        this.plusExponentNode.classList.add('u-hide');
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
/*
  carousel.js
  ----------

  Description:
  -----------
  Init pour slick carousel

  HTML:
  ---
  Pour initialiser directement
  data-slick

  ou pour initialiser en JS
  data-slick-delayed

  JS usage:
  --------
  Pour initialiser à nouveau (après changement DOM par exemple)
  E.initSlick();
*/

;(function ($, window, document, E, undefined) {

  'use strict';

  document.addEventListener('DOMContentLoaded', function(){

    var delayedSlick = function() {
      var $delayed = $('[data-slick-delayed]');

      $delayed.each(function() {
        var $this = $(this),
            slickOptions = $this.data('slick-delayed');

        $this
          .attr('data-slick', JSON.stringify(slickOptions))
          .removeAttr('data-slick-delayed');
      });
    };

    // init Slick Carousel
    E.initSlick = function() {
      // init slick quand nécessaire: éléments avec data-slick-delayed au lieu de data-slick
      if (AB.mediaQuery.is('smallOnly')) {
        delayedSlick();
      }

      var removeCenterMode = function() {
        if (this.slick.options.centerMode && this.slick.slideCount <= this.slick.options.slidesToShow) {
          this.slick.options.centerMode = false;
        }
      };

      var $dataSlick = $('[data-slick]').not('.slick-initialized');

      $dataSlick.each(function () {
        var $this = $(this),
            settings = {
              speed: 500,
              prevArrow: '<div class="slick-prev"><button type="button"><span class="u-theme-color icon icon-big-chevron-left"></span><span class="u-visibilityHidden">Précédent</span></button></div>',
              nextArrow: '<div class="slick-next"><button type="button"><span class="u-theme-color icon icon-big-chevron-right"></span><span class="u-visibilityHidden">Suivant</span></button></div>',
              customPaging: function(slider, i) {
                var customPage   = $('<div class="c-carousel__dot u-theme-color" />'),
                    customButton = $('<button type="button" data-role="none" role="button" tabindex="0" />').text(i + 1);
                return customPage.append(customButton);
              }
            };

        // avec l'option data-slick-singleNav: navigation déportée
        if ($this.is('[data-slick-singlenav]')) {
          var $nav           = $this.siblings('[data-slick-nav]'),
              singleNavClass = $this.data('slick-singlenav'),
              iconLeft       = 'icon-big-chevron-left',
              iconRight      = 'icon-big-chevron-right';

          settings.appendDots   = $nav.find('[data-slick-dots]');
          settings.appendArrows = $nav.find('[data-slick-arrows]');
          settings.prevArrow    = '<div class="slick-prev"><button type="button"><span class="icon '+iconLeft+'"></span><span class="u-visibilityHidden">Précédent</span></button></div>';
          settings.nextArrow    = '<div class="slick-next"><button type="button"><span class="icon '+iconRight+'"></span><span class="u-visibilityHidden">Suivant</span></button></div>';

          $this
            .slick(settings)
            // on breakpoint change : Fix centerMode bug when not enough slides
            .on('breakpoint', removeCenterMode);

        } else {
          $this
            .slick(settings)
            // on breakpoint change : Fix centerMode bug when not enough slides
            .on('breakpoint', removeCenterMode);
        }
      });

      // to fix that bug: https://github.com/kenwheeler/slick/issues/1808
      window.addEventListener('changed.ab-mediaquery', function(){
        $dataSlick.slick('resize');
      });

      // Init : Fix centerMode bug when not enough slides
      for (var i = 0, len = $dataSlick.length; i < len; i++) {
        removeCenterMode.call($dataSlick[i]);
      }
    };

    E.initSlick();

  });

})(jQuery, window, document, window.E || {});

/*
  Description:
  data-e-redirect permet de gerer les redirections
  par rapport à un retour d'un webservive qui renvois true ou false
  - true renvoi l'url1
  - false renvoi l'url2
  - indiquer l'url du webservice à la clé "service"

  HTML exemple:
  <div data-e-redirect='{
    "url1": "/pages/formulaire-contact.html",
    "url2": "/pages/homepage.html",
    "service": "../fake/fake-ec-redirect.txt"}'>
  </div>

  NOTE:
  le webservice "../fake/fake-ec-redirect.txt", doit renvoyé un booléen
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eRedirect',
      attr       = 'data-e-redirect',
      btn        = 'data-e-redirect-btn',
      defaults   = {
        url1:      'url1',
        url2:      'url2',
        service:   ""
      };

  function Plugin(el, options) {
    this.el = el;

    this.link    = this.el.querySelector('['+btn+']');

    var dataOptions = E.isJson(this.link.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();
    },

    events: function() {
      this.link.addEventListener('click', this.redirect.bind(this));
    },

    _ajax: function() {
      var request = new XMLHttpRequest(),
          that    = this;

      request.open('GET', that.settings.service , true);

      request.onerror = function() {
        window.location.href = that.settings.url2;
        console.log("An error occurred during the transaction");
      };

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          var response = request.response;

          if (response === "true") {
            window.location.href = that.settings.url1;
          } else if (response === "false") {
            window.location.href = that.settings.url2;
          } else {
            window.location.href = that.settings.url2;
            console.log("Error, response invalid");
          }
        }
      };

      request.send();
    },

    redirect: function(e) {
      e.preventDefault();

      if (this.settings.service === "") {
        console.log("service not found");
        window.location.href = this.settings.url2;

        return this;
      }

      this.el.classList.add('is-loading');

      this._ajax();

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

})(window, document, window.E || {});

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

/*
  iframe.js
  -----------

  Description:
  composant iframe

  HTML:
  "when" peut contenir : smallOnly, mediumOnly et large
  exemple :
  <div class="c-iframe__wrapper" data-e-iframe='{"when": ["smallOnly", "mediumOnly", "large"], "src": "homepage.html", "width": 900, "height": 400}'></div>

*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eIframe',
      attr       = 'data-e-iframe';

  var defaults   = {
    noTracking: false
  };

  function Plugin( el, options ) {
    this.item       = el;

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.iframe = null;

    this.isFluid = this.item.classList.contains('is-fluid');

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this
        .build()
        .events();
    },

    events: function() {
      var that = this;
      window.addEventListener('changed.ab-mediaquery', that.build.bind(that));

      return that;
    },

    build: function() {
      // Il y a une source ET le breakpoint est dans "when"
      if (this.settings.src && this.inBreakpoint()) {
        // seulement si l'iframe n'existe pas encore
        if (!this.iframe) {
          this.iframe = document.createElement('iframe');
          this.iframe.setAttribute('src', this.settings.src);
          this.iframe.setAttribute('frameborder', '0');
          this.iframe.setAttribute('allowfullscreen', '');
          this.iframe.setAttribute('allow', this.settings.allow);

          if (this.settings.noTracking)
            this.iframe.setAttribute('data-no-tracking', 'data-no-tracking');

          // si l'id est spécifié, l'ajoute
          if (this.settings.id) {
            this.iframe.setAttribute('id', this.settings.id);
          }

          if (this.isFluid)
            this.fluidify();

          this.item.appendChild(this.iframe);

          // [module carton] IFRAME resizer
          if (!this.isFluid) {
            window.iFrameResize({
              log: false,
              checkOrigin: false
            }, '.c-iframe__wrapper:not(.is-fluid) iframe');
          }

          // Trigger custom event to listen outside :
          var event = new CustomEvent('iFrameReady', {
            detail: {
              currentFrame: this.iframe
            }});
          document.dispatchEvent(event);
        }

        return this;
      }

      // sinon on détruit l'iframe
      this.iframe         = null;
      this.item.innerHTML = '';
      this.item.removeAttribute('style');

      return this;
    },

    inBreakpoint: function() {
      var current = AB.mediaQuery.current;

      for(var i = 0, len = current.length; i < len; i++) {
        if (this.settings.when.indexOf(current[i]) !== -1) return true;
      }

      return false;
    },

    fluidify: function() {
      // rendre l'iframe fluide
      this.item.style.height   = this.settings.height +'px';
      this.item.style.maxWidth = this.settings.width +'px';
      this.iframe.setAttribute('height', this.settings.height);
      this.iframe.setAttribute('width', this.settings.width);
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

/*
  Description:
  TooltipPoopers is a plugin for create and use infobull responsive
  https://popper.js.org/tooltip-examples.html
  
  HTML: 
  <element data-e-tooltipPopper: {reference, options}

  JS usage:
  Initialisation :
  E.plugins.eTooltipPopper(); // avec éventuellement des paramètres

  Appler une méthode de l'extérieur :
  $0.eTooltipPopper.launchInfobull();
*/


;(function($, window, document, E, undefined){

    'use strict';
  
    var pluginName = 'eTooltipPopper', 
        attr       = 'data-e-tooltipPopper', 
        defaults   = {
          position: 'top',
          text: ''
        }; // default options (always list ALL possible options here with default values)
  
    function Plugin(el, options) { 
      this.el = el;

      var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
  

      this.settings   = E.extend(true, defaults, options, dataOptions);

      this.init();
    }
  
    Plugin.prototype = {
      init: function() {
        this._createTooltip();
        //this.events();
        return this;
      },
  
      events: function() {
        // var that = this;
        
        this.el.addEventListener('mouseover', this.launchInfobull.bind(this));
  
        return this;
      },
  
      launchInfobull: function() {
        tooltip.show();
        return this;
      },

      _createTooltip: function() {
        new Tooltip(this.el, {
          title: this.settings.text,
          placement : this.settings.position
        });

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
  
/*
  Description:
  ...

  HTML:
  ...

  JS usage:
  Initialisation :
  E.plugins.eMyplugin(); // avec éventuellement des paramètres

  Appler une méthode de l'extérieur :
  $0.eMyplugin.callMe();
*/


;(function($, window, document, E, undefined){

    'use strict';
  
    var pluginName = 'eMaskCalc',
        attr       = 'data-e-maskCalc', 
        defaults   = {
          aString: '',
          aBolean: true
        };
  
    function Plugin(el, options) {
      this.el = el;
      this.nav = document.querySelector(".c-headerCelNav__wrapper");
      this.mask = this.el.querySelector(".c-headerCel__maskClose");
      var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
      this.settings   = E.extend(true, defaults, options, dataOptions);
      this.init();
    }
  
    Plugin.prototype = {
      init: function() {
        this.events();
        return this;
      },
  
      events: function() {
        var that = this;
        document.addEventListener('mouseover', this.calcule.bind(this));
  
        return this;
      },
  
      // Miscellaneous method
      calcule: function() {
        if (this.nav != null) {
          var NavHeight = this.nav.offsetHeight;
          var wrapperHeight = this.el.offsetHeight;
          this.mask.style.height = (wrapperHeight - NavHeight) +"px";
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
      // when we use ajax, init again the plugin
      E.updaters[pluginName] = function() {
        E.plugins[pluginName]();
      };
    });
  
  })(jQuery, window, document, window.E || {});
  
/*
headerLightCel.js
*/

;(function(window, document, E, undefined){

  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    var lastScrollPos   = 0,
        ticking         = false,
        header          = document.querySelector('[data-e-sticky-header]'),
        // bannerApp       = document.querySelector('[data-e-bannerapp]'),
        // isBannerVisible = false,
        hasTitle        = document.querySelector('.c-headerLightCel__title');


    if (!header || !hasTitle) return;

    // function manageBanner(scroll_pos) {
    //   var bannerAppHeight = bannerApp.offsetHeight;

    //   if (scroll_pos < bannerAppHeight) {
    //     isBannerVisible       = true;
    //     header.style.position = 'absolute';
    //     header.style.top      = bannerAppHeight + 'px';
    //     return;
    //   }

    //   isBannerVisible       = false;
    //   header.style.position = 'fixed';
    //   header.style.top      = 0;
    // }

    function changeHeader(scroll_pos) {
      // Solution pas vraiment parfaite...
      // if (document.documentElement.classList.contains('has-bannerApp') && bannerApp) {
      //   manageBanner(scroll_pos);
      // }

      // if (isBannerVisible) return;

      if (window.scrollY < scroll_pos) {
        if (header.classList.contains('is-small')) {
          header.classList.remove('is-small');
        }
        return;
      }

      if (!header.classList.contains('is-small') && window.scrollY > 0) {
        header.classList.add('is-small');
      }
    }

    if (AB.mediaQuery.is('smallOnly')) {
      window.addEventListener('scroll', function(e) {
        if (!ticking) {
          window.requestAnimationFrame(function() {
            changeHeader(lastScrollPos);
            ticking = false;
            lastScrollPos = window.scrollY;
          });
        }
        ticking = true;
      });
    }
  });

})(window, document, window.E || {});

/*
  Description:
  ...

  HTML:
  ...

  JS usage:
  Initialisation :
  E.plugins.eMyplugin(); // avec éventuellement des paramètres

  Appler une méthode de l'extérieur :
  $0.eMyplugin.callMe();
*/


;(function($, window, document, E, undefined){

  'use strict';

  var pluginName = 'eFocus',
      attr       = 'data-e-focus',
      defaults   = {
        aString: '',
        aBolean: true
      };

  // Our constructor
  function Plugin(el, options) {
    this.el = el;
    this.target = this.el.querySelector('.c-inputMat__field');

   
    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();
      return this;
    },

    events: function() {
      var that = this;
      window.addEventListener('DOMContentLoaded', this.getFocus.bind(this));

      return this;
    },
    getFocus: function() {
      window.console.log(this.target);
      this.target.focus();
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

/*
  Description:
  ...

  HTML:
  ...

  JS usage:
  Initialisation :
  E.plugins.eMyplugin(); // avec éventuellement des paramètres

  Appler une méthode de l'extérieur :
  $0.eMyplugin.callMe();
*/


;(function($, window, document, E, undefined){

  'use strict';

  var pluginName = 'eToggleText',
      attr       = 'data-e-toggleText', 
      defaults   = {
        aString: '',
        aBolean: true
      };

  // Our constructor
  function Plugin(el, options) { 
    this.el = el;
    this.target = document.querySelector(".c-toggleBox__btn");
    this.text = document.querySelector(".c-toggleBox__btn span");

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.init();
  }

  Plugin.prototype = {
    
    init: function() {
      this.events();
      return this;
    },

    events: function() {
      var that = this;

      this.target.addEventListener('click', this.toggleText.bind(this));

      return this;
    },

    toggleText: function() {
      if(this.target.classList.contains("is-active")) {
        this.text.innerHTML = "Fermer le détail de l'estimation";
      }

      else {
        this.text.innerHTML = "Ouvrir le détail de l'estimation";
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
    // when we use ajax, init again the plugin
    E.updaters[pluginName] = function() {
      E.plugins[pluginName]();
    };
  });

})(jQuery, window, document, window.E || {});

// data-e-foreign-target
// data-e-foreign-toggle


;(function($, window, document, E, undefined){
  'use strict';

  $(function() {
    var $foreign = $('[data-e-foreign-toggle]');

    if ( !$foreign.length ) return;

    var foreign = document.querySelector('[data-e-foreign-toggle]');

    function foreignToggle( namevalue, pattern1, pattern2, maxlength1, maxlength2  ){

      var $inputMat = $("input[id='"+ namevalue + "']"),
          attr = $inputMat.attr('pattern'),
          attr2 = 'pattern 2';

      if ( $inputMat.attr("pattern") === pattern1 ) {
        $inputMat.attr('pattern', pattern2)
                 .attr('maxlength',maxlength2);
      } else {
        $inputMat.attr('pattern', pattern1)
                 .attr('maxlength',maxlength1);
      }
    }

    $foreign.on("click", function(e) {
      var foreignValue = JSON.parse(this.getAttribute('data-e-foreign-toggle'));

      foreignToggle(
        foreignValue.id.name,
        foreignValue.id.pattern1,
        foreignValue.id.pattern2,
        foreignValue.id.maxlength1,
        foreignValue.id.maxlength2
      );
    });
  });
})(jQuery, window, document, window.E || {});