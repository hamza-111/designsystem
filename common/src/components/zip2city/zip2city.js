/*
  zip2city.js
  ---------

*/

;(function ($, window, document, E, undefined) {

  'use strict';

  var pluginName    = 'eZip2city',
      attr          = 'data-e-zip2city';

  var inputZip      = '[data-e-zip2city-zip]';
  var inputPlace    = '[data-e-zip2city-place]';
  var errorMessages = 'e-zip2city-messages';
  var error         = '[data-e-zip2city-error]';
  var hasgaz        = '[data-e-zip2city-hasgaz]';
  var hasgazMessages = 'e-zip2city-hasgaz';

  var defaults   = {};

  // vérifier si un string est un entier positif
  function isNormalInteger(string) {
    var n = Math.floor(Number(string));
    return String(n) === string && n >= 0;
  }

  function Plugin( el, options ) {
    this.$item         = $(el);

    var dataOptions    = typeof this.$item.data(pluginName) === 'object' ? this.$item.data(pluginName): {};
    this.settings      = $.extend({}, defaults, options, dataOptions);

    this.mode          = 'input';
    this.$place        = this.$item.find(inputPlace);
    this.$zip          = this.$item.find(inputZip);
    this.$error        = this.$item.find(error);
    this.$hasgaz       = this.$item.find(hasgaz);
    this.errorMessages = this.$item.data(errorMessages);
    this.retry         = true; // la saisie peut se poursuivre
    this.maxLength     = this.$zip[0].maxLength;
    this.data          = {};
    this.jqxhr;

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();
    },

    events: function() {
      var that = this;

      that.$item.on('keyup.city', inputZip, function(e) {
        var input = $(this).val();

        that.$error.text('');
        that.validate(input);
      });
    },

    validate: function(string) {
      var reg    = new RegExp(this.$zip.attr('pattern')),
          zip    = reg.test(string),
          $input = this.$place.find('input');

      this.$zip.removeClass('is-error');

      // ce n'est pas un chiffre
      if (!zip) {
        if (this.mode === 'select') this.changeToText();
        if (string.length > 0) this.showError('errorFormat');
        $input.val('');
        this.$hasgaz.text('');
        return this;
      }

      if (this.retry && string.length === this.maxLength) {
        // call du service
        if (E.debug) {
          // Fake - exemple pour villes multiples
          if (string === '47600') {
            this.settings.api = '../fake/zip2city-multiple.json';
          } else {
            this.settings.api = '../fake/zip2city-single.json';
          }
          this.jqxhr = $.ajax(this.settings.api);

        } else {
          this.jqxhr = $.ajax(this.settings.api + string);
        }

        this.callApi();
        this.retry = false; // pour bloquer les prochains call
        return this;
      }

      if (string.length < this.maxLength) {
        if (this.mode === 'select') this.changeToText();
        $input.val('');
        this.$hasgaz.text('');
        this.retry = true;
      }

      return this;
    },

    callApi: function() {
      var that = this;

      this.jqxhr
        .done(that.callBack.bind(that))
        .fail(that.showError.bind(that, 'errorNetwork'));
    },

    callBack: function(data) {
      this.data = data;

      this.$hasgaz.text('');

      if (data.listeCommunes.length === 0) {
        this.showError('errorValidity');
        return this;
      }

      if (data.listeCommunes.length === 1) {
        if (this.mode === 'select') this.changeToText();
        this.$place.find('input').val(data.listeCommunes[0].nomCommune);

        // Si on veut afficher le raccordement au gaz
        if (this.$hasgaz.length) this.checkHasgaz(0);
        return this;
      }

      if (this.mode === 'input') this.changeToSelect();
      this.createOptions(data.listeCommunes);
      return this;
    },

    createOptions: function(data) {
      var that    = this,
          $select = that.$place.find('select'),
          options = ['<option value="">Choisissez votre commune</option>'];

      for (var i = 0, len = data.length; i < len; i++) {
        options.push('<option value="'+ data[i].nomCommune +'">'+ data[i].nomCommune +'</option>');
      }

      that.$place.find('select').html(options.join(''));

      // Si on veut afficher le raccordement au gaz
      if (that.$hasgaz.length) {
        $select.off('change.zip2city').on('change.zip2city', function() {
          if (this.value) {
            that.checkHasgaz(this.value);
          } else {
            that.$hasgaz.text('');
          }
        });
      }

      return that;
    },

    showError: function(error) {
      var message = '';

      this.$zip.addClass('is-error');

      switch (error) {
        case 'errorFormat':
          message = this.errorMessages.errorFormat;
          break;
        case 'errorValidity':
          message = this.errorMessages.errorValidity;
          break;
        case 'errorNetwork':
          message = this.errorMessages.errorNetwork;
          break;
      }
      this.$item.closest('form').attr('aria-invalide', 'true');
      this.$error
        .text(message)
        .attr('role', 'alert')
        .closest('[data-e-form-field]')
          .addClass('is-error');
    },

    changeToText: function() {
      var $oldEl = this.$place.empty(),
          name   = $oldEl.attr('name'),
          id     = $oldEl.attr('id'),
          $newEl = $('<input class="c-input" type="text" disabled name="'+ name +'" id="'+ id +'" />');

      this.mode = 'input';
      this.$place.append($newEl);
    },

    changeToSelect: function() {
      var $oldEl = this.$place.empty(),
          name   = $oldEl.attr('name'),
          id     = $oldEl.attr('id'),
          newEl  = '<div class="c-select">'+
                     '<select name="'+ name +'" id="'+ id +'"></select>'+
                     '<span class="icon icon-chevron-bottom"></span>'+
                   '</div>',
          $newEl = $(newEl);

      this.mode = 'select';
      $newEl.find('select').append('<option value=""> - </div>');
      this.$place.append($newEl);
    },

    checkHasgaz: function(index) {
      var messages = this.$hasgaz.data(hasgazMessages);

      if (this.data.listeCommunes[index].raccordementGrDF === 'Oui') {
        this.$hasgaz
          .text(messages.yes)
          .removeClass('is-error')
          .addClass('is-success');
      } else {
        this.$hasgaz
          .text(messages.no)
          .removeClass('is-success')
          .addClass('is-error');
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