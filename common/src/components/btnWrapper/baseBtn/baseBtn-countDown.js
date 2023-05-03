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
