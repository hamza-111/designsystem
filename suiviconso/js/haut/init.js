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

/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.15.0
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Popper = factory());
}(this, (function () { 'use strict';

var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
var timeoutDuration = 0;
for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
  if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
    timeoutDuration = 1;
    break;
  }
}

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    window.Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var window = element.ownerDocument.defaultView;
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);

/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */
function isIE(version) {
  if (version === 11) {
    return isIE11;
  }
  if (version === 10) {
    return isIE10;
  }
  return isIE11 || isIE10;
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }

  var noOffsetParent = isIE(10) ? document.body : null;

  // NOTE: 1 DOM access here
  var offsetParent = element.offsetParent || null;
  // Skip hidden elements which don't have an offsetParent
  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }

  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  }

  // .offsetParent will return the closest TH, TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return parseFloat(styles['border' + sideA + 'Width'], 10) + parseFloat(styles['border' + sideB + 'Width'], 10);
}

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
}

function getWindowSizes(document) {
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE(10) && getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  try {
    if (isIE(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e) {}

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
  var width = sizes.width || element.clientWidth || result.right - result.left;
  var height = sizes.height || element.clientHeight || result.bottom - result.top;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var isIE10 = isIE(10);
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth, 10);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth, 10);

  // In cases where the parent is fixed, we must ignore negative scroll in offset calc
  if (fixedPosition && isHTML) {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }
  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = parseFloat(styles.marginTop, 10);
    var marginLeft = parseFloat(styles.marginLeft, 10);

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  var parentNode = getParentNode(element);
  if (!parentNode) {
    return false;
  }
  return isFixed(parentNode);
}

/**
 * Finds the first parent of an element that has a transformed property defined
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} first transformed parent or documentElement
 */

function getFixedPositionOffsetParent(element) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element || !element.parentElement || isIE()) {
    return document.documentElement;
  }
  var el = element.parentElement;
  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
    el = el.parentElement;
  }
  return el || document.documentElement;
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @param {Boolean} fixedPosition - Is in fixed position mode
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  // NOTE: 1 DOM access here

  var boundaries = { top: 0, left: 0 };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(popper.ownerDocument),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  padding = padding || 0;
  var isPaddingNumber = typeof padding === 'number';
  boundaries.left += isPaddingNumber ? padding : padding.left || 0;
  boundaries.top += isPaddingNumber ? padding : padding.top || 0;
  boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
  boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @param {Element} fixedPosition - is in fixed position mode
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var window = element.ownerDocument.defaultView;
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
  var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  data.positionFixed = this.options.positionFixed;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroys the popper.
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style.left = '';
    this.popper.style.right = '';
    this.popper.style.bottom = '';
    this.popper.style.willChange = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicity asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger `onUpdate` callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Boolean} shouldRound - If the offsets should be rounded at all
 * @returns {Object} The popper's position offsets rounded
 *
 * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
 * good as it can be within reason.
 * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
 *
 * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
 * as well on High DPI screens).
 *
 * Firefox prefers no rounding for positioning and does not have blurriness on
 * high DPI screens.
 *
 * Only horizontal placement and left/right values need to be considered.
 */
function getRoundedOffsets(data, shouldRound) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var round = Math.round,
      floor = Math.floor;

  var noRound = function noRound(v) {
    return v;
  };

  var referenceWidth = round(reference.width);
  var popperWidth = round(popper.width);

  var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
  var isVariation = data.placement.indexOf('-') !== -1;
  var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
  var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;

  var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
  var verticalToInteger = !shouldRound ? noRound : round;

  return {
    left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
    top: verticalToInteger(popper.top),
    bottom: verticalToInteger(popper.bottom),
    right: horizontalToInteger(popper.right)
  };
}

var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
    // and not the bottom of the html element
    if (offsetParent.nodeName === 'HTML') {
      top = -offsetParent.clientHeight + offsets.bottom;
    } else {
      top = -offsetParentRect.height + offsets.bottom;
    }
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    if (offsetParent.nodeName === 'HTML') {
      left = -offsetParent.clientWidth + offsets.right;
    } else {
      left = -offsetParentRect.width + offsets.right;
    }
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  var _data$offsets$arrow;

  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjunction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data.offsets.popper = getClientRect(data.offsets.popper);

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized], 10);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width'], 10);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-end` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;

    // flips variation if reference element overflows boundaries
    var flippedVariationByRef = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    // flips variation if popper content overflows boundaries
    var flippedVariationByContent = !!options.flipVariationsByContent && (isVertical && variation === 'start' && overflowsRight || isVertical && variation === 'end' && overflowsLeft || !isVertical && variation === 'start' && overflowsBottom || !isVertical && variation === 'end' && overflowsTop);

    var flippedVariation = flippedVariationByRef || flippedVariationByContent;

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  // NOTE: DOM access here
  // resets the popper's position so that the document size can be calculated excluding
  // the size of the popper element itself
  var transformProp = getSupportedPropertyName('transform');
  var popperStyles = data.instance.popper.style; // assignment to help minification
  var top = popperStyles.top,
      left = popperStyles.left,
      transform = popperStyles[transformProp];

  popperStyles.top = '';
  popperStyles.left = '';
  popperStyles[transformProp] = '';

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

  // NOTE: DOM access here
  // restores the original style properties after the offsets have been computed
  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;

  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unit-less, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the `height`.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * A scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper. This makes sure the popper always has a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier. Can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near each other
   * without leaving any gap between the two. Especially useful when the arrow is
   * enabled and you want to ensure that it points to its reference element.
   * It cares only about the first axis. You can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjunction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations)
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position.
     * The popper will never be placed outside of the defined boundaries
     * (except if `keepTogether` is enabled)
     */
    boundariesElement: 'viewport',
    /**
     * @prop {Boolean} flipVariations=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the reference element overlaps its boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariations: false,
    /**
     * @prop {Boolean} flipVariationsByContent=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the popper element overlaps its reference boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariationsByContent: false
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define your own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the information used by Popper.js.
 * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overridden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass an object with the same
 * structure of the `options` object, as the 3rd argument. For example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults = {
  /**
   * Popper's placement.
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,

  /**
   * Whether events (resize, scroll) are initially enabled.
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated. This callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js.
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper = function () {
  /**
   * Creates a new Popper.js instance.
   * @class Popper
   * @param {Element|referenceObject} reference - The reference element used to position the popper
   * @param {Element} popper - The HTML / XML element used as the popper
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10.
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;

return Popper;

})));
//# sourceMappingURL=popper.js.map

/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.3.2
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('popper.js')) :
	typeof define === 'function' && define.amd ? define(['popper.js'], factory) :
	(global.Tooltip = factory(global.Popper));
}(this, (function (Popper) { 'use strict';

Popper = Popper && Popper.hasOwnProperty('default') ? Popper['default'] : Popper;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var DEFAULT_OPTIONS = {
  container: false,
  delay: 0,
  html: false,
  placement: 'top',
  title: '',
  template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
  trigger: 'hover focus',
  offset: 0,
  arrowSelector: '.tooltip-arrow, .tooltip__arrow',
  innerSelector: '.tooltip-inner, .tooltip__inner'
};

var Tooltip = function () {
  /**
   * Create a new Tooltip.js instance
   * @class Tooltip
   * @param {HTMLElement} reference - The DOM node used as reference of the tooltip (it can be a jQuery element).
   * @param {Object} options
   * @param {String} options.placement='top'
   *      Placement of the popper accepted values: `top(-start, -end), right(-start, -end), bottom(-start, -end),
   *      left(-start, -end)`
   * @param {String} options.arrowSelector='.tooltip-arrow, .tooltip__arrow' - className used to locate the DOM arrow element in the tooltip.
   * @param {String} options.innerSelector='.tooltip-inner, .tooltip__inner' - className used to locate the DOM inner element in the tooltip.
   * @param {HTMLElement|String|false} options.container=false - Append the tooltip to a specific element.
   * @param {Number|Object} options.delay=0
   *      Delay showing and hiding the tooltip (ms) - does not apply to manual trigger type.
   *      If a number is supplied, delay is applied to both hide/show.
   *      Object structure is: `{ show: 500, hide: 100 }`
   * @param {Boolean} options.html=false - Insert HTML into the tooltip. If false, the content will inserted with `textContent`.
   * @param {String} [options.template='<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>']
   *      Base HTML to used when creating the tooltip.
   *      The tooltip's `title` will be injected into the `.tooltip-inner` or `.tooltip__inner`.
   *      `.tooltip-arrow` or `.tooltip__arrow` will become the tooltip's arrow.
   *      The outermost wrapper element should have the `.tooltip` class.
   * @param {String|HTMLElement|TitleFunction} options.title='' - Default title value if `title` attribute isn't present.
   * @param {String} [options.trigger='hover focus']
   *      How tooltip is triggered - click, hover, focus, manual.
   *      You may pass multiple triggers; separate them with a space. `manual` cannot be combined with any other trigger.
   * @param {Boolean} options.closeOnClickOutside=false - Close a popper on click outside of the popper and reference element. This has effect only when options.trigger is 'click'.
   * @param {String|HTMLElement} options.boundariesElement
   *      The element used as boundaries for the tooltip. For more information refer to Popper.js'
   *      [boundariesElement docs](https://popper.js.org/popper-documentation.html)
   * @param {Number|String} options.offset=0 - Offset of the tooltip relative to its reference. For more information refer to Popper.js'
   *      [offset docs](https://popper.js.org/popper-documentation.html)
   * @param {Object} options.popperOptions={} - Popper options, will be passed directly to popper instance. For more information refer to Popper.js'
   *      [options docs](https://popper.js.org/popper-documentation.html)
   * @return {Object} instance - The generated tooltip instance
   */
  function Tooltip(reference, options) {
    classCallCheck(this, Tooltip);

    _initialiseProps.call(this);

    // apply user options over default ones
    options = _extends({}, DEFAULT_OPTIONS, options);

    reference.jquery && (reference = reference[0]);

    // cache reference and options
    this.reference = reference;
    this.options = options;

    // get events list
    var events = typeof options.trigger === 'string' ? options.trigger.split(' ').filter(function (trigger) {
      return ['click', 'hover', 'focus'].indexOf(trigger) !== -1;
    }) : [];

    // set initial state
    this._isOpen = false;
    this._popperOptions = {};

    // set event listeners
    this._setEventListeners(reference, events, options);
  }

  //
  // Public methods
  //

  /**
   * Reveals an element's tooltip. This is considered a "manual" triggering of the tooltip.
   * Tooltips with zero-length titles are never displayed.
   * @method Tooltip#show
   * @memberof Tooltip
   */


  /**
   * Hides an element’s tooltip. This is considered a “manual” triggering of the tooltip.
   * @method Tooltip#hide
   * @memberof Tooltip
   */


  /**
   * Hides and destroys an element’s tooltip.
   * @method Tooltip#dispose
   * @memberof Tooltip
   */


  /**
   * Toggles an element’s tooltip. This is considered a “manual” triggering of the tooltip.
   * @method Tooltip#toggle
   * @memberof Tooltip
   */


  /**
   * Updates the tooltip's title content
   * @method Tooltip#updateTitleContent
   * @memberof Tooltip
   * @param {String|HTMLElement} title - The new content to use for the title
   */


  //
  // Private methods
  //

  createClass(Tooltip, [{
    key: '_create',


    /**
     * Creates a new tooltip node
     * @memberof Tooltip
     * @private
     * @param {HTMLElement} reference
     * @param {String} template
     * @param {String|HTMLElement|TitleFunction} title
     * @param {Boolean} allowHtml
     * @return {HTMLElement} tooltipNode
     */
    value: function _create(reference, template, title, allowHtml) {
      // create tooltip element
      var tooltipGenerator = window.document.createElement('div');
      tooltipGenerator.innerHTML = template.trim();
      var tooltipNode = tooltipGenerator.childNodes[0];

      // add unique ID to our tooltip (needed for accessibility reasons)
      tooltipNode.id = 'tooltip_' + Math.random().toString(36).substr(2, 10);

      // set initial `aria-hidden` state to `false` (it's visible!)
      tooltipNode.setAttribute('aria-hidden', 'false');

      // add title to tooltip
      var titleNode = tooltipGenerator.querySelector(this.options.innerSelector);
      this._addTitleContent(reference, title, allowHtml, titleNode);

      // return the generated tooltip node
      return tooltipNode;
    }
  }, {
    key: '_addTitleContent',
    value: function _addTitleContent(reference, title, allowHtml, titleNode) {
      if (title.nodeType === 1 || title.nodeType === 11) {
        // if title is a element node or document fragment, append it only if allowHtml is true
        allowHtml && titleNode.appendChild(title);
      } else if (isFunction(title)) {
        // if title is a function, call it and set textContent or innerHtml depending by `allowHtml` value
        var titleText = title.call(reference);
        allowHtml ? titleNode.innerHTML = titleText : titleNode.textContent = titleText;
      } else {
        // if it's just a simple text, set textContent or innerHtml depending by `allowHtml` value
        allowHtml ? titleNode.innerHTML = title : titleNode.textContent = title;
      }
    }
  }, {
    key: '_show',
    value: function _show(reference, options) {
      // don't show if it's already visible
      // or if it's not being showed
      if (this._isOpen && !this._isOpening) {
        return this;
      }
      this._isOpen = true;

      // if the tooltipNode already exists, just show it
      if (this._tooltipNode) {
        this._tooltipNode.style.visibility = 'visible';
        this._tooltipNode.setAttribute('aria-hidden', 'false');
        this.popperInstance.update();
        return this;
      }

      // get title
      var title = reference.getAttribute('title') || options.title;

      // don't show tooltip if no title is defined
      if (!title) {
        return this;
      }

      // create tooltip node
      var tooltipNode = this._create(reference, options.template, title, options.html);

      // Add `aria-describedby` to our reference element for accessibility reasons
      reference.setAttribute('aria-describedby', tooltipNode.id);

      // append tooltip to container
      var container = this._findContainer(options.container, reference);

      this._append(tooltipNode, container);

      this._popperOptions = _extends({}, options.popperOptions, {
        placement: options.placement
      });

      this._popperOptions.modifiers = _extends({}, this._popperOptions.modifiers, {
        arrow: _extends({}, this._popperOptions.modifiers && this._popperOptions.modifiers.arrow, {
          element: options.arrowSelector
        }),
        offset: _extends({}, this._popperOptions.modifiers && this._popperOptions.modifiers.offset, {
          offset: options.offset
        })
      });

      if (options.boundariesElement) {
        this._popperOptions.modifiers.preventOverflow = {
          boundariesElement: options.boundariesElement
        };
      }

      this.popperInstance = new Popper(reference, tooltipNode, this._popperOptions);

      this._tooltipNode = tooltipNode;

      return this;
    }
  }, {
    key: '_hide',
    value: function _hide() /*reference, options*/{
      // don't hide if it's already hidden
      if (!this._isOpen) {
        return this;
      }

      this._isOpen = false;

      // hide tooltipNode
      this._tooltipNode.style.visibility = 'hidden';
      this._tooltipNode.setAttribute('aria-hidden', 'true');

      return this;
    }
  }, {
    key: '_dispose',
    value: function _dispose() {
      var _this = this;

      // remove event listeners first to prevent any unexpected behaviour
      this._events.forEach(function (_ref) {
        var func = _ref.func,
            event = _ref.event;

        _this.reference.removeEventListener(event, func);
      });
      this._events = [];

      if (this._tooltipNode) {
        this._hide();

        // destroy instance
        this.popperInstance.destroy();

        // destroy tooltipNode if removeOnDestroy is not set, as popperInstance.destroy() already removes the element
        if (!this.popperInstance.options.removeOnDestroy) {
          this._tooltipNode.parentNode.removeChild(this._tooltipNode);
          this._tooltipNode = null;
        }
      }
      return this;
    }
  }, {
    key: '_findContainer',
    value: function _findContainer(container, reference) {
      // if container is a query, get the relative element
      if (typeof container === 'string') {
        container = window.document.querySelector(container);
      } else if (container === false) {
        // if container is `false`, set it to reference parent
        container = reference.parentNode;
      }
      return container;
    }

    /**
     * Append tooltip to container
     * @memberof Tooltip
     * @private
     * @param {HTMLElement} tooltipNode
     * @param {HTMLElement|String|false} container
     */

  }, {
    key: '_append',
    value: function _append(tooltipNode, container) {
      container.appendChild(tooltipNode);
    }
  }, {
    key: '_setEventListeners',
    value: function _setEventListeners(reference, events, options) {
      var _this2 = this;

      var directEvents = [];
      var oppositeEvents = [];

      events.forEach(function (event) {
        switch (event) {
          case 'hover':
            directEvents.push('mouseenter');
            oppositeEvents.push('mouseleave');
            break;
          case 'focus':
            directEvents.push('focus');
            oppositeEvents.push('blur');
            break;
          case 'click':
            directEvents.push('click');
            oppositeEvents.push('click');
            break;
        }
      });

      // schedule show tooltip
      directEvents.forEach(function (event) {
        var func = function func(evt) {
          if (_this2._isOpening === true) {
            return;
          }
          evt.usedByTooltip = true;
          _this2._scheduleShow(reference, options.delay, options, evt);
        };
        _this2._events.push({ event: event, func: func });
        reference.addEventListener(event, func);
      });

      // schedule hide tooltip
      oppositeEvents.forEach(function (event) {
        var func = function func(evt) {
          if (evt.usedByTooltip === true) {
            return;
          }
          _this2._scheduleHide(reference, options.delay, options, evt);
        };
        _this2._events.push({ event: event, func: func });
        reference.addEventListener(event, func);
        if (event === 'click' && options.closeOnClickOutside) {
          document.addEventListener('mousedown', function (e) {
            if (!_this2._isOpening) {
              return;
            }
            var popper = _this2.popperInstance.popper;
            if (reference.contains(e.target) || popper.contains(e.target)) {
              return;
            }
            func(e);
          }, true);
        }
      });
    }
  }, {
    key: '_scheduleShow',
    value: function _scheduleShow(reference, delay, options /*, evt */) {
      var _this3 = this;

      this._isOpening = true;
      // defaults to 0
      var computedDelay = delay && delay.show || delay || 0;
      this._showTimeout = window.setTimeout(function () {
        return _this3._show(reference, options);
      }, computedDelay);
    }
  }, {
    key: '_scheduleHide',
    value: function _scheduleHide(reference, delay, options, evt) {
      var _this4 = this;

      this._isOpening = false;
      // defaults to 0
      var computedDelay = delay && delay.hide || delay || 0;
      window.clearTimeout(this._showTimeout);
      window.setTimeout(function () {
        if (_this4._isOpen === false) {
          return;
        }
        if (!document.body.contains(_this4._tooltipNode)) {
          return;
        }

        // if we are hiding because of a mouseleave, we must check that the new
        // reference isn't the tooltip, because in this case we don't want to hide it
        if (evt.type === 'mouseleave') {
          var isSet = _this4._setTooltipNodeEvent(evt, reference, delay, options);

          // if we set the new event, don't hide the tooltip yet
          // the new event will take care to hide it if necessary
          if (isSet) {
            return;
          }
        }

        _this4._hide(reference, options);
      }, computedDelay);
    }
  }, {
    key: '_updateTitleContent',
    value: function _updateTitleContent(title) {
      if (typeof this._tooltipNode === 'undefined') {
        if (typeof this.options.title !== 'undefined') {
          this.options.title = title;
        }
        return;
      }
      var titleNode = this._tooltipNode.querySelector(this.options.innerSelector);
      this._clearTitleContent(titleNode, this.options.html, this.reference.getAttribute('title') || this.options.title);
      this._addTitleContent(this.reference, title, this.options.html, titleNode);
      this.options.title = title;
      this.popperInstance.update();
    }
  }, {
    key: '_clearTitleContent',
    value: function _clearTitleContent(titleNode, allowHtml, lastTitle) {
      if (lastTitle.nodeType === 1 || lastTitle.nodeType === 11) {
        allowHtml && titleNode.removeChild(lastTitle);
      } else {
        allowHtml ? titleNode.innerHTML = '' : titleNode.textContent = '';
      }
    }
  }]);
  return Tooltip;
}();

