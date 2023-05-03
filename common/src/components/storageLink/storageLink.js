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
