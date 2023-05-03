/*
  Description:
  -----------

*/

;(function (window, document, E, undefined) {
  'use strict';

  E.scrollTo = function(options) {
    // settings
    var next     = options.next,
        source   = options.source || false,
        center   = options.center || false,
        offset   = options.offset || 0,
        duration = options.duration || 600;

    var wrapper,
        currentPosition = 0,
        nextPosition    = 0,
        diffPosition    = 0,
        startTime       = null,
        currentTime     = 0,
        nextHeight      = next.offsetHeight,
        windowHeight    = window.innerHeight,
        bodyScrollTo    = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    // fonction de déplacement
    function move(val) {
      if (wrapper) {
        wrapper.scrollTop = val;
      } else {
        window.scrollTo(0, val);
      }
    }

    // fonction de easing
    function easeInOutQuad(t, b, c, d) {
      t /= d/2;
      if (t < 1) { return c/2*t*t + b; }
      t--;
      return -c/2 * (t*(t-2) - 1) + b;
    }

    // calcul animation avec requestAnimationFrame
    function animateScroll(time) {
      if (time === undefined) time = new Date().getTime();
      if (startTime === null) startTime = time;

      currentTime = time - startTime;

      // on scroll...
      var val = easeInOutQuad(currentTime, currentPosition, diffPosition, duration);
      move(val);

      // on continue jusqu'à la fin...
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    }

    // reset valeurs nécessaires
    if (source) {
      wrapper         = source.closest('.c-fullModal'); // la modale de l'application ("estimation")
      currentPosition = wrapper ? wrapper.scrollTop : bodyScrollTo;
      nextPosition    = source.offsetTop + source.offsetHeight;

      // si l'étape est plus petite que la fenêtre, on centre
      if (nextHeight < windowHeight) {
        if (center) {
          nextPosition = nextPosition - offset / 2 - (windowHeight - nextHeight) / 2;
        }
      // sinon on calle en haut de l'écran
      } else {
        nextPosition = wrapper ? nextPosition - offset : nextPosition;
      }

    } else {
      currentPosition = bodyScrollTo;
      nextPosition = E.getCoords(next).top - offset;
    }

    // bloquer scroll à la souris (bug sous Chrome)
    function blockMouseWheel(e) {
      if (currentTime <= duration) e.preventDefault();
    }

    document.addEventListener('mousewheel', blockMouseWheel);

    // on a besoin de la différence
    diffPosition = nextPosition - currentPosition;

    requestAnimationFrame(animateScroll);
  };

})(window, document, window.E || {});
