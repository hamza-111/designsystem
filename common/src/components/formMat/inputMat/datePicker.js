/*
  Date-picker vendor flatepickr : https://chmln.github.io/flatpickr/
  - datePicker.input et datePicker.calendarContainer sont deux méthodes de flatepickr :
    * input renvoie à l'input associé au flatpickr
    * calendarContainer renvoie à l'élément div.flatpickr-calendar du datepicker

    $0._flatpickr permet d'acéder au flatpickr sur un input.

    minDate: 'tomorrow' est une option rajoçutée par ce script (pas native)
    minDate recupere egalement la valeur de l'option
    ex :  minDate: -5 = today - 5 jours

    maxDate recupere egalement la valeur de l'option
    ex :  maxDate: 5 = today + 5 jours


*/

;(function (window, document, E, undefined) {

  'use strict';

  var attr = 'data-flatpickr';

  if (!window.flatpickr ) return;


  function initFlatpickr(el) {
    var dataOptions = E.isJson(el.getAttribute(attr)) ? JSON.parse(el.getAttribute(attr)) : {},
        defaultOptions =  {
          dateFormat: 'd/m/Y',
          allowInput: true,
          onChange : undefined,
          maxPromoDate: undefined
        },
        settings = E.extend(true, defaultOptions, dataOptions);


    // ajout d'une option 'tomorrow' non prévue par flatpickr + setting.minDate
    if (settings.minDate) {
      if (settings.minDate === 'tomorrow') {
        settings.minDate = new Date().fp_incr(1);
      }

      if (!isNaN(settings.minDate) )
        settings.minDate = new Date().fp_incr(settings.minDate);
    }

    // pour le setting.maxDate
    if (settings.maxDate) {
      if (settings.maxDate === 'tomorrow')
        settings.maxDate = new Date().fp_incr(1);

      if (!isNaN(settings.maxDate) )
        settings.maxDate = new Date().fp_incr(settings.maxDate);
    }

    // target selectedDates for appear a blocInfo
    if (settings.onChange) {
      var infoBloc = document.querySelector("[data-e-flatpickrinfo]");

      if (!isNaN(settings.maxPromoDate) )
        settings.maxPromoDate = new Date().fp_incr(settings.maxPromoDate);

      // parametre selectedDates, dateStr, instance propre au plugin voirDoc :
      // https://flatpickr.js.org/events/
      settings.onChange = function(selectedDates, dateStr, instance) {

        if (selectedDates[0] <= settings.maxPromoDate) {
          infoBloc.classList.remove("u-hide");
        } else {
          infoBloc.classList.add("u-hide");
        }
      };
    }
    window.flatpickr.localize(flatpickr.l10ns.fr); // pour la version French

      window.flatpickr(el, settings);

    if (!AB.mediaQuery.is('smallOnly'))
      flatepickrTheme(el);
  }




  function flatepickrTheme(el) {
    var regex      = /u-theme-/,
        inputMat   = el.closest('.c-inputMat'),
        inputClass = inputMat.classList;

    // recherche d'un thème pour le copier sur flatpickr
    for (var i = 0, len = inputClass.length; i < len; i++) {
      if (regex.test(inputClass[i])) {
        el._flatpickr.calendarContainer.classList.add(inputClass[i]);
      }
    }
  }

  var elements = document.querySelectorAll('.c-inputMat--datepicker input');

  for (var i = 0, len = elements.length; i < len; i++) {
    initFlatpickr(elements[i]);
  }

})(window, document, window.E || {});


