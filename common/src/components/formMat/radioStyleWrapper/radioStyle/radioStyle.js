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