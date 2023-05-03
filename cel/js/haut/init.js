;(function (window, undefined) {

  'use strict';

  // Create E global object
  // Use it to store variables, functions, etc...
  if (!window.E) {
    window.E = {
      version: '1.0.2', // remplacé via gulp-replace par le tag de version
      updaters: {}, // utilisé pour réinitialiser les plugin après réponse ajax
      plugins: {} // on garde les fonctions d'appel des plugins (pour les évboquer après un appel Ajax par ex.)
    };
  }

  // Pour reinitialiser les plugins en cas d'update du DOM (AJAX...)
  E.launchUpdaters = function() {
    for (var key in E.updaters) {
      if (!E.updaters.hasOwnProperty(key)) continue;
      E.updaters[key]();
    }
  };

}(window));

// document.addEventListener('DOMContentLoaded', (event) => {
//   if(window.location.hash !== null && window.location.hash !== ""){
//     window.scrollBy(0,-20);
//     setTimeout(function(){     
//       var classListHeader = document.querySelector(".c-siteHeaderV2.l-wrapper--hugue.c-sticky").classList;
//       classListHeader.remove("c-sticky--fixed");
//       classListHeader.add("c-sticky--unstickyTop");   },100);
//   }
// });
/*!
 * JavaScript Cookie v2.1.3
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				return (document.cookie = [
					key, '=', value,
					attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					attributes.path ? '; path=' + attributes.path : '',
					attributes.domain ? '; domain=' + attributes.domain : '',
					attributes.secure ? '; secure' : ''
				].join(''));
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

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

;(function(window, document, E, undefined) {
  'use strict';

  E.ABtestHeaderHover2Click = function() {
    // Js pour AB-test burger desktop UNIQUEMENT
    // supprimer après AB-test

    var elements = document.querySelectorAll('[data-e-expand]');

    for (var i = 0, len = elements.length; i < len; i++) {
      elements[i].eExpand.hover2click();
    }

    $('.c-siteHeader').off('mouseleave.expand-body');

    $(document).on('click.expand-body', function(e) {
      var $target = $(e.target);

      if (!$target.closest('.c-siteHeader').length) {
        $('[data-e-expand]').each(function() {
          this.eExpand.close();
        });
      }
    });
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

/*
  Description:
  -----------
  Retourne la position (X et Y) d'un élément par rapport au document
*/

;(function (window, document, E, undefined) {
  'use strict';

  E.getCoords = function(el) { // crossbrowser version
    var box = el.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
  };

})(window, document, window.E || {});

/*
  Description:
  -----------
  Récupérer la valeur d'un paramètre dans l'URL

  JS usage:
  --------
  E.getUrlParameter('toto');
*/

;(function (window, document, E, undefined) {

  'use strict';

  E.getUrlParameter = function(paramName) {
    var paramsString = window.location.search.substring(1),
        paramList    = paramsString.split('&'),
        param        = [];

    for (var i = 0, len = paramList.length; i < len; i++) {
      param = paramList[i].split('=');

      if (param[0] === paramName) {
        return param[1];
      }
    }
  };

})(window, document, window.E || {});
/* jshint ignore:start */
/*! iFrame Resizer (iframeSizer.min.js ) - v2.6.1 - 2014-09-03
 *  Desc: Force cross domain iframes to size to content.
 *  Requires: iframeResizer.contentWindow.min.js to be loaded into the target frame.
 *  Copyright: (c) 2014 David J. Bradshaw - dave@bradshaw.net
 *  License: MIT
 */
