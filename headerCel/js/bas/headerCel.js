;(function ($, window, document, E, undefined) {

  'use strict';

  window.E = {
    version: '<% version %>', // remplacé via gulp-replace par le tag de version
    updaters: {}, // utilisé pour réinitialiser les plugin après réponse ajax
    plugins: {} // we store our plugins here
  };

  $(function() {
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
    abMediaQuery();

    if (E.debug) {
      // display current media queries
      console.log(AB.mediaQuery.current);
      window.addEventListener('changed.ab-mediaquery', function(){
        console.log(AB.mediaQuery.current);
      });
    }
  });

})(jQuery, window, document, window.E || {});

;(function (window, undefined) {

  'use strict';

  /*
    https://developer.mozilla.org/en/docs/Web/API/Element/matches
  */
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) { }
        return i > -1;
      };
  }


  /*
    https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String/startsWith
    La méthode startsWith() renvoie un booléen indiquant si la chaine de caractères commence par la deuxième chaine de caractères fournie en argument.
    str.endsWith(chaîneRecherchée[, position]);
  */
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
    };
  }


  /*
    https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String/endsWith
    La méthode endsWith() renvoie un booléen indiquant si la chaine de caractères se termine par la deuxième chaine de caractères fournie en argument.
    str.startsWith(chaîneRecherchée [, position]);
  * */
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.lastIndexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };
  }


  /*
  https://developer.mozilla.org/fr/docs/Web/API/CustomEvent
  Polyfill pour utiliser la fonctionnalité Constructor CustomEvent().
  */
  function CustomEvent(event, params) {
    params  = params || {bubbles: false, cancelable: false, detail: undefined};
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
   };
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;


  /*
  https://developer.mozilla.org/fr/docs/Web/API/Element/closest
  Polyfill pour element.closest()
  */
  if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest =
      function (s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i,
          el = this;
        do {
          i = matches.length;
          while (--i >= 0 && matches.item(i) !== el) { };
        } while ((i < 0) && (el = el.parentElement));
        return el;
      };
  }


  /*
  https://developer.mozilla.org/fr/docs/Web/API/ChildNode/remove
  Polyfill pour element.remove()
  */
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  /*
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes#Polyfill
  Polyfill pour string.prototype.includes
  */

  if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
      'use strict';
      if (typeof start !== 'number') {
        start = 0;
      }

      if (start + search.length > this.length) {
        return false;
      } else {
        return this.indexOf(search, start) !== -1;
      }
    };
  }

  /*
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  Polyfill pour array.prototype.includes
  */
  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function(searchElement, fromIndex) {

        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        // 1. Let O be ? ToObject(this value).
        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If len is 0, return false.
        if (len === 0) {
          return false;
        }

        // 4. Let n be ? ToInteger(fromIndex).
        //    (If fromIndex is undefined, this step produces the value 0.)
        var n = fromIndex | 0;

        // 5. If n ≥ 0, then
        //  a. Let k be n.
        // 6. Else n < 0,
        //  a. Let k be len + n.
        //  b. If k < 0, let k be 0.
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        function sameValueZero(x, y) {
          return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
        }

        // 7. Repeat, while k < len
        while (k < len) {
          // a. Let elementK be the result of ? Get(O, ! ToString(k)).
          // b. If SameValueZero(searchElement, elementK) is true, return true.
          if (sameValueZero(o[k], searchElement)) {
            return true;
          }
          // c. Increase k by 1.
          k++;
        }

        // 8. Return false
        return false;
      }
    });
  }

  /*
  Source: https://gist.github.com/k-gun/c2ea7c49edf7b757fe9561ba37cb19ca
  Polyfill pour classList
  */
  ;(function () {
    // helpers
    var regExp = function (name) {
      return new RegExp('(^| )' + name + '( |$)');
    };
    var forEach = function (list, fn, scope) {
      for (var i = 0; i < list.length; i++) {
        fn.call(scope, list[i]);
      }
    };

    // class list object with basic methods
    function ClassList(element) {
      this.element = element;
    }

    ClassList.prototype = {
      add: function () {
        forEach(arguments, function (name) {
          if (!this.contains(name)) {
            this.element.className += ' ' + name;
          }
        }, this);
      },
      remove: function () {
        forEach(arguments, function (name) {
          this.element.className =
            this.element.className.replace(regExp(name), '');
        }, this);
      },
      toggle: function (name) {
        return this.contains(name)
          ? (this.remove(name), false) : (this.add(name), true);
      },
      contains: function (name) {
        return regExp(name).test(this.element.className);
      },
      // bonus..
      replace: function (oldName, newName) {
        this.remove(oldName), this.add(newName);
      }
    };

    // IE8/9, Safari
    if (!('classList' in Element.prototype)) {
      Object.defineProperty(Element.prototype, 'classList', {
        get: function () {
          return new ClassList(this);
        }
      });
    }

    // replace() support for others
    if (window.DOMTokenList && DOMTokenList.prototype.replace == null) {
      DOMTokenList.prototype.replace = ClassList.prototype.replace;
    }
  })();

}(window));

