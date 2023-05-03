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