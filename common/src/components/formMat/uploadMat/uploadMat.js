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

