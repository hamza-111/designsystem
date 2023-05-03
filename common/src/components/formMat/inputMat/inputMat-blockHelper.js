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

