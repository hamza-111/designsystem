/*
  Description:
  -----------
  Keycodes (qui se souvient des keycodes ?)

  JS usage:
  --------
  $(document).on('keydown', function(e) {
    var keycode = e.which;
    if (E.keyNames[keycode] === 'escape') {
      // ...
    }
  });
*/

;(function(window, document, E, undefined){

  'use strict';

  E.keyNames = {
    help: {
      "E.keyNames[e.keycode]":
        "Facilite les vérification des touches pressées, exemple : if (E.keyNames[e.keyCode] === 'enter') { ... }"
    },
    40: 'down',
    38: 'up',
    37: 'left',
    39: 'right',
    9:  'tab',
    17: 'ctrl',
    13: 'enter',
    27: 'escape',
    32: 'space',
    33: 'prev',
    34: 'next',
    36: 'start',
    35: 'end',
    16: 'shift'
  };

})(window, document, window.E || {});