;(function(name, definition) {
  if (typeof module !== 'undefined') module.exports = definition();
  else if (typeof define === 'function' && typeof define.amd === 'object') define(definition);
  else this[name] = definition();
}('abMediaQuery', function() {

  'use strict';

  // For IE 9 and 10 (https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)
  function customEventPolyfill(){
    if (typeof window.CustomEvent === 'function') return false;

    function CustomEvent(event, params) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  }
  customEventPolyfill();

  function extend(){
    for (var i = 1, len = arguments.length; i < len; i++) {
      if (!arguments[i]) continue;

      for (var key in arguments[i]) {
        if (!arguments[i].hasOwnProperty(key)) continue;
        arguments[0][key] = arguments[i][key];
      }
    }
    return arguments[0];
  }

  function isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  function startsWith(str, prefix) {
    return str.lastIndexOf(prefix, 0) === 0;
  }


  var MediaQuery = function(opt) {
    if (!(this instanceof MediaQuery)) return new MediaQuery(opt);

    this.settings = extend({}, MediaQuery.defaults, opt);
    this.queries  = {};
    this.current  = [];

    this.init();
  };

  MediaQuery.defaults = {
    bp: {
      small:    '48em',
      medium:   '64em',
      large:    '80em',
      huge:     '90em'
    },
    delay:      200
  };

  MediaQuery.prototype = {
    init: function() {
      this._defineQueries();
      this.current = this._getCurrentSize();
      this._watcher();

      return this;
    },

    _defineQueries: function() {
      // Create #AB-mediaQuery element to extract mediaQueries from generated font-family CSS rule
      var meta = document.createElement('meta');
      meta.id = 'AB-mediaQuery';
      document.getElementsByTagName('head')[0].appendChild(meta);

      var namedQueries = this._getQueries();

      // define other media queries
      for (var key in namedQueries) {
        if (!namedQueries.hasOwnProperty( key )) continue;

        switch (key) {
          case 'small':
            this.queries[key + 'Only'] = 'screen and (max-width: '+ (parseFloat(namedQueries.small)-0.01) +'em)';
            this.queries[key]          = 'screen and (min-width: '+ 0 +'em)';
            break;
          case 'medium':
            this.queries[key + 'Only'] = 'screen and (min-width: '+ namedQueries.small +') and (max-width: '+ namedQueries.medium +')';
            this.queries[key]          = 'screen and (min-width: '+ namedQueries.small +')';
            break;
          case 'large':
            this.queries[key + 'Only'] = 'screen and (min-width: '+ (parseFloat(namedQueries.medium)+0.01) +'em) and (max-width: '+ namedQueries.large +')';
            this.queries[key]          = 'screen and (min-width: '+ (parseFloat(namedQueries.medium)+0.01) +'em)';
            break;
          case 'huge':
            this.queries[key + 'Only'] = 'screen and (min-width: '+ (parseFloat(namedQueries.large)+0.01) +'em) and (max-width: '+ namedQueries.huge +')';
            this.queries[key]          = 'screen and (min-width: '+ (parseFloat(namedQueries.large)+0.01) +'em)';
            break;
        }

        // add custom user rules if any:
        if (startsWith(key, '*')) {
          this.queries[key.replace('*','')] = namedQueries[key];
        }
      }
    },

    _getCurrentSize: function() {
      var that = this,
          newMediaQueries = [];

      for (var key in that.queries) {
        if (!that.queries.hasOwnProperty( key )) continue;
        if (window.matchMedia(that.queries[key]).matches) newMediaQueries.push(key);
      }

      return newMediaQueries;
    },

    _getQueries: function() {
      var metaMD = document.getElementById('AB-mediaQuery'),
          fontMD = window.getComputedStyle(metaMD, null).getPropertyValue('font-family'),
          extractedStyles = decodeURI(fontMD.trim().slice(1, -1));

      return isJson(extractedStyles) ? JSON.parse(extractedStyles) : this.settings.bp;
    },

    get: function(size) {
      if (typeof size === 'undefined') return;
      return this.queries[size];
    },

    _watcher: function() {
      var that = this,
          event = new CustomEvent('changed.ab-mediaquery'),
          newSize, resizeTimer;

      window.onresize = function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          newSize = that._getCurrentSize();

          if (newSize.join('|') !== that.current.join('|')) {
            that.current = newSize;
            window.dispatchEvent(event);
          }
        }, that.settings.delay);
      };
    },

    is: function(size) {
      var query = this.get(size);
      if (query) return window.matchMedia(query).matches;
    }
  };

  function abMediaQuery(opt) {
    if (typeof window.AB === 'undefined') window.AB = {};
    window.AB.mediaQuery = new MediaQuery(opt);
  }

  return abMediaQuery;
}));