!function(){
    "use strict";
    function a(a,b,c)
    {
        "addEventListener"in window?a.addEventListener(b,c,!1):"attachEvent"in window&&a.attachEvent("on"+b,c)
    }
    function b()
    {
        var a,b=["moz","webkit","o","ms"];
        for(a=0;a<b.length&&!w;a+=1)
            w=window[b[a]+"RequestAnimationFrame"];
        w||c(" RequestAnimationFrame not supported")
    }
    function c(a){
        y.log&&"object"==typeof console&&console.log(s+"[Host page"+u+"]"+a)
    }
    function d(a)
    {
        function b()
        {
            function a()
            {
                h(z),f(),y.resizedCallback(z)
            }
            i(a,z,"resetPage")
        }
        function d(a)
        {
            var b=a.id;
            c(" Removing iFrame: "+b),a.parentNode.removeChild(a),y.closedCallback(b),c(" --")
        }
        function e()
        {
            var a=x.substr(t).split(":");
            return{iframe:document.getElementById(a[0]),id:a[0],height:a[1],width:a[2],type:a[3]}
        }
        function j(a)
        {
            var b=Number(y["max"+a]),d=Number(y["min"+a]),e=a.toLowerCase(),f=Number(z[e]);
            if(d>b)
                throw new Error("Value for min"+a+" can not be greater than max"+a);
            c(" Checking "+e+" is in range "+d+"-"+b),d>f&&(f=d,c(" Set "+e+" to min value")),f>b&&(f=b,c(" Set "+e+" to max value")),z[e]=""+f
        }
        function k()
        {
            var b=a.origin,d=z.iframe.src.split("/").slice(0,3).join("/");
            if(y.checkOrigin&&(c(" Checking connection is from: "+d),""+b!="null"&&b!==d))
                throw new Error("Unexpected message received from: "+b+" for "+z.iframe.id+". Message was: "+a.data+". This error can be disabled by adding the checkOrigin: false option.");
            return!0
        }
        function l(){return s===(""+x).substr(0,t)}
        function m(){var a=z.type in{"true":1,"false":1};return a&&c(" Ignoring init message from meta parent page"),a}
        function n(){var a=x.substr(x.indexOf(":")+r+6);c(" MessageCallback passed: {iframe: "+z.iframe.id+", message: "+a+"}"),y.messageCallback({iframe:z.iframe,message:a}),c(" --")}
        function o(){if(null===z.iframe)throw new Error("iFrame ("+z.id+") does not exist on "+u);return!0}
        function q(){c(" Reposition requested from iFrame"),v={x:z.width,y:z.height},f()}
        function w()
        {
            switch(z.type)
            {
                case"close":d(z.iframe),y.resizedCallback(z);break;
                case"message":n();break;
                case"scrollTo":q();break;
                case"reset":g(z);break;
                case"init":b(),y.initCallback(z.iframe);break;
                default:b()
            }
        }
        var x=a.data,z={};
        l()&&(c(" Received: "+x),z=e(),j("Height"),j("Width"),!m()&&o()&&k()&&(w(),p=!1))
    }
    function e()
    {
        null===v&&(v={x:void 0!==window.pageXOffset?window.pageXOffset:document.documentElement.scrollLeft,y:void 0!==window.pageYOffset?window.pageYOffset:document.documentElement.scrollTop},c(" Get position: "+v.x+","+v.y))
    }
    function f()
    {
        null!==v&&(window.scrollTo(v.x,v.y),c(" Set position: "+v.x+","+v.y),v=null)
    }
    function g(a)
    {
        function b()
        {
            h(a),j("reset","reset",a.iframe)
        }
        c(" Size reset requested by "+("init"===a.type?"host page":"iFrame")),e(),i(b,a,"init")
    }
    function h(a){
        function b(b){
            a.iframe.style[b]=a[b]+"px",c(" IFrame ("+a.iframe.id+") "+b+" set to "+a[b]+"px")
        }
        y.sizeHeight&&b("height"),y.sizeWidth&&b("width")
    }
    function i(a,b,d){d!==b.type&&w?(c(" Requesting animation frame"),w(a)):a()}
    function j(a,b,d){c("["+a+"] Sending msg to iframe ("+b+")"),d.contentWindow.postMessage(s+b,"*")}
    function k(){
        function b(){
            function a(a){1/0!==y[a]&&0!==y[a]&&(k.style[a]=y[a]+"px",c(" Set "+a+" = "+y[a]+"px"))}
            a("maxHeight"),a("minHeight"),a("maxWidth"),a("minWidth")
        }
        function d(a){
            return""===a&&(k.id=a="iFrameResizer"+o++,c(" Added missing iframe ID: "+a+" ("+k.src+")")),a}
        function e(){c(" IFrame scrolling "+(y.scrolling?"enabled":"disabled")+" for "+l),k.style.overflow=!1===y.scrolling?"hidden":"auto",k.scrolling=!1===y.scrolling?"no":"yes"}
        function f(){("number"==typeof y.bodyMargin||"0"===y.bodyMargin)&&(y.bodyMarginV1=y.bodyMargin,y.bodyMargin=""+y.bodyMargin+"px")}
        function h(){return l+":"+y.bodyMarginV1+":"+y.sizeWidth+":"+y.log+":"+y.interval+":"+y.enablePublicMethods+":"+y.autoResize+":"+y.bodyMargin+":"+y.heightCalculationMethod+":"+y.bodyBackground+":"+y.bodyPadding+":"+y.tolerance}
        function i(b){
            a(k,"load",function(){var a=p;j("iFrame.onload",b,k),!a&&y.heightCalculationMethod in x&&g({iframe:k,height:0,width:0,type:"init"})}),j("init",b,k)
        }
        var k=this,l=d(k.id);e(),b(),f(),i(h())
    }
    function l(a){
        if("object"!=typeof a)throw new TypeError("Options is not an object.")
    }
    function m(){
        function a(a){if("IFRAME"!==a.tagName.toUpperCase())throw new TypeError("Expected <IFRAME> tag, found <"+a.tagName+">.");k.call(a)}
        function b(a){a=a||{},l(a);for(var b in z)z.hasOwnProperty(b)&&(y[b]=a.hasOwnProperty(b)?a[b]:z[b])}
        return function(c,d){
            b(c),Array.prototype.forEach.call(document.querySelectorAll(d||"iframe"),a)
        }
    }
    function n(a){
        a.fn.iFrameResize=function(b){
            return b=b||{},l(b),y=a.extend({},z,b),this.filter("iframe").each(k).end()
        }
    }
    var o=0,
        p=!0,
        q="message",
        r=q.length,
        s="[iFrameSizer]",
        t=s.length,
        u="",
        v=null,w=window.requestAnimationFrame,
        x={max:1,scroll:1,bodyScroll:1,documentElementScroll:1},
        y={},
        z={
            autoResize:!0,
            bodyBackground:null,
            bodyMargin:null,
            bodyMarginV1:8,
            bodyPadding:null,
            checkOrigin:!0,
            enablePublicMethods:!1,
            heightCalculationMethod:"offset",
            interval:32,
            log:!1,
            maxHeight:1/0,
            maxWidth:1/0,
            minHeight:0,
            minWidth:0,
            scrolling:!1,
            sizeHeight:!0,
            sizeWidth:!1,
            tolerance:0,
            closedCallback:function(){},
            initCallback:function(){},
            messageCallback:function(){},
            resizedCallback:function(){}
        };
    b(),
        a(window,"message",d),
    "jQuery"in window&&n(jQuery),
        "function"==typeof define&&define.amd?define(function()
        {
            return m()
        }):window.iFrameResize=m()
}();
/* jshint ignore:end */

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
/*
  Description:
  -----------

*/

