/*
  Description:
  -----------
  Récupérer la valeur d'un paramètre dans l'URL

  JS usage:
  --------
  E.getUrlParameter('toto');
*/

;(function (window, document, E, undefined) {

  'use strict';

  E.getUrlParameter = function(paramName) {
    var paramsString = window.location.search.substring(1),
        paramList    = paramsString.split('&'),
        param        = [];

    for (var i = 0, len = paramList.length; i < len; i++) {
      param = paramList[i].split('=');

      if (param[0] === paramName) {
        return param[1];
      }
    }
  };

})(window, document, window.E || {});