/*
  Description:
  -----------
  Keycodes (qui se souvient des keycodes ?)

  JS usage:
  --------
  $(document).on('keydown', function(e) {
    var keycode = e.which;
    if (E.keyNames[keycode] === 'escape') {
      // ...
    }
  });
*/

;(function(window, document, E, undefined){

  'use strict';

  E.keyNames = {
    help: {
      "E.keyNames[e.keycode]":
        "Facilite les vérification des touches pressées, exemple : if (E.keyNames[e.keyCode] === 'enter') { ... }"
    },
    40: 'down',
    38: 'up',
    37: 'left',
    39: 'right',
    9:  'tab',
    17: 'ctrl',
    13: 'enter',
    27: 'escape',
    32: 'space',
    33: 'prev',
    34: 'next',
    36: 'start',
    35: 'end',
    16: 'shift'
  };

})(window, document, window.E || {});
;(function(window, document, E, undefined) {
  'use strict';

  E.debounce = function(callback, delay) {
    var timer;

    return function() {
      var args    = arguments,
          context = this;

      window.clearTimeout(timer);
      timer = window.setTimeout(function() {
        callback.apply(context, args);
      }, delay);
    };
  };

})(window, document, window.E || {});
;(function(window, document, E, undefined) {
  'use strict';

  E.isJson = function(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

})(window, document, window.E || {});
;(function(window, document, E, undefined) {

  'use strict';

  /*
  E.extend.js
  */

  E.extend = function() {
    // Variables
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;

    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
      deep = arguments[0];
      i++;
    }

    // Merge the object into the extended object
    var merge = function (obj) {
      for ( var prop in obj ) {
        if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
          // If deep merge and property is an object, merge properties
          if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
            extended[prop] = E.extend( true, extended[prop], obj[prop] );
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };

    // Loop through each object and conduct a merge
    for ( ; i < length; i++ ) {
      var obj = arguments[i];
      merge(obj);
    }

    return extended;
  };

})(window, document, window.E || {});

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