/**
 * Title function, its context is the Tooltip instance.
 * @memberof Tooltip
 * @callback TitleFunction
 * @return {String} placement - The desired title.
 */


var _initialiseProps = function _initialiseProps() {
  var _this5 = this;

  this.show = function () {
    return _this5._show(_this5.reference, _this5.options);
  };

  this.hide = function () {
    return _this5._hide();
  };

  this.dispose = function () {
    return _this5._dispose();
  };

  this.toggle = function () {
    if (_this5._isOpen) {
      return _this5.hide();
    } else {
      return _this5.show();
    }
  };

  this.updateTitleContent = function (title) {
    return _this5._updateTitleContent(title);
  };

  this._events = [];

  this._setTooltipNodeEvent = function (evt, reference, delay, options) {
    var relatedreference = evt.relatedreference || evt.toElement || evt.relatedTarget;

    var callback = function callback(evt2) {
      var relatedreference2 = evt2.relatedreference || evt2.toElement || evt2.relatedTarget;

      // Remove event listener after call
      _this5._tooltipNode.removeEventListener(evt.type, callback);

      // If the new reference is not the reference element
      if (!reference.contains(relatedreference2)) {
        // Schedule to hide tooltip
        _this5._scheduleHide(reference, options.delay, options, evt2);
      }
    };

    if (_this5._tooltipNode.contains(relatedreference)) {
      // listen to mouseleave on the tooltip element to be able to hide the tooltip
      _this5._tooltipNode.addEventListener(evt.type, callback);
      return true;
    }

    return false;
  };
};

return Tooltip;

})));
//# sourceMappingURL=tooltip.js.map

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
  