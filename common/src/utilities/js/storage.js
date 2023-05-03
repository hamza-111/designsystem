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
