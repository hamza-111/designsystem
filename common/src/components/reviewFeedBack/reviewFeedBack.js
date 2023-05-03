/*
  reviewFeedBack.js
  -----------

  Description:
  composant reviewFeedBack

*/

;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eReviewFeedBack',
      attr       = 'data-e-review-feedback';

  var defaults   = {
    satisfied:      'c-userReview__voteBtn--up',
    unsatisfied:    'c-userReview__voteBtn--down',
    messageBlock:   '',
    classToOpen:    'is-message-open',
    voteYesMessage: "<strong>Merci pour votre vote, avez vous des suggestions d'amélioration ?</strong>",
    voteNoMessage:  "<strong>Merci pour votre vote, dîtes-nous pourquoi cette réponse n'est pas utile ?</strong> (facultatif)"
  };

  function Plugin( el, options ) {
    this.item       = el;

    var dataOptions = E.isJson(this.item.getAttribute(attr)) ? JSON.parse(this.item.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.voteYesMessage = this.settings.voteYesMessage;
    this.voteNoMessage  = this.settings.voteNoMessage;

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

      for (var i = 0, len = this.voteButtons.length; i < len; i++) {
        this.voteButtons[i].addEventListener('click', that.showBlockMessage.bind(that));
      }
    },

    getValues: function(){
      this.voteButtons    = this.item.querySelectorAll('.c-userReview__voteBtn');
      this.yesButton      = this.item.querySelector('.c-userReview__voteBtn--up');
      this.noButton       = this.item.querySelector('.c-userReview__voteBtn--down');
      this.userRewarding  = this.item.querySelector('.c-reviewFeedBack__userRewarding');
      this.messageBlock   = this.item.querySelector('.c-reviewFeedBack__userMessage');

      return this.voteButtons && this.yesButton && this.noButton && this.userRewarding && this.messageBlock;
    },

    showBlockMessage: function(e){
      var elemTarget = e.currentTarget;

      if ( elemTarget.classList.contains(this.settings.satisfied) ) {
        this.disableButtons();

        this.insertMessage(this.voteYesMessage);
        this.messageBlock.classList.add('is-message-open');
      } else if ( elemTarget.classList.contains(this.settings.unsatisfied) ) {
        this.disableButtons();

        this.insertMessage(this.voteNoMessage);
        this.messageBlock.classList.add('is-message-open');
      } else {
        return;
      }
    },

    disableButtons: function(){
       this.yesButton.setAttribute('disabled', 'disabled');
       this.noButton.setAttribute('disabled', 'disabled');
    },

    insertMessage: function(message){
      this.userRewarding.innerHTML = message;
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