;(function (window, document, E, undefined) {
    'use strict';
  
    E.navigator = {};
    E.navigator.isFirefox = function () {
        //setting
        var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
            match = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./),
            ver = match ? parseInt(match[1]) : 0;
  
      // si le navigateur firefox très vieux il retourne un true
        if (isFirefox && (ver < 45)) {
            return true;
        }
        else
          return false;
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
  Description:
  -----------

*/

;(function (window, document, E, undefined) {
  'use strict';

  E.scrollTo = function(options) {
    // settings
    var next     = options.next,
        source   = options.source || false,
        center   = options.center || false,
        offset   = options.offset || 0,
        duration = options.duration || 600;

    var wrapper,
        currentPosition = 0,
        nextPosition    = 0,
        diffPosition    = 0,
        startTime       = null,
        currentTime     = 0,
        nextHeight      = next.offsetHeight,
        windowHeight    = window.innerHeight,
        bodyScrollTo    = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    // fonction de déplacement
    function move(val) {
      if (wrapper) {
        wrapper.scrollTop = val;
      } else {
        window.scrollTo(0, val);
      }
    }

    // fonction de easing
    function easeInOutQuad(t, b, c, d) {
      t /= d/2;
      if (t < 1) { return c/2*t*t + b; }
      t--;
      return -c/2 * (t*(t-2) - 1) + b;
    }

    // calcul animation avec requestAnimationFrame
    function animateScroll(time) {
      if (time === undefined) time = new Date().getTime();
      if (startTime === null) startTime = time;

      currentTime = time - startTime;

      // on scroll...
      var val = easeInOutQuad(currentTime, currentPosition, diffPosition, duration);
      move(val);

      // on continue jusqu'à la fin...
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    }

    // reset valeurs nécessaires
    if (source) {
      wrapper         = source.closest('.c-fullModal'); // la modale de l'application ("estimation")
      currentPosition = wrapper ? wrapper.scrollTop : bodyScrollTo;
      nextPosition    = source.offsetTop + source.offsetHeight;

      // si l'étape est plus petite que la fenêtre, on centre
      if (nextHeight < windowHeight) {
        if (center) {
          nextPosition = nextPosition - offset / 2 - (windowHeight - nextHeight) / 2;
        }
      // sinon on calle en haut de l'écran
      } else {
        nextPosition = wrapper ? nextPosition - offset : nextPosition;
      }

    } else {
      currentPosition = bodyScrollTo;
      nextPosition = E.getCoords(next).top - offset;
    }

    // bloquer scroll à la souris (bug sous Chrome)
    function blockMouseWheel(e) {
      if (currentTime <= duration) e.preventDefault();
    }

    document.addEventListener('mousewheel', blockMouseWheel);

    // on a besoin de la différence
    diffPosition = nextPosition - currentPosition;

    requestAnimationFrame(animateScroll);
  };

})(window, document, window.E || {});

/*
  serializeForm.js

  Description:
  Retourne une sérialisation de tous les éléments valides d'un formulaire et leurs valeurs.

  E.serializeForm(formNode)
  "formNode" étant un formulaire
*/

;(function(window, document, E, undefined) {
  'use strict';

  function isRadioCheckbox(el) {
    return el.getAttribute('type') === 'checkbox' || el.getAttribute('type') === 'radio';
  }

  E.serializeForm = function(formNode) {
    var items = [],
        value = null,
        el    = null,
        obj   = {},
        formElsNode = formNode.elements;

    for (var i = 0, len = formElsNode.length; i < len; i++) {
      el = formElsNode[i];
      obj = {};

      if (isRadioCheckbox(el) && !el.checked)
        continue;

      if (el.type === 'fieldset')
        continue;

      if (el.closest('fieldset') && el.closest('fieldset').disabled)
        continue;

      if (el.name && el.value && (el.willValidate || el.type === "hidden")) {
        obj[encodeURIComponent(el.name)] = encodeURIComponent(el.value);
        items.push(obj);
      }
    }

    // var items = [],
    //     formData = (new FormData(formNode)).entries();
    // for (var pair of formData) {
    //   if (!pair[1])
    //     continue;
    //   var obj = {};
    //   obj[pair[0]] = pair[1];
    //   items.push(obj);
    // }

    return items;
  };

})(window, document, window.E || {});

;(function(window, document, E, undefined){

  /*
  Methods to get, set, remove storage (local/session).
  Cookies is used as fallback.

  LocalStorage will behave like cookie:

  - if localStorage is available:
    - if date: use localStorage
    - else: use sessionStorage

  - else localStorage is unvailable: cookie (through js-cookie: https://github.com/js-cookie/js-cookie)

  Storage with '-date' suffix is to mimic cookie expire.
  */

  'use strict';

  // js-cookie respecte le norme RFC 6265, https://github.com/js-cookie/js-cookie#encoding, mais pas JBoss :-(
  E.Cookies = window.Cookies.withConverter({
    read: function (value, name) {
      return decodeURIComponent(value);
    },
    write: function (value, name) {
      return encodeURIComponent(value);
    }
  });

  E.storage = (function () {
    var hasLocalStorage = window.Modernizr.localstorage;

    var help = {
      "E.storage.setItem(STRING, STRING[, NUMBER])":
        "Créer un storage, [NUMBER] est l'expiration en jours (si en heure: h/24). Si pas de [NUMBER], ce sera sessionStorage",

      "E.storage.getItem(STRING)":
        "Lire un storage",

      "E.storage.removeItem(STRING|ARRAY)":
        "Effacer un storage ou un array de storages",

      "E.storage.getItemsStartsWith(STRING)":
        "return un array de storages commençant par STRING"
    };

    /**
     * Get item and return its value || null
     * E.storage.getItem('toto');
     *
     * @param  {string} key
     */
    function getItem(key) {
      var data;

      if (E.debug) console.log('getItem', key);

      if (hasLocalStorage) {
        if (localStorage.getItem(key + '-date')) {
          data = window.localStorage.getItem(key);
        } else {
          data = window.sessionStorage.getItem(key);

          // si pas de seessionStorage && pas de date,
          // c'est peut être un localStorage normal ?
          if (!data)
            data = window.localStorage.getItem(key);
        }

      } else {
        // patch avant refonte TEL
        if (key.startsWith('VENTE-')) {
          data = E.Cookies.get(key.slice("VENTE-".length));
        } else {
          data = E.Cookies.get(key);
        }
      }

      return data ? data : null;
    }


    /**
     * Set item with optional expiration
     * if date expiration is set
     *    > remove session storage, overrid storage with same key that has date
     *    > create two localstorage, one with value, one with date expiration
     * if date is not set
     *    >  remove local storage, overrid storage with same key that has not date
     *    >  create session storage
     *
     * E.storage.setItem('toto', 'string' [, 10]);
     *
     * @param  {string} key
     * @param  {string} value
     * @param  {number} date
     */
    function setItem(key, value, date) {
      if (!key) return false;

      if (E.debug) console.log('setItem: ', key, value, date);

      if (hasLocalStorage) {
        if (date) {
          window.sessionStorage.removeItem(key);

          window.localStorage.setItem(key, value);
          window.localStorage.setItem(key+'-date', _calcDateExpires(date));
        } else {
          window.localStorage.removeItem(key);
          window.localStorage.removeItem(key + '-date');

          window.sessionStorage.setItem(key, value);
        }

      } else {
        // patch avant refonte TEL
        if (key.startsWith('VENTE-')) {
          E.Cookies.set(key.slice("VENTE-".length), value, { expires: date });
        } else {
          E.Cookies.set(key, value, { expires: date });
        }
      }
    }

    /**
     * remove item(s)
     * E.storage.removeItem('toto');
     * E.storage.removeItem(['toto', 'blabla']);
     *
     * @param  {string|Array} key - can be an item or an array of items
     */
    function removeItem(key) {
      if (E.debug) console.log('removeItem', key);

      if (Array.isArray(key)) {
        for (var i = 0, len = key.length; i < len; i++) {
          var item = key[i];
          window.localStorage.removeItem(item);
          window.localStorage.removeItem(item + '-date');
          window.sessionStorage.removeItem(item);
          E.Cookies.remove(item);

          // patch avant refonte TEL
          E.Cookies.remove(item.slice("VENTE-".length));
        }

      } else {
        window.localStorage.removeItem(key);
        window.localStorage.removeItem(key + '-date');
        window.sessionStorage.removeItem(key);
        E.Cookies.remove(key);

        // patch avant refonte TEL
        E.Cookies.remove(key.slice("VENTE-".length));
      }
    }

    /**
     * calculate date expiration (https://github.com/js-cookie/js-cookie/blob/master/src/js.cookie.js lines 53 + 79)
     * return string or empty string ''
     *
     * @param  {number} date
     */
    function _calcDateExpires(date) {
      var d = date;
      if (typeof date === 'number') {
        var expires = new Date();
        expires.setMilliseconds(expires.getMilliseconds() + d * 864e+5);
        d = expires;
      }

      return d ? d.toUTCString() : '';
    }

    /**
     * get items that start with 'keyword', get local AND session storage with fallback cookie, push item in storageArray
     * return array or empty array
     *
     * @param  {string} keyword
     */
    function getItemsStartsWith(keyword) {
      var storageArray = [],
          keysLocal, keysSession, keysCookie,
          i, len, key;

      if (hasLocalStorage) {
        keysLocal   = Object.keys(localStorage);
        keysSession = Object.keys(sessionStorage);

        for (i = 0, len = keysLocal.length; i < len; i++) {
          key = keysLocal[i];

          // if key begins with keyword
          if (key.startsWith(keyword)) storageArray.push(key);
        }

        for (i = 0, len = keysSession.length; i < len; i++) {
          key = keysSession[i];

          // if key begins with keyword
          if (key.startsWith(keyword)) storageArray.push(key);
        }

      } else {
        keysCookie = Object.keys(E.Cookies.get());

        for (i = 0, len = keysCookie.length; i < len; i++) {
          key = keysCookie[i];

          // if key begins with keyword
          if (key.startsWith(keyword)) storageArray.push(key);
        }

      }

      return storageArray;
    }

    return {
      help:       help,
      getItem:    getItem,
      setItem:    setItem,
      removeItem: removeItem,
      getItemsStartsWith: getItemsStartsWith
    };

  })();


  document.addEventListener('DOMContentLoaded', function() {
    // simulate cookie expiration: localStorage only
    if (window.Modernizr.localstorage) {
      var keys = Object.keys(window.localStorage);

      for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i];

        // if key has a date expiration, compare with today and remove local storage
        if (key.endsWith('-date')) {
          var localStorageDate = Date.parse(window.localStorage.getItem(key)),
              today            = new Date(),
              storage          = key.split('-date')[0];

          /* Pour faire des tests en local
            var nextMonth = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 30);
            today = nextMonth;
            */

          // verify if localStorageDate actually return a date value
          if (localStorageDate && today > localStorageDate) {
            // Effacer tous les localStorage VENTE (exception du comportement normal)
            if (key === 'VENTE-storageDate-date') {
              E.storage.removeItem(E.storage.getItemsStartsWith('VENTE-'));
            }

            window.localStorage.removeItem(storage);
            window.localStorage.removeItem(key);
          }

          // remove useless item with date
          if (window.localStorage.getItem(storage) === null) {
            window.localStorage.removeItem(key);
          }
        }
      }
    }
  });

})(window, document, window.E || {});

