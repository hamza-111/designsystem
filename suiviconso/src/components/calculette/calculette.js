/*
  calculette.js

  Description:
  spécificité js de ce composant permet d'obliger l'utilisateur que l'index de départ soit inférieur à l'index de fin

  HTML:
  Ajouter l'attribut [data-e-form-validation-calculer] sur un button HTML

  fonctionnalité :
  compare le block id : indexDebut et l'id :indexFin

  NOTE: evolution futur. passé la selection des blocs ID par un attribut ou une classe avec un prefix 'js_'
*/

;(function(window, document, E, undefined) {

  'use strict';

  document.addEventListener('DOMContentLoaded', function() {

    if (!document.getElementById('indexDebut'))
      return;

      var calculette      = document.querySelector('.js-calculette'),
          indexDepart     = calculette.querySelector('.js-indexDebut input'),
          indexFin        = calculette.querySelector('.js-indexFin input'),
          calculetteError = calculette.querySelector('.js-calculetteError'),
          submit          = calculette.querySelector('[data-e-form-validation-calculer]'),
          inputValue      = {};

    // Methodes
    var _disabled = function () {
      submit.classList.add('is-disabled');
      submit.setAttribute('disabled', 'disabled');
    },

    _enabled = function () {
      submit.removeAttribute('disabled');
      submit.classList.remove('is-disabled');
    },

    _showMsgError = function () {

      if ( Number(indexDepart.value) > Number(indexFin.value) && indexDepart.value!=="" && indexFin.value!=="") {
      calculetteError.classList.remove('u-hide');
      }

    },

    _hideMsgError = function () {
      calculetteError.classList.add('u-hide');
    },

    _enterShowError = function (e) {
      if ( Number(indexDepart.value) > Number(indexFin.value) && indexDepart.value!=="" && indexFin.value!=="") {

        if ( e.keyCode === 13) {
          _showMsgError();
        }

      }
    },

    _showOneError = function (e) {
      if ( !Number.isNaN(indexDepart.value) && !Number.isNaN(indexFin.value) ) {
        calculetteError.classList.add('u-hide');
      }
    },

    _scrollToResult = function () {
      var target = document.querySelector('[data-e-reponse]');

      E.scrollTo({
        next:   target,
        offset: 90
      });
    },


     calcul = function () {
      inputValue.indexDepart = Number(indexDepart.value, 10);
      inputValue.indexFin = Number(indexFin.value, 10);

      // verifier si n'y a pas des champs vide et si les 2 champs remplie la regle de gestions
      if ((( inputValue.indexDepart > inputValue.indexFin) && ( !Number.isNaN(indexDepart.value) && !Number.isNaN(indexFin.value) )) || (indexDepart.validity.valid === false || indexFin.validity.valid ===false)) {
        _disabled();
        _showMsgError();

      } else if ( ( inputValue.indexDepart < inputValue.indexFin ) && ( !Number.isNaN(indexDepart.value) && !Number.isNaN(indexFin.value) )  || (indexDepart.validity.valid === true || indexFin.validity.valid ===true)) {
        _enabled();
        _hideMsgError();

      }
    },

    errorGestion = function () {
      inputValue.indexDepart = parseInt(indexDepart.value, 10);
      inputValue.indexFin = parseInt(indexFin.value, 10);

      // verifier si n'y a pas des champs vide et si les 2 champs remplie la regle de gestions
      if (( inputValue.indexDepart > inputValue.indexFin) && ( inputValue.indexDepart !== "" || inputValue.indexFin !== "" )) {
        _showMsgError();
      }
    };
    // events


    // lancer le controle saisie lors de keyup 
    indexFin.addEventListener('keyup', calcul);
    indexDepart.addEventListener('keyup', calcul);
    
    indexFin.addEventListener('blur', errorGestion );
    indexDepart.addEventListener('blur', errorGestion );
    
    indexFin.addEventListener('keyup', _showOneError);
    indexDepart.addEventListener('keyup', _showOneError);

    indexFin.addEventListener('blur', _showOneError);
    indexDepart.addEventListener('blur', _showOneError);

    
    indexFin.addEventListener('blur', _showMsgError );
    indexDepart.addEventListener('blur', _showMsgError );

    indexFin.addEventListener('keyup', _enterShowError);
    indexDepart.addEventListener('keyup', _enterShowError);
  });


  })(window, document, window.E || {});