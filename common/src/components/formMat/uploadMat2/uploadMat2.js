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

