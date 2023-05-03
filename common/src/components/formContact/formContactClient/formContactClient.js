/*
  formContactClient.js

  data-e-formcontact-client
  cible les .c-bubbleSelectElem servant à chosir si l'user est client
  ou non en vérifier la valeur de l'attribut "value" de l'input

  data-e-formcontact-client-target
  sur le bloc à afficher quand l'utilisateur est client

  data-e-formcontact-client-input
  cible .c-inputMat dans lequel l'user saisit sa référence client

  data-e-formcontact-client-submit
  cible le bouton de soumission pour la requête AJAX

  data-e-formcontact-client-trclient
  cible le bloc à afficher si le client est TR (tarif réglementé)
*/

;(function (window, document, E, undefined) {

  'use strict';

  var nodes           = {},
      clientEventShow = 'formContactClient.show',
      clientEventHide = 'formContactClient.hide';

  var isAllReady = function(){
    return nodes.contactRadio.length > 0 && nodes.isClientTarget && nodes.toStepTwo && nodes.trLinkBlock;
  };

  var initStepSelect = function(isClient) {
    document.dispatchEvent(new CustomEvent(clientEventShow, {
      detail: {
        client: isClient
      }
    }));
  };

  var showBlock = function(elem){
    elem.classList.remove('u-hide');
    elem.setAttribute('aria-hidden', 'false');
    elem.disabled = false;
  };

  var hideBlock = function(elem){
    elem.classList.add('u-hide');
    elem.setAttribute('aria-hidden', 'true');
    elem.disabled = true;
  };

  // Affiche ou non le bloc de saisie de la référence client
  var displayClientStatus = function(e){
    var input      = e.target,
        inputValue = input.getAttribute('value');

    if (!input.checked)
      return;

    if (inputValue === 'non') {
      hideBlock(nodes.isClientTarget);
      nodes.trLinkBlock.classList.remove("is-error");
      initStepSelect(false);
    }

    if (inputValue === 'oui') {
      showBlock(nodes.isClientTarget);
      document.dispatchEvent(new CustomEvent(clientEventHide));
    }

    // tracking
    document.dispatchEvent(new CustomEvent('formContactTracking.profile'));
  };

  var ajaxError = function(detail) {
    // tracking
    document.dispatchEvent(new CustomEvent('formContactTracking.ajaxError', {
      detail: detail
    }));

    console.warn('Une erreur dans la référence ou le service');
  };

  // Requête Ajax pour savoir si le client est OM ou TR, adapte le contenu en fonction de la réponse :
  var getClientRef = function(e){
    var refClientInput = nodes.refClientField.querySelector('.c-inputMat__field'),
        refClientValue = refClientInput.value,
        settingsAttr   = nodes.formContactClient.getAttribute('data-e-formcontact-client'),
        request        = new XMLHttpRequest(),
        settings       = {},
        url            = '';

    nodes.refClientField.eFieldValidation.checkValidity();

    if (!(refClientInput && refClientInput.checkValidity()) )
      return;

    e.preventDefault();

    // cas où on ne souhaite pas faire de call vers "context"
    if (settingsAttr === 'data-e-formcontact-client') {
      initStepSelect(true);
      return;
    }

    // call "context" pour vérifier OM/TR
    settings = JSON.parse(nodes.formContactClient.getAttribute('data-e-formcontact-client'));

    if (E.debug)
      url = settings.url;
    else
      url = settings.url + '/' + refClientInput.value;

    request.open('GET', url , true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    nodes.toStepTwo.classList.add('is-loading');

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // tracking second choice
        var blocClientNonTarifClient = document.querySelector('#refClient_error'); 
        document.dispatchEvent(new CustomEvent('formContactTracking.validateReference'));
        
        // si réponse vide ou cassée
        if (!E.isJson(request.response)) {
          nodes.toStepTwo.classList.remove('is-loading');
          ajaxError({message: 'broken-json'});
          return;
        }

        var response = JSON.parse(request.response);

        if (response.gaz === true) {
          // tracking
          // document.dispatchEvent(new CustomEvent('formContactTracking.clientTR'));

          nodes.trLinkBlock.classList.remove("is-error");
          initStepSelect(true);

          if (compteClient !== null && compteClient !== undefined) {
            // reinit de l'objet 'compteClient' si le client            // fait plusieurs recherches de BP            compteClient = new CompteClient();
            compteClient.wrapCompteClient(response);
            // cacher la liste des contrats au cas où elle serait déjà affichée            document.getElementById("listMultiCC").style.display = "none";
            // chacher le titre aussi            document.getElementById("titreMultiCC").style.display = "none";
          }
        }

        if (response.gaz === false) {
          // tracking
          document.dispatchEvent(new CustomEvent('formContactTracking.clientOM'));

          showBlock(nodes.trLinkBlock);
          document.dispatchEvent(new CustomEvent(clientEventHide));
          E.scrollTo({
            next: nodes.trLinkBlock,
            offset: 100
          });

          // envoi event pour tagging
          var event = new CustomEvent('formContact.omtrShow');
          document.dispatchEvent(event);
        }

        if (response.code === null) {
          nodes.refClientField.eFieldValidation.setCustomError(settings.errorWrongRef);
          ajaxError({message: 'no-ref'});
          nodes.trLinkBlock.lastElementChild.innerHTML = "<li>" + nodes.trLinkBlock.getAttribute("data-e-formcontact-error") + "</li>"          
          nodes.trLinkBlock.classList.add("is-error");
          var dataclickname = JSON.parse('{"tc_clic_name":"erreur_technique","tc_clic_zone":"aide_contact.formulaire_de_contact.etape_1_reference_client.valider_ma_reference_client", "tc_clic_type":"push_view_component"}'.replace(/(\r\n|\n|\r)/gm,"")) || {}; // remove line breaks          
          //var tmsId = formatedComponentName.F_00_06_convertTCFormat().toLowerCase() +"."+ formatedLinkName.F_00_06_convertTCFormat().toLowerCase();          
          var tmsId = dataclickname.tc_clic_zone +"."+ dataclickname.tc_clic_name;
          //  dataclickname.tc_clic_type='push_component';
          F_00_10_marquePushView(blocClientNonTarifClient, tmsId, dataclickname);
        }

        if(!blocClientNonTarifClient.classList.contains("is-error")) {
          document.dispatchEvent(new CustomEvent('formContactTracking.secondeChoice'));
        }

      } else {
        ajaxError({
          code: request.status,
          message: request.responseText
        });
        nodes.trLinkBlock.lastElementChild.innerHTML = "<li>" + nodes.trLinkBlock.getAttribute("data-e-formcontact-notGTR") + "</li>"
        nodes.trLinkBlock.classList.add("is-error");
      }

      nodes.toStepTwo.classList.remove('is-loading');
    };

    request.onerror = function(e) {
      nodes.toStepTwo.classList.remove('is-loading');
      ajaxError({
        code: e.target.status,
        message: e.target.responseText
      });
    };

    request.send();
  };

  var formContactClient = function() {
    nodes.formContactClient = document.querySelector('[data-e-formcontact-client]'),
    nodes.contactRadio      = document.querySelectorAll('[data-e-formcontact-client] .c-bubbleSelectElem__input'),
    nodes.isClientTarget    = document.querySelector('[data-e-formcontact-client-target]'),
    nodes.toStepTwo         = document.querySelector('[data-e-formcontact-client-submit]'),
    nodes.trLinkBlock       = document.querySelector('#refClient_error'),
    nodes.refClientField    = document.querySelector('[data-e-formcontact-client-input]');
    nodes.trFormBlock       = document.querySelector('[data-e-formcontact-block]');

    if (!isAllReady)
      return;

    // on active si pas connecté
    if (E.dataUser) {
      nodes.formContactClient.classList.add('u-hide');
      initStepSelect(true);
    } else {
      for (var i = 0, len = nodes.contactRadio.length; i < len; i++) {
        nodes.contactRadio[i].addEventListener('change', displayClientStatus);
      }

      nodes.toStepTwo.addEventListener('click', getClientRef);
    }
  };

  // on écoute formContact.js
  document.addEventListener('formContact.start', formContactClient);

})(window, document, window.E || {});
