/*
  formContact-fieldsetsDisplay.js
*/

;(function (window, document, E, undefined) {

  'use strict';

  var formContactNode = document.querySelector('[data-e-formcontact]'),
      mainFormNode    = document.querySelector('[data-e-formcontact-main]');

  function initUpdateDisplay(e) {
    var elementsNode = document.querySelectorAll('[data-e-formcontact-block]');
    var bloc = document.querySelector('[data-e-formcontact-block]');
    
    for (var i = 0, len = elementsNode.length; i < len; i++) {
      updateDisplay(elementsNode[i], e.detail.toShow);
    }
    // code for dev back
    if(document.getElementById("resilRadioBtn").disabled) {
      toggleContestationTitle(false);
    } else {
        toggleContestationTitle(true);
    }
    
    showMainForm();
    reinitModeUpload();
    
    if(!bloc.hidden){ 
      document.dispatchEvent(new CustomEvent('formContactTracking.testNoForm'));
    }
    
    ifModeUpdateFileObligatory();

    // -- end code for dev back
  }

  function updateDisplay(el, toShow) {
    if (toShow.indexOf(el.eFormContactBlock.id) > -1)
      el.eFormContactBlock.show();
    else
      el.eFormContactBlock.hide();
  }

  function toggleContestationTitle(inputToggle){
    var contestationTitle = document.querySelectorAll("#beforeContactedRadioBtn h3")[0];
    if(inputToggle){
      contestationTitle.classList.add('u-hide');
    } else {
      contestationTitle.classList.remove('u-hide');
    }
  }
  
  // code for dev back
  function ifModeUpdateFileObligatory(){
    $('input[type=radio]input[name="DEJA_RESILIE"]').change(function() {
      var contactFormRadioResil = document.querySelector('input[name="DEJA_RESILIE"]:checked');
      if(contactFormRadioResil.value === "oui"){
        setObligatoryModeUpload();
      }else{
        reinitModeUpload();
      }
    });
  }
  // end code for dev back

  function setObligatoryModeUpload(){
    document.getElementById("contact-upload-file").setAttribute("required", "required");
    document.getElementById("updateFileMode").innerText = "obligatoire";
    document.getElementById("updateFileMode").style.color = "red";
  }

  function reinitModeUpload(){
    if(document.querySelector('input[name="DEJA_RESILIE"]:not(:checked)')){
      document.getElementById("contact-upload-file").removeAttribute("required", "required");
      document.getElementById("updateFileMode").innerText = "optionnel";
      document.getElementById("updateFileMode").style.color = "inherit";
    }
  }

  function showMainForm() {
    mainFormNode.removeAttribute('hidden');
    mainFormNode.disabled = false;

    E.scrollTo({
      next: mainFormNode,
      offset: 50
    });
  }

  // mise à jour des fieldset suivant choix utilisateur
  document.addEventListener('formContactSelect', initUpdateDisplay);

})(window, document, window.E || {});
