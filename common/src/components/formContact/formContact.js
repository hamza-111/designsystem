/*
  formContact.js
*/

;(function (window, document, E, undefined) {

  'use strict';

  var formContactNode = document.querySelector('[data-e-formcontact]'),
      formNode;

  if (!formContactNode)
    return;

  formNode = formContactNode.querySelector('form');

  if (E.debug) {
    // données CEL
    var fakeUserData = {
      "refBP": "333111222",
      "civilite": "Mr",
      "nom": "Dupont",
      "prenom": "Michel",
      "portable": "0605040302",
      "fixe": null,
      "email": "michel.dupont@gmail.com",
      "profilMarketing": "ESSENTIEL",
      "ccEnSession": "000511204093",
      "typeCompte": "CLIENT",
      "premium": false,
      "typeTR": false,
      "adresse": {
        "numeroVoie": "14",
        "libelleVoie": "RUE MALHENE",
        "cp": "14390",
        "ville": "VARAVILLE",
        "pays": "FR"
      },
      "chequeEnergie": null,
      "comptesClients": {}
    };

    var fakeUserContratsData = {
      "333111222": {
        "000511204093": {
          "5509779230": {
            "id": "5509779230",
            "type": "GAZ",
            "statut": "actif",
            "libelle": null,
            "url": null,
            "typeUrl": null,
            "numISU": null,
            "idPdl": null,
            "puissance": null,
            "typeComptage": null,
            "plage": null,
            "datefin": null,
            "dateCreation": 1191016800000,
            "urlGazSae": null,
            "urlElecSae": null,
            "contentendExist": null
          },
          "000511204093": {
            "id": "000511204093",
            "type": "ELEC",
            "statut": "actif",
            "libelle": null,
            "url": null,
            "typeUrl": null,
            "numISU": null,
            "idPdl": null,
            "puissance": null,
            "typeComptage": null,
            "plage": null,
            "datefin": null,
            "dateCreation": 1191016800000,
            "urlGazSae": null,
            "urlElecSae": null,
            "contentendExist": null
          }
        }
      }
    };

    var fakeUserComptesData = {
      "333111222": {
        "000511204010": {
          "id": "000511204010",
          "soldeEnCours": "",
          "conditionPaiement": "",
          "statutsServiceResiliation": "",
          "dateProchaineFacture": "",
          "dateProchaineEcheancePaiement": "",
          "role": "Contractant",
          "codeRole": "",
          "bpSessionPayeurDivergent": null,
          "isMensualise": null,
          "isModeEncaissementPrelevement": null,
          "isNoPlanPaiement": null,
          "typeTarif": "OM",
          "statut": "actif",
          "dateFin": "",
          "typeLogement": "",
          "factures": {},
          "paiements": {},
          "contrats": {},
          "services": {},
          "pointsDeLivraison": {},
          "planMensualisation": null,
          "adresse": {
            "numeroVoie": "24",
            "libelleVoie": "RUE AUX OURS",
            "cp": "76000",
            "ville": "ROUEN",
            "pays": "FR"
          },
          "planApurement": null
        },
        "000511204093": {
          "id": "000511204093",
          "soldeEnCours": "",
          "conditionPaiement": "",
          "statutsServiceResiliation": "",
          "dateProchaineFacture": "",
          "dateProchaineEcheancePaiement": "",
          "role": "Contractant",
          "codeRole": "",
          "bpSessionPayeurDivergent": null,
          "isMensualise": null,
          "isModeEncaissementPrelevement": null,
          "isNoPlanPaiement": null,
          "typeTarif": "TR",
          "statut": "actif",
          "dateFin": "",
          "typeLogement": "",
          "factures": {},
          "paiements": {},
          "contrats": {},
          "services": {},
          "pointsDeLivraison": {},
          "planMensualisation": null,
          "adresse": {
            "libelleVoie": "RUE MALHENE",
            "cp": "14390",
            "ville": "VARAVILLE",
            "pays": "FR"
          },
          "planApurement": null
        }
      }
    };

    // décommenter pour tester en mode "connecté"
    E.storage.setItem('CEL_MOM', JSON.stringify(fakeUserData));
    E.storage.setItem('CEL_MOM_CONTRATS', JSON.stringify(fakeUserContratsData));
    E.storage.setItem('CEL_MOM_COMPTESCLIENTS', JSON.stringify(fakeUserComptesData));

    formNode.method = 'get';
  }

  function resetAjaxError() {
    var errorNode = document.querySelector('[data-e-formcontact-server-error]');

    errorNode.hidden = true;
    errorNode.removeAttribute("role");
  }

  function ajaxError(detail) {
    var errorNode = document.querySelector('[data-e-formcontact-server-error]');

    errorNode.hidden = false;
    errorNode.setAttribute("role", "alert");

    // tracking
    document.dispatchEvent(new CustomEvent('formContactTracking.ajaxError', {
      detail: detail
    }));
  }

  function ajaxSuccess(detail) {
    var siteContent        = document.querySelector('#siteContent'),
        successNode        = document.querySelector('[data-e-formcontact-success]'),
        successNameNode    = document.querySelector('[data-e-formcontact-success-name]'),
        successEmailNode   = document.querySelector('[data-e-formcontact-success-email]'),
        emailNode          = document.querySelector('[data-e-formcontact-userinfos-email] input'),
        emailConnectedNode = document.querySelector('[data-e-formcontact-userinfos-connect-email] input'),
        firstnameNode      = document.querySelector('[data-e-formcontact-userinfos-firstname] input'),
        genreNode          = document.getElementById("contact-civilite"),
        nameNode           = document.querySelector('[data-e-formcontact-userinfos-name] input');

    successNode.hidden = false;
    formContactNode.remove();

    if (E.dataUser) {

      var civiliteMetier = getCiviliteMetier(E.dataUser.civilite);

      successNameNode.innerText  = civiliteMetier +' ' + E.dataUser.nom;
      successEmailNode.innerText = emailConnectedNode.value;
    } else {

      successNameNode.innerText  = genreNode !== null ? genreNode.value +' ' + nameNode.value : "";

      successEmailNode.innerText = emailNode.value;
    }

    E.scrollTo({
      next: siteContent
    });

    // tracking
    document.dispatchEvent(new CustomEvent('formContactTracking.confirmation', {
      detail: detail
    }));
  }

  // for dev back
  function getCiviliteMetier(civilite) {
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
  }
  // -- for dev back

  // Init des données users connectés
  function initConnectedUser() {
    E.dataUser          = JSON.parse(E.storage.getItem('CEL_MOM'));
    E.dataUser.contrats = JSON.parse(E.storage.getItem('CEL_MOM_CONTRATS'));
    E.dataUser.accounts = JSON.parse(E.storage.getItem('CEL_MOM_COMPTESCLIENTS'));
    E.dataUser.energy   = getEnergy();

    // on adapte le form pour les user connectés
    var event = new CustomEvent('formContact.connect');
    setTimeout(function() {
      document.dispatchEvent(event);
    }, 0);
  }

  // récupération énergie
  function getEnergy()  {
    var isElec       = false,
        isGaz        = false,
        listContrats = E.dataUser.contrats[E.dataUser.refBP][E.dataUser.ccEnSession],
        typeContrat  = null;

    if (listContrats) {
      for (var currentId in listContrats) {
        if (!listContrats.hasOwnProperty(currentId)) continue;

        var currentContrat = listContrats[currentId];

        if (currentContrat && currentContrat.type) {
          switch (currentContrat.type.toUpperCase()) {
            case 'ELEC':
              if (isGaz) {
                typeContrat = 'DUAL_FALSE';
              } else {
                typeContrat = 'ELEC';
                isElec = true;
              }
              break;
            case 'GAZ':
              if (isElec) {
                typeContrat = 'DUAL_FALSE';
              } else {
                typeContrat = 'GAZ';
                isGaz = true;
              }
              break;
            case 'DUAL':
              typeContrat = 'DUAL';
              break;
          }
        }
      }
    }

    return typeContrat;
  }

  function isFormResponse() {
    return E.storage.getItem('formContact') ? true : false;
  }

  function initTracking() {
    var tmsInputNode = document.querySelector('[data-e-formcontact-tms]'),
        gaInputNode  = document.querySelector('[data-e-formcontact-ga]'),
        gaid         = '';

    // Marquage ID_TMS
    if (typeof window.tc_vars !== 'undefined')
      tmsInputNode.value = window.tc_vars.terminal_id;

    // Marquage ID_COOKIE_GA
    gaid = localStorage.getItem('GAID');
    if (typeof gaid !== 'undefined')
      gaInputNode.value = gaid;
    else
      gaInputNode.value = E.Cookies.get('_ga');
  }

  document.addEventListener('DOMContentLoaded', function() {
    if (E.debug) {
      E.formContact.selectClient.push({
        value: "Debug-TEST",
        label: "Debug TEST",
        subLevel: [{
          value: "Debug-TEST",
          label: "Debug TEST",
          toShow: "allUsers",
          theme: "theme",
          type: "type",
          subject: "subject"
        }]
      });

      E.formContact.selectNotClient.push({
        value: "Debug-TEST",
        label: "Debug TEST",
        subLevel: [{
          value: "Debug-TEST",
          label: "Debug TEST",
          toShow: "allUsers",
          theme: "theme",
          type: "type",
          subject: "subject"
        }]
      });
    }

    // init les fieldsets
    E.plugins.eFormContactBlock();

    // Si connecté, on récupère les infos nécessaires
    if (E.storage.getItem('CEL_MOM'))
      initConnectedUser();

    // init du niveau 1 du formulaire
    var event = new CustomEvent('formContact.start');
    document.dispatchEvent(event);

    formContactNode.addEventListener('submit', function(e) {
      e.preventDefault();
    });

    formContactNode.hidden = false;
  });

  // envoi form executé par ReCaptcha
  // parametre rajouté pour back
  E.formContact.sendForm = function(callbackload, callbackinit) {
    var request       = new XMLHttpRequest(),
        formNode      = document.querySelector('[data-e-formcontact] form'),
        method        = formNode.method,
        action        = formNode.action,
        formData,
        submitBtnNode = document.querySelector('[data-e-form-validation-submit]');

    // tracking
    initTracking();

    formData = new FormData(formNode);

    formNode.eFormValidation.checkValidation();

    if (!formNode.checkValidity()) {
      // réinitialisation du token de captcha en cas d'erreur de validation du formulaire      
      if (document.getElementById("captchaToken") !== undefined && document.getElementById("captchaToken") !== null) {
        document.getElementById("captchaToken").value = "";
      }
      return;
    }

    request.open(method, action, true);

    if (E.debug) {
      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      console.log('--- envoi contactForm ---');
      console.log(E.serializeForm(formNode));
      console.log('--- END - envoi contactForm ---');
    }

    submitBtnNode.classList.add('is-loading');
    resetAjaxError();

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        // si réponse vide ou cassée
        if (!E.isJson(request.response)) {
          submitBtnNode.classList.remove('is-loading');
          ajaxError({message: 'broken-json'});
          if(callbackload !== null && callbackinit !== null) {
            callbackload(callbackinit);
          }
        }

        var response = JSON.parse(request.response);
        if (response.valid) {
          // tracking spécifique optin
          ajaxSuccess({
            engie: formNode.elements.OPTIN_EMAIL,
            partenaire: formNode.elements.OPTIN_PARTENAIRE
          });
        }
      } else {
        if (document.getElementById("captchaToken") !== undefined
            && document.getElementById("captchaToken") !== null) {
          document.getElementById("captchaToken").value = "";
        }
        
        ajaxError({
          code: request.status,
          message: request.responseText
        });
      }

      submitBtnNode.classList.remove('is-loading');

      if(callbackload !== null && callbackinit !== null){
        callbackload(callbackinit);
      }
    };

    request.onerror = function (e) {

      if (document.getElementById("captchaToken") !== undefined
            && document.getElementById("captchaToken") !== null) {
          document.getElementById("captchaToken").value = "";
        }

      submitBtnNode.classList.remove('is-loading');
      ajaxError({
        code: e.target.status,
        message: e.target.responseText
      });

      if(callbackload !== null && callbackinit !== null){
        callbackload(callbackinit);
      }
    };

    request.send(formData);
  };

  if (E.debug) {
    document.addEventListener('formContactTracking.profile', function() { console.log('profile'); });
    document.addEventListener('formContactTracking.clientOM', function() { console.log('clientOM'); });
    document.addEventListener('formContactTracking.clientTR', function() { console.log('clientTR'); });
    document.addEventListener('formContactTracking.ajaxError', function(e) { console.log('ajaxError', e.detail); });
    document.addEventListener('formContactTracking.theme', function() { console.log('theme'); });
    document.addEventListener('formContactTracking.type', function() { console.log('type'); });
    document.addEventListener('formContactTracking.contenu', function() { console.log('contenu'); });
    document.addEventListener('formContactTracking.confirmation', function(e) { console.log('confirmation', e.detail); });
    document.addEventListener('formContactTracking.testNoForm', function() { console.log('testNoForm'); });
    document.addEventListener('formContactTracking.sendDemande', function() { console.log('sendDemande'); });
    document.addEventListener('formContactTracking.', function() { console.log('secondeChoice'); });
  }

})(window, document, window.E || {});
