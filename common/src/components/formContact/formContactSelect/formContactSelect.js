/*
  formContactSelect.js
*/

;(function(window, document, E, undefined) {

  'use strict';

  var formContactSelect = document.querySelector('[data-e-formcontact-select]'),
      objetLevel1       = [],
      objetLevel2       = [],
      objetLevel3       = [],
      connectedUser     = false,
      init              = false;

  var initFormContactSelect = function(e) {
    var objetToShow     = E.formContact.toShow,
        defaultLabel    = E.formContact.defaultLabel,
        select1Node     = document.querySelector('[data-e-formcontact-select1] select'),
        wrapSelect2Node = document.querySelector('[data-e-formcontact-select2]'),
        mainFormNode    = document.querySelector('[data-e-formcontact-main]'),
        bypassNode      = document.querySelector('[data-e-formcontact-bypass]'),
        // bypassDescNode  = document.querySelector('[data-e-formcontact-bypass-desc]'),
        showFormNode    = document.querySelector('[data-e-formcontact-showform]'),
        typeNode        = document.querySelector('[data-e-formcontact-type]'),
        themeNode       = document.querySelector('[data-e-formcontact-theme]'),
        subjectNode     = document.querySelector('[data-e-formcontact-subject]'),
        secondaryRecipientProd   = document.querySelector('[data-e-formcontact-secondary-prod]'),
        secondaryRecipientNoProd = document.querySelector('[data-e-formcontact-secondary-no-Prod]'),
        bypassFormTitle          = document.querySelector('[data-e-formcontact-bypass-title]'),
        bypassFormContent        = document.querySelector('[data-e-formcontact-bypass-content]'),
        bypassFormLeftCta        = document.querySelector('[data-e-formcontact-left-cta]'),
        bypassFormRedirectCta       = document.querySelector('[data-e-formcontact-right-cta]'),
        select2Node     = wrapSelect2Node.querySelector('select'),
        wrapSelect3Node = document.querySelector('[data-e-formcontact-select3]'),
        select3Node = document.querySelector('[data-e-formcontact-select3] select'),
        divInfoBlockDescriptif     = document.querySelector('[data-e-formcontact-infoBlockDescriptif]'),
        divInfoAlerterConseille    = document.querySelector('[data-e-formcontact-infoAlerterConseille]');

    connectedUser = e.detail.client ? true : false;

    function checkConnexion() {
      return connectedUser ? E.formContact.selectClient : E.formContact.selectNotClient;
    }

    // Création des options du selecteur
    function initOption(element, objet) {
      var html = (objet.length > 1) ? ['<option value>'+ defaultLabel +'</option>'] : [];

      for (var i = 0; i < objet.length; i++ ) {
        html.push('<option value="'+ objet[i].value +'">'+ objet[i].label +'</option>');
      }

      element.innerHTML = html.join('');

      // hack pour que les options s'affichent entières sur iOS (sinon c'est tronqué)
      element.appendChild(document.createElement("optgroup"));

      // on provoque le change si 1 option
      if (objet.length === 1) {
        setTimeout(function () {
          var event = new Event('change');
          element.dispatchEvent(event);
        }, 0);
      }
    }

    // Change sur 1er SELECT
    function firstChoice() {
      if (!select1Node.value) {
        wrapSelect2Node.classList.add("u-hide");
        wrapSelect3Node.classList.add("u-hide");
        bypassNode.hidden = true;
        hideMainForm();

      } else {
        objetLevel2  = objetLevel1.filter(function(arr) {
          return arr.value === select1Node.value;
        });

        if (objetLevel2[0].subLevel !== null 
          && objetLevel2[0].subLevel !==undefined 
          && objetLevel2[0].subLevel !=="" 
          && objetLevel2[0].subLevel.length > 0) {
            wrapSelect2Node.classList.remove("u-hide");
            wrapSelect3Node.classList.add("u-hide");
            initOption(select2Node, objetLevel2[0].subLevel);
        // tracking
        document.dispatchEvent(new CustomEvent('formContactTracking.theme'));
        } else {
          //to do
          wrapSelect2Node.classList.add("u-hide");
          wrapSelect3Node.classList.add("u-hide");
          byPassLevel(objetLevel2);
        }
      }

      bypassNode.hidden = true;
      hideMainForm();
    }

    // Change sur 2d SELECT    
    function secondChoice() {
      if (select2Node.value !== "") {
        var filterCase = objetLevel2[0].subLevel.filter(function(arr) {
              return arr.value === select2Node.value;
            });
        secondaryRecipientProd.value   = filterCase[0].secondaryRecipientProd;
        secondaryRecipientNoProd.value = filterCase[0].secondaryRecipientNoProd;
        //Level 3        
        if(filterCase[0].subLevelN2 !==null && filterCase[0].subLevelN2 !==undefined && filterCase[0].subLevelN2 !=="" && filterCase[0].subLevelN2.length > 0){
          wrapSelect3Node.classList.remove("u-hide");
          initOption(select3Node, filterCase[0].subLevelN2);
          objetLevel3 = filterCase ;
          bypassNode.hidden = true;
          hideMainForm();
        } else {
          wrapSelect3Node.classList.add("u-hide");
          byPassLevel(filterCase);
        }
      } else {
        wrapSelect3Node.classList.add("u-hide");
        hideMainForm();
      }
      // TO MANAGE      
      //document.dispatchEvent(new CustomEvent('formContactTracking.secondeChoice'));    
    }
      //Level 3    
    function thirdChoice() {
      if (select3Node.value !== "") {
        var filterCase = objetLevel3[0].subLevelN2.filter(function(arr) {
          return arr.value === select3Node.value;
        });
        secondaryRecipientProd.value   = objetLevel3[0].secondaryRecipientProd;
        secondaryRecipientNoProd.value = objetLevel3[0].secondaryRecipientNoProd;
        E.formContact.user = filterCase[0].toShow;
        // remplissage "THEME" et "SUJET"        
        themeNode.value   = filterCase[0].theme;
        typeNode.value    = filterCase[0].type;
        subjectNode.value = filterCase[0].subject;
        var divFormContact = document.getElementById("idDivFormContact");

        if (filterCase[0].infoBlockDescriptif !== null 
          && filterCase[0].infoBlockDescriptif !== undefined 
          && filterCase[0].infoBlockDescriptif !== "") {
          divInfoBlockDescriptif.innerHTML = filterCase[0].infoBlockDescriptif;
        }else{
          divInfoBlockDescriptif.innerHTML  ="";
        }
        if (divInfoAlerterConseille && filterCase[0].infoAlerterConseille !== null && filterCase[0].infoAlerterConseille !== undefined && filterCase[0].infoAlerterConseille !== "") {
          divInfoAlerterConseille.innerHTML = filterCase[0].infoAlerterConseille;
        }else if (divInfoAlerterConseille){
          divInfoAlerterConseille.innerHTML  ="";
        }
        if(filterCase[0].isOneBlockInfo !== null && filterCase[0].isOneBlockInfo !== undefined && filterCase[0].isOneBlockInfo==true){
          divFormContact.classList.add("u-hide");
        }else{
          divFormContact.classList.remove("u-hide");
        }
        // étape intermédiaire avant affichage FORM        
        if (filterCase[0].bypassForm) {
          bypassForm(filterCase[0].bypassForm);
          return;
        }
        // tracking        
        document.dispatchEvent(new CustomEvent('formContactTracking.type'));
        bypassNode.hidden = true;
        eventFormContactSelect(true);
      } else {
        hideMainForm();
      }
    }

    function byPassLevel(filterCaseLevel){
      E.formContact.user = filterCaseLevel[0].toShow;
      // remplissage "THEME" et "SUJET"      
      themeNode.value   = filterCaseLevel[0].theme;
      typeNode.value    = filterCaseLevel[0].type;
      subjectNode.value = filterCaseLevel[0].subject;
      var divFormContact = document.getElementById("idDivFormContact");
      
      if (filterCaseLevel[0].infoBlockDescriptif !== null && filterCaseLevel[0].infoBlockDescriptif !== undefined && filterCaseLevel[0].infoBlockDescriptif !== "") {
        divInfoBlockDescriptif.innerHTML = filterCaseLevel[0].infoBlockDescriptif;
      } else {
        divInfoBlockDescriptif.innerHTML  ="";
      }
      if (divInfoAlerterConseille && filterCaseLevel[0].infoAlerterConseille !== null && filterCaseLevel[0].infoAlerterConseille !== undefined && filterCaseLevel[0].infoAlerterConseille !== "") {
        divInfoAlerterConseille.innerHTML = filterCaseLevel[0].infoAlerterConseille;
      } else if (divInfoAlerterConseille){
        divInfoAlerterConseille.innerHTML  ="";
      }
      if(filterCaseLevel[0].isOneBlockInfo !== null && filterCaseLevel[0].isOneBlockInfo !== undefined && filterCaseLevel[0].isOneBlockInfo==true){
        divFormContact.classList.add("u-hide");
      } else {
        if (showSendButton === false) {
          // Dans le cas d'un multi-contrats, afficher la liste des contrats sans le bouton "envoyer"          
          divFormContact.classList.add("u-hide");
          scrollToContractList = true;
        }
        else {
          divFormContact.classList.remove("u-hide");
        }
      }

      // étape intermédiaire avant affichage FORM      
      if (filterCaseLevel[0].bypassForm) {
        bypassForm(filterCaseLevel[0].bypassForm);
        return;
      }

      // tracking      
      document.dispatchEvent(new CustomEvent('formContactTracking.type'));
      bypassNode.hidden = true;
      eventFormContactSelect();
      // Surcharger le scroll par défaut pour l'affichage de la liste de contrats uniquement      
      if (scrollToContractList === true) {
        E.scrollTo({
          next: document.getElementById("titreMultiCC"),
          offset: 50 
        });
        scrollToContractList = false;
      }
    }

    function bypassForm(bypassFormObjInput) {
      var bypassFormObj = bypassFormObjInput;
      var rightCtaDisplay = bypassFormObj[0].CTAContribuable ? true : false;
      var leftCtaDisplay = bypassFormObj[0].leftCta ? true : false;
      // envoi event pour tagging      
      var event = new CustomEvent('formContact.bypassShow');
      
      document.dispatchEvent(event);
      // ajout du texte Titre + descriptif + CTA      
      bypassFormTitle.innerHTML = bypassFormObj[0].bypassFormTitle;
      bypassFormContent.innerHTML = bypassFormObj[0].bypassFormText;

      if(rightCtaDisplay){
        bypassFormRedirectCta.classList.remove('u-hide');
        bypassFormRedirectCta.innerHTML = bypassFormObj[0].CTAContribuable;
        bypassFormRedirectCta.href = bypassFormObj[0].redirectionLink;
      } else {
        bypassFormRedirectCta.classList.add("u-hide")
      }
      if(leftCtaDisplay){
        bypassFormLeftCta.classList.remove('u-hide');
        bypassFormLeftCta.innerHTML = bypassFormObj[0].leftCta;
      } else {
        bypassFormLeftCta.classList.add("u-hide")
      }

      bypassNode.hidden = false;
      hideMainForm();
    }

    showFormNode.addEventListener("click", function(e) {
      console.log("-----------> Execution beginning");
      var selectElemt1 = document.getElementById('id-select1-elmt').selectedIndex - 1;
      var selectElemt2 = document.getElementById('id-select2-elmt').selectedIndex - 1;
      var selectElemt3 = document.getElementById('id-select3-elmt').selectedIndex - 1;
      var selectedByPassForm;

      if (selectElemt3 >= 0 && !wrapSelect3Node.classList.contains("u-hide")) {
        selectedByPassForm = E.formContact.selectClient[selectElemt1].
            subLevel[selectElemt2].subLevelN2[selectElemt3].bypassForm[0];
      }
      else {
        selectedByPassForm = E.formContact.selectClient[selectElemt1].
            subLevel[selectElemt2].bypassForm[0];
      }
      if (selectedByPassForm.hasOwnProperty("codeNotificationChatbot")) {
        webchatController.notify("/contact/cel/form", {code:selectedByPassForm.codeNotificationChatbot});
      }
      trackClickBypassFormCta(e);
        console.log("-----------> Execution end");
      });
      bypassFormRedirectCta.addEventListener("click", function(e){
        trackClickBypassFormCta(e);
    });


    function trackClickBypassFormCta(e) {
      var idCtabyPassFormClickZone= ("bypassForm." + e.target.text).F_00_06_convertTCFormat();
      F_00_09_marqueClic($(this), idCtabyPassFormClickZone, {tc_clic_name: idCtabyPassFormClickZone,
        tc_clic_zone:"formulaire.bypassForm" , tc_event_type: "tracking_lien", tc_clic_type: "push_clic_component"});
    }

    function eventFormContactSelect(fromThirdChoice) {
      if (E.debug)
        console.log(E.formContact.user);

      var event = new CustomEvent('formContactSelect', {
        detail: {
          toShow: objetToShow[E.formContact.user]
        }
      });
      document.dispatchEvent(event);

      console.log(event);
      var blocVisible = !document.querySelector('[data-e-formcontact-block]').getAttribute('hidden');
      // tracking
      if(!blocVisible){
        document.dispatchEvent(new CustomEvent('formContactTracking.contenu'));
      }
    }

    function hideMainForm() {
      mainFormNode.hidden = true;
      mainFormNode.disabled = true;
    }

    function initOptionLevel1() {
      // on prend le bon objet (connecté vs non connecté)
      objetLevel1 = checkConnexion();

      // on s'assure de cacher: 2d select, form principal et "bypass"
      wrapSelect2Node.classList.add("u-hide");
      hideMainForm();
      bypassNode.hidden = true;

      // init Select1Node opions
      initOption(select1Node, objetLevel1);

      formContactSelect.hidden   = false;
      formContactSelect.disabled = false;

      E.scrollTo({
        next: formContactSelect,
        offset: 200
      });
    }

    initOptionLevel1();

    if (!init) {
      select1Node.addEventListener("change", firstChoice);
      select2Node.addEventListener("change", secondChoice);
      select3Node.addEventListener("change", thirdChoice);//  //Level 3
      showFormNode.addEventListener("click", eventFormContactSelect);
      init = true;
    }
  };


  // cacher questions et partie principale
  var hideFormContactBottom = function() {
    var mainFormNode = document.querySelector('[data-e-formcontact-main]');

    formContactSelect.hidden   = true;
    formContactSelect.disabled = true;

    mainFormNode.hidden   = true;
    mainFormNode.disabled = true;
  };


  // on écoute formContactClient.js
  if (formContactSelect) {
    document.addEventListener('formContactClient.show', initFormContactSelect);
    document.addEventListener('formContactClient.hide', hideFormContactBottom);
  }

})(window, document, window.E || {});