/*
  Description:
  -----------
  Mini template engine
  Tutoriel: http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
  Version plus récente: https://github.com/krasimir/absurd/blob/master/lib/processors/html/helpers/TemplateEngine.js

  HTML:
  ----
  JS supporté (possible d'étendre) :
  var | if | for | else | switch | case | break

  <script data-tpl="voteEspritService" type="text/template">
    <div>[% this.truc %]</div>
    [% if (this.machin) { %]
      <div>...</div>
    [% } %]
  </script>

  JS usage:
  --------
  var templateX = document.querySelector('[data-tpl="templateX"]').innerHTML,
      data = {
        truc: 'xxx',
        machin: true
      };

  E.templateEngine(templateX, data); // data est un objet
*/

;(function (window, document, E, undefined) {

  /* jshint ignore:start */
  // ignorer du linting à cause du new Function indispensable ici!

  E.templateEngine = function(html, options) {
    var re     = /\[%(.+?)%\]/g,
        reExp  = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
        code   = 'with(obj) { var r=[];\n',
        cursor = 0,
        result,
        match;

    var add = function(line, js) {
      js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
        (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
      return add;
    };

    while (match = re.exec(html)) {
      add(html.slice(cursor, match.index))(match[1], true);
      cursor = match.index + match[0].length;
    }

    add(html.substr(cursor, html.length - cursor));
    code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, ' ');

    try {
      result = new Function('obj', code).apply(options, [options]);
    } catch(err) {
      console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n");
    }

    return result;
  };

  /* jshint ignore:end */

})(window, document, window.E || {});
;(function ($, window, document, E, undefined) {

  'use strict';

  /**
  * WaitAjax(callback, options)
  * Class that permits launching a callback when all ajax requests are completed
  *
  * callback (function)    => function to be launched
  * callback (json object)   => options
  */
  window.WaitAjax = function (callback, options) {
    this.timeout = options.timeout || 750;
    this.logger = options.logger || "error";
    this.callback = callback || function () { return false; };
    this.ajaxArray = [];
    this.timers = [];
    this.ended = false;
  };

  /**
  * logEvent(text, level)
  * public method to log events to the console
  *
  * level (string)   => message level
  * level (string)   => message level
  */
  window.WaitAjax.prototype.logEvent = function (text, level) {
    if (level === "error" && (this.logger === "info" || this.logger === "alert" || this.logger === "error")) {
      console.log(
        '%c [WaitAjax][ERR]', 'color: red',
        new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString() + ':' + new Date().getUTCMilliseconds() + ' : ' + text
      );
    } else if (level === "alert" && (this.logger === "info" || this.logger === "alert")) {
      console.log(
        '%c [WaitAjax][ALT]', 'color: orange',
        new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString() + ':' + new Date().getUTCMilliseconds() + ' : ' + text
      );
    } else if (level === "info" && this.logger === "info") {
      console.log(
        '%c [WaitAjax][INF]', 'color: green',
        new Date().toLocaleDateString() + '-' + new Date().toLocaleTimeString() + ':' + new Date().getUTCMilliseconds() + ' : ' + text
      );
    }
  };

  /**
  * bindAjaxEvents(that)
  * public method that binds ajax events
  */
  window.WaitAjax.prototype.bindAjaxEvents = function () {
    var that = this;

    // Bind AJAX SENT (custom event)
    $(document).on("ajaxSent", function () {
      if (that.timers.length > 0) {
        that.logEvent("Cleared " + that.timers + " timer(s)", "alert");
      }

      // Clear timeouts
      $.each(that.timers, function (iTimer, timer) {
        clearTimeout(timer);
      });

      // Empty timers
      that.timers.length = 0;
    });

    // Bind AJAX SEND
    $(document).on("ajaxSend", function (event, jqxhr, settings) {
      var urlReq = settings.url;

      that.logEvent("requête ajax envoyée : " + urlReq, "info");

      that.ajaxArray.push(urlReq);

      $(document).trigger("ajaxSent");
    });

    // Bind AJAX COMPLETE
    $(document).on("ajaxComplete", function (event, jqxhr, settings) {
      var urlReq = settings.url,
        i = that.ajaxArray.indexOf(urlReq);

      that.logEvent("requête ajax reçue : " + urlReq, "info");

      if (i > -1) {
        that.ajaxArray.splice(i, 1);
      }

      // request queue == 0
      if (that.ajaxArray.length === 0) {
        that.logEvent("Timer ajouté : " + (that.timers.length + 1) + " timer(s)", "alert");
        that.logEvent("Plus de requêtes en queue. WAIT " + that.timeout + "ms", "alert");

        that.timers.push(
          setTimeout(function () {
            if (!that.ended) {
              that.logEvent("FIN REQUETES", "info");
              that.logEvent("EXECUTION callback", "info");

              that.ended = true;
              that.callback();
            } else {
              that.logEvent("Already fired callback", "alert");
            }
          }, that.timeout)
        );
      }
    });
  };

})(jQuery, window, document, window.E || {});