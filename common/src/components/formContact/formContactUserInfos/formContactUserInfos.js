/*
  formContactUserInfos.js
*/

;(function (window, document, E, undefined) {

  'use strict';

  function adaptForm() {
    var hideNode          = document.querySelector('[data-e-formcontact-userinfos-connect-hide]'),
        showNode          = document.querySelector('[data-e-formcontact-userinfos-connect-show]'),
        multiCCNode       = document.querySelector('[data-e-formcontact-userinfos-connect-multicc]'),
        selectMultiCCNode = multiCCNode.querySelector('select'),
        emailNode         = document.querySelector('[data-e-formcontact-userinfos-connect-email] input'),
        telNode           = document.querySelector('[data-e-formcontact-userinfos-connect-tel] input'),
        genreNode         = document.querySelector('[data-e-formcontact-userinfos-connect-genre]'),
        nameNode          = document.querySelector('[data-e-formcontact-userinfos-connect-name]'),
        firstnameNode     = document.querySelector('[data-e-formcontact-userinfos-connect-firstname]'),
        cpNode            = document.querySelector('[data-e-formcontact-userinfos-connect-cp]'),
        communeNode       = document.querySelector('[data-e-formcontact-userinfos-connect-commune]'),
        addressNode       = document.querySelector('[data-e-formcontact-userinfos-connect-address]'),
        clientNode        = document.querySelector('[data-e-formcontact-userinfos-connect-client]'),
        refNode           = document.querySelector('[data-e-formcontact-userinfos-connect-ref]');

    var isMultiCC = function() {
      var accounts = E.dataUser.accounts,
          length   = Object.keys(accounts[E.dataUser.refBP]).length;

      return length > 1;
    };

    var buildMultiCC = function () {
      var html     = [],
          accounts = E.dataUser.accounts[E.dataUser.refBP],
          numeroVoie;

      for (var key in accounts) {
        if (!accounts.hasOwnProperty(key))
          continue;

        numeroVoie = accounts[key].adresse.numeroVoie ? accounts[key].adresse.numeroVoie : '';

        if (key === E.dataUser.ccEnSession)
          html.unshift('<option value="'+ key +'">'+ numeroVoie +' '+ accounts[key].adresse.libelleVoie +' '+ accounts[key].adresse.cp +' '+ accounts[key].adresse.ville +'</option>');
        else
          html.push('<option value="'+ key +'">'+ numeroVoie +' '+ accounts[key].adresse.libelleVoie +' '+ accounts[key].adresse.cp +' '+ accounts[key].adresse.ville +'</option>');
      }

      selectMultiCCNode.innerHTML = html.join('');
    };

    hideNode.hidden   = true;
    hideNode.disabled = true;
    showNode.hidden   = false;
    showNode.disabled = false;

    emailNode.value     = E.dataUser.email;
    telNode.value       = E.dataUser.portable ? E.dataUser.portable : E.dataUser.fixe;
    genreNode.value     = E.dataUser.civilite;
    nameNode.value      = E.dataUser.nom;
    firstnameNode.value = E.dataUser.prenom;
    cpNode.value        = E.dataUser.adresse.cp;
    communeNode.value   = E.dataUser.adresse.ville;
    addressNode.value   = E.dataUser.adresse.libelleVoie;
    refNode.value       = E.dataUser.refBP;
    clientNode.value    = 'oui';

    if (!isMultiCC())
      return;

    buildMultiCC();

    multiCCNode.hidden = false;
    multiCCNode.disabled = false;

    multiCCNode.addEventListener('change', function(e) {
      var el         = e.target,
          cc         = el.value,
          numeroVoie = E.dataUser.accounts[E.dataUser.refBP][cc].adresse.numeroVoie;

      cpNode.value      = E.dataUser.accounts[E.dataUser.refBP][cc].adresse.cp;
      communeNode.value = E.dataUser.accounts[E.dataUser.refBP][cc].adresse.ville;
      addressNode.value = (numeroVoie ? numeroVoie+' ' : '') + E.dataUser.accounts[E.dataUser.refBP][cc].adresse.libelleVoie;
    });
  }

  // on écoute formContact.js
  document.addEventListener('formContact.connect', adaptForm);

})(window, document, window.E || {});
