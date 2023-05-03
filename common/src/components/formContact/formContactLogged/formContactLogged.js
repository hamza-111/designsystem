/*
  formContactLogged.js
*/

;(function (window, document, E, undefined) {

  'use strict';

//Converter à la civilité métier demandé par Ferhat.

  
var GetCiviliteMetier = function(){};
GetCiviliteMetier.prototype.constructor = GetCiviliteMetier;

GetCiviliteMetier.prototype.getCiviliteMetier = function(civilite) {
  var returnCivilite = civilite.trim();
  if(returnCivilite ==="MR" || returnCivilite ==="Mr" || returnCivilite ==="mr") {
    returnCivilite = "M." ;
  }
  if(returnCivilite ==="MME" || returnCivilite ==="mme" || returnCivilite ==="MLLE" || returnCivilite ==="mlle") {
    returnCivilite = "Mme" ;
  }

  if(returnCivilite ==="MR et MME" || returnCivilite ==="MME et MR") {
    returnCivilite = "Mme et M." ;
  }
  return returnCivilite;
};

var civiliteMetier = new GetCiviliteMetier();
  function init() {
    if (!E.dataUser)
      return;

    var connectedUsernameNode = document.querySelector('[data-e-formcontact-client-username]'),
        connectedNode         = document.querySelector('[data-e-formcontact-client-connected]');

    connectedNode.classList.remove('u-hide');

    // var civiliteMetier = getCiviliteMetier(E.dataUser.civilite);
    civiliteMetier.getCiviliteMetier(E.dataUser.civilite);

    connectedUsernameNode.textContent = E.dataUser.civilite + ' ' + E.dataUser.prenom + ' ' + E.dataUser.nom;
    connectedUsernameNode.textContent = civiliteMetier.getCiviliteMetier(E.dataUser.civilite) + ' ' + E.dataUser.nom;
  }

//Converter à la civilité métier demandé par Fe

  // function getCiviliteMetier(civilite) {
  //     var returnCivilite = civilite.trim();
  //     if(returnCivilite ==="MR" || returnCivilite ==="Mr" || returnCivilite ==="mr") {
  //       returnCivilite = "M." ;
  //     }
  //     if(returnCivilite ==="MME" || returnCivilite ==="mme" || returnCivilite ==="MLLE" || returnCivilite ==="mlle") {
  //       returnCivilite = "Mme" ;
  //     }

  //     if(returnCivilite ==="MR et MME" || returnCivilite ==="MME et MR") {
  //       returnCivilite = "Mme et M." ;
  //     }
  //     return returnCivilite;
  //   }

  document.addEventListener('formContact.start', init);

})(window, document, window.E || {});
