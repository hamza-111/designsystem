/*
  serializeForm.js

  Description:
  Retourne une sérialisation de tous les éléments valides d'un formulaire et leurs valeurs.

  E.serializeForm(formNode)
  "formNode" étant un formulaire
*/

;(function(window, document, E, undefined) {
  'use strict';

  function isRadioCheckbox(el) {
    return el.getAttribute('type') === 'checkbox' || el.getAttribute('type') === 'radio';
  }

  E.serializeForm = function(formNode) {
    var items = [],
        value = null,
        el    = null,
        obj   = {},
        formElsNode = formNode.elements;

    for (var i = 0, len = formElsNode.length; i < len; i++) {
      el = formElsNode[i];
      obj = {};

      if (isRadioCheckbox(el) && !el.checked)
        continue;

      if (el.type === 'fieldset')
        continue;

      if (el.closest('fieldset') && el.closest('fieldset').disabled)
        continue;

      if (el.name && el.value && (el.willValidate || el.type === "hidden")) {
        obj[encodeURIComponent(el.name)] = encodeURIComponent(el.value);
        items.push(obj);
      }
    }

    // var items = [],
    //     formData = (new FormData(formNode)).entries();
    // for (var pair of formData) {
    //   if (!pair[1])
    //     continue;
    //   var obj = {};
    //   obj[pair[0]] = pair[1];
    //   items.push(obj);
    // }

    return items;
  };

})(window, document, window.E || {});
