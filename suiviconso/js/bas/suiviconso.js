;(function ($, window, document, E, undefined) {

  'use strict';

  // activate debug mode
  if (document.documentElement.hasAttribute('data-debug')) {
    E.debug = true;
  }

  // IE8 needs the console object to be created
  if (!window.console) {
    window.console = {
      log: function () { },
      warn: function () { },
      error: function () { },
      time: function () { },
      timeEnd: function () { }
    };
  }

  // init AB-mediaQuery: https://github.com/lordfpx/AB-mediaQuery
  abMediaQuery({
    delay: 500
  });

  if (E.debug) {
    // display current media queries
    console.log(AB.mediaQuery.current);
    window.addEventListener('changed.ab-mediaquery', function(){
      console.log(AB.mediaQuery.current);
    });
  }

  // init AB-interchange: https://github.com/lordfpx/AB-interchange
  abInterchange({
    lazy:       false,
    delay:      100,
    offscreen:  1.5
  });


  $(document).ajaxComplete(function(event, xhr, settings) {
    // vérification du format de réponse (HTML)
    try {
      $(xhr.responseText);
    } catch(e) {
      return;
    }

    // re-init AB-interchange in xhr
    if ($(xhr.responseText).find('[data-ab-interchange]').length > 0) {
      abInterchange({
        lazy:       false,
        delay:      100,
        offscreen:  1.5
      });
    }

    // reinit des plugins
    E.launchUpdaters();
  });

})(jQuery, window, document, window.E || {});
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
/*
  Description:
  ...

  HTML:
  ...

  JS usage:
  Initialisation :
  E.plugins.wizard(); // avec éventuellement des paramètres

  Appeler une méthode de l'extérieur :
  $0.eWizard.isValid();
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eWizard', 
      attr       = 'data-e-wizard', 
      defaults   = {
        step: '',
        ignor: false
      };

  // Our constructor
  function Plugin(el, options) { //argument "option" is optionel when we want override the params
    this.el = el;

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);
    
    this.inputEl    = this.el.querySelectorAll(".c-inputMat__field, .c-radioStyle__field, .c-radioMat__field");
    this.radio      = this.el.querySelectorAll('.c-radioStyle__fieldBorder')
    this.btn        = this.el.querySelector(".c-baseBtn ");
    this.linkReturn = this.el.querySelector('.js-foyerSimilaire_retour');

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();

      return this;
    },

    events: function() {
      var that = this;

      for (var i = 0; i < this.inputEl.length; i++) {
        
        if (E.debug) {
          if(this.inputEl[i].type === "tel")
            this.inputEl[i].addEventListener('keyup', this.isValid.bind(this));

          if(this.inputEl[i].type === "radio") {
            that.inputEl[i].parentNode.parentNode.addEventListener('click', that.isValid.bind(this));//parentNode Fixe for IE
          }
        } else {
          if(!this.settings.ignor) {
            if(this.inputEl[i].type === "tel")
            this.inputEl[i].addEventListener('keyup', this.isValid.bind(this));
  
            if(this.inputEl[i].type === "radio") {
              that.inputEl[i].parentNode.parentNode.addEventListener('click', that.isValid.bind(this));//parentNode Fixe for IE
            }
          }
        }


      }

      this.btn.addEventListener('click', this.nextStep.bind(this));
      
      if (this.linkReturn)
        this.linkReturn.addEventListener('click', this.prevStep.bind(this));

      return this;
    },

    // methods
    isValid: function(e) {

        for (var i = 0; i < this.inputEl.length; i++) {
        
          if( !this.inputEl[i].checkValidity() ) {
            this.btn.setAttribute('disabled', 'disabled');
            this.btn.classList.add('is-disabled');

            return;
          } else {
            this.btn.removeAttribute('disabled');
            this.btn.classList.remove('is-disabled');
          }
        }
      return this;
    },
    
    // for the stepper (timeline)
    _nexLineStep: function(goTo) {
      this.wizardstep = document.querySelectorAll('[data-e-wizardstep]');

      for(var j = 0; j < this.wizardstep.length; j++ ) {
        var attrValueEl = this.el.getAttribute(attr),
            attrValueWizardstep = this.wizardstep[j].getAttribute("data-e-wizardstep");

        if (this.settings.step === attrValueWizardstep) {
          this.wizardstep[j].removeAttribute('disabled');
          this.wizardstep[j].classList.add("is-done");
          this.wizardstep[j].classList.remove("is-current");
          
          if (goTo === "next") {
            if(this.wizardstep[j].nextElementSibling) {
              this.wizardstep[j].nextElementSibling.classList.add("is-current");
              this.wizardstep[j].nextElementSibling.classList.add("is-done");
              this.wizardstep[j].nextElementSibling.removeAttribute("disabled");
            }
          } else {
            this.wizardstep[j].previousElementSibling.classList.add("is-current");
          }
        }
      }
    },

    nextStep: function(e) {
      if (this.el.nextElementSibling) {
        this.el.classList.add('u-visibilityHidden');
        this.el.nextElementSibling.classList.remove('u-visibilityHidden');
        this.el.classList.remove('is-active');
        this.el.nextElementSibling.classList.add('is-active');
        this._nexLineStep("next");
      }

      return this;
    },

    prevStep: function(e) {
      e.preventDefault();
      this.el.classList.add('u-visibilityHidden');
      this.el.classList.remove('is-active');
      this.el.previousElementSibling.classList.remove('u-visibilityHidden');
      this.el.previousElementSibling.classList.add('is-active');
      this._nexLineStep("prev");
      
      return this;
    }
  };

  E.plugins[pluginName] = function(options) {
    var elements = document.querySelectorAll('['+ attr +']');
    for (var i = 0, len = elements.length; i < len; i++) {
      if (elements[i][pluginName]) continue;
      elements[i][pluginName] = new Plugin(elements[i], options);
    }
  };

  document.addEventListener('DOMContentLoaded', function(){
    E.plugins[pluginName]();
    E.updaters[pluginName] = function() {
      E.plugins[pluginName]();
    };
  });

})(window, document, window.E || {});

/*
  Description:
  ...

  HTML:
  ...

  JS usage:
  Initialisation :
  E.plugins.wizardLineStep(); // avec éventuellement des paramètres

  Appler une méthode de l'extérieur :
  $0.wizardStepper.goStep();
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'wizardStepper', 
      attr       = 'data-e-wizardStepper', 
      defaults   = {
        aString: '',
        aBolean: true
      };

  // Our constructor
  function Plugin(el, options) { //argument "option" is optionel when we want override the params
    this.el = el;
    this.link = this.el.querySelectorAll('[data-e-wizardStep]');
    this.step = document.querySelectorAll('[data-e-wizard]');
  
    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};
    this.settings   = E.extend(true, defaults, options, dataOptions);
    
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.events();
      return this;
    },

    events: function() {
      var that = this;
      for(var j = 0; j < this.link.length; j++ ) {
        this.link[j].addEventListener('click' , this.goStep.bind(this));
      }

      return this;
    },

    //methods

    goStep: function(e) {
      var getAttrTarget = e.target.getAttribute('data-e-wizardStep');

      this.stepActive = document.querySelector('[data-e-wizard].is-active');
      this.selector = '.c-inputMat__field, .c-radioStyle__field, .c-radioMat__field';
      this.StepValidity = this.stepActive.querySelector(this.selector).checkValidity(); 

      if(this.StepValidity) {

        this.stepActive.classList.add('u-visibilityHidden');
        this.stepActive.classList.remove('is-active');
        
        for (var i = 0; i < this.link.length; i++) {
          this.link[i].classList.remove('is-current');
        }

        e.target.classList.add('is-current');

        // check same value ith data-e-wizard and data-e-wizardStepper
        for (var a = 0; a < this.step.length; a++) {
          this.tempStep = this.step[a].getAttribute('data-e-wizard');
          this.jsonParse = JSON.parse(this.tempStep);
          
          if (this.jsonParse.step === getAttrTarget) {
            this.step[a].classList.add('is-active');
            this.step[a].classList.remove('u-visibilityHidden');
          }
        }
      }
    }


  };

  E.plugins[pluginName] = function(options) {
    var elements = document.querySelectorAll('['+ attr +']');
    for (var i = 0, len = elements.length; i < len; i++) {
      if (elements[i][pluginName]) continue;
      elements[i][pluginName] = new Plugin(elements[i], options);
    }
  };

  document.addEventListener('DOMContentLoaded', function(){
    E.plugins[pluginName]();
    E.updaters[pluginName] = function() {
      E.plugins[pluginName]();
    };
  });

})(window, document, window.E || {});

/*
inputMat password
*/


;(function(window, document, E, undefined){

    'use strict';
  
    var pluginName = 'eJauge',
        attr       = 'data-e-jauge';
  
    var defaults   = {};
  
    function Plugin(el, options) {
      this.el = el;
      this.animate = this.el.querySelector('.c-jaugeV2__animate');
      var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
      this.settings   = E.extend(true, defaults, options, dataOptions);
  
      this.init();
    }
  
    Plugin.prototype = {
      init: function() {
        this.events();
      },
  
      events: function() {
        var that = this;
  
          this.el.addEventListener('mouseover', that.isHovered.bind(that));
      },
  
    isHovered: function() {
        this.animate.style.display = "none";
        }
    };
  
    E.plugins[pluginName] = function(options) {
      var elements = document.querySelectorAll('['+ attr +']');
      for (var i = 0, len = elements.length; i < len; i++) {
        if (elements[i][pluginName]) continue;
        elements[i][pluginName] = new Plugin(elements[i], options);
      }
    };
  
    document.addEventListener('DOMContentLoaded', function(){
      E.plugins[pluginName]();
      E.updaters[pluginName] = function() {
        E.plugins[pluginName]();
      };
    });
  
  })(window, document, window.E || {});
  
  
/*
  Description:
  ...

  HTML:
  ...

  JS usage:
  Initialisation :
  E.plugins.eErrorMail(); // avec éventuellement des paramètres

  Appler une méthode de l'extérieur :
  $0.eErrorMail.showError();
*/


;(function($, window, document, E, undefined){

  'use strict';

  var pluginName = 'eErrorMail', // a naming convention with our 'e' inside
      attr       = 'data-e-errorMail', // to prevent collision with other data-attributes, '-e-'
      defaults   = {
        aString: '',
        aBolean: true
      }; // default options (always list ALL possible options here with default values)

  // Our constructor
  function Plugin(el, options) { //argument "option" is optionel when we want override the params
    this.el = el;
    this.message    = document.querySelectorAll('[data-e-errorMail-message]');
    this.body    = document.querySelector("body");
    this.bloc     = document.querySelectorAll(".c-objectifMain");

    // options taken from data-attribute
    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};

    // merge: defaults, specified when calling plugin and data-attribute
    this.settings   = E.extend(true, defaults, options, dataOptions);

    // we init the plugin
    this.init();
  }

  Plugin.prototype = {
    // all actions when doing init (usually building DOM, binding events)
    init: function() {
      this.events();

      // that allows us to chain methods,
      // for ex.: this.init().events() is possible
      return this;
    },

    events: function() {
      // sometimes it's needed to assign 'this' into a var
      // in order to use it side by side with other 'this'.
      // After that, always use 'that' for the plugin instance
      // to make code more readable (not mixing 'this' and 'that' everywhere)
      var that = this;

      // we need to call the 'this.showError' method with 'that' as context.
      // Reminder: The 'this' value is given from the caller of the function,
      // Here, it's the clicked element, not the actual context of the plugin.

      this.body.addEventListener('click', this.hideError.bind(this));
      
      this.el.addEventListener('click', this.showError.bind(this));

      return this;
    },

    // Miscellaneous method

    hideError: function() {
      var email = document.getElementById('client_email').value;
      for (var i = 0; i < this.message.length; i++) {
        this.message[i].classList.add("u-hide");
        if(email == '') {
          this.bloc[i].style.height = "auto";
        }
        else {
          this.bloc[i].style.height = "450px";
        }
      }
        return this;
    },

    showError: function(e) {
      e.stopPropagation();
      for (var j = 0; j < this.message.length; j++) {
        this.message[j].classList.remove("u-hide");
        this.bloc[j].style.height = "auto";
      }
        return this;
    }
  };

  E.plugins[pluginName] = function(options) {
    var elements = document.querySelectorAll('['+ attr +']');
    for (var i = 0, len = elements.length; i < len; i++) {
      if (elements[i][pluginName]) continue;
      elements[i][pluginName] = new Plugin(elements[i], options);
    }
  };

  document.addEventListener('DOMContentLoaded', function(){
    E.plugins[pluginName]();
    // when we use ajax, init again the plugin
    E.updaters[pluginName] = function() {
      E.plugins[pluginName]();
    };
  });

})(jQuery, window, document, window.E || {});

/*
  Description:
  ...

  HTML:
  ...

  JS usage:
  Initialisation :
  E.plugins.eErrorMail(); // avec éventuellement des paramètres

  Appler une méthode de l'extérieur :
  $0.eErrorMail.showError();
*/


;(function($, window, document, E, undefined){

  'use strict';

  var pluginName = 'eErrorMail', // a naming convention with our 'e' inside
      attr       = 'data-e-errorMail', // to prevent collision with other data-attributes, '-e-'
      defaults   = {
        aString: '',
        aBolean: true
      }; // default options (always list ALL possible options here with default values)

  // Our constructor
  function Plugin(el, options) { //argument "option" is optionel when we want override the params
    this.el = el;
    this.message    = document.querySelectorAll('[data-e-errorMail-message]');
    this.body    = document.querySelector("body");
    this.bloc     = document.querySelectorAll(".c-objectifMain");

    // options taken from data-attribute
    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)) : {};

    // merge: defaults, specified when calling plugin and data-attribute
    this.settings   = E.extend(true, defaults, options, dataOptions);

    // we init the plugin
    this.init();
  }

  Plugin.prototype = {
    // all actions when doing init (usually building DOM, binding events)
    init: function() {
      this.events();

      // that allows us to chain methods,
      // for ex.: this.init().events() is possible
      return this;
    },

    events: function() {
      // sometimes it's needed to assign 'this' into a var
      // in order to use it side by side with other 'this'.
      // After that, always use 'that' for the plugin instance
      // to make code more readable (not mixing 'this' and 'that' everywhere)
      var that = this;

      // we need to call the 'this.showError' method with 'that' as context.
      // Reminder: The 'this' value is given from the caller of the function,
      // Here, it's the clicked element, not the actual context of the plugin.

      this.body.addEventListener('click', this.hideError.bind(this));
      
      this.el.addEventListener('click', this.showError.bind(this));

      return this;
    },

    // Miscellaneous method

    hideError: function() {
      var email = document.getElementById('client_email').value;
      for (var i = 0; i < this.message.length; i++) {
        this.message[i].classList.add("u-hide");
        if(email == '') {
          this.bloc[i].style.height = "auto";
        }
        else {
          this.bloc[i].style.height = "450px";
        }
      }
        return this;
    },

    showError: function(e) {
      e.stopPropagation();
      for (var j = 0; j < this.message.length; j++) {
        this.message[j].classList.remove("u-hide");
        this.bloc[j].style.height = "auto";
      }
        return this;
    }
  };

  E.plugins[pluginName] = function(options) {
    var elements = document.querySelectorAll('['+ attr +']');
    for (var i = 0, len = elements.length; i < len; i++) {
      if (elements[i][pluginName]) continue;
      elements[i][pluginName] = new Plugin(elements[i], options);
    }
  };

  document.addEventListener('DOMContentLoaded', function(){
    E.plugins[pluginName]();
    // when we use ajax, init again the plugin
    E.updaters[pluginName] = function() {
      E.plugins[pluginName]();
    };
  });

})(jQuery, window, document, window.E || {});

;(function(window, document, E, undefined) {

  'use strict';

  document.addEventListener("DOMContentLoaded", function() {
    if (!document.getElementById('c-saisieIndexDate'))
    return;

    var event = new Date();
    var options = { year: 'numeric', month: 'long', day: 'numeric' };

    var inputDate = document.getElementById("c-saisieIndexDate");
    inputDate.value = event.toLocaleDateString('fr-DE', options);

  });


})(window, document, window.E || {});
/*
inputMat password
*/


;(function(window, document, E, undefined){

  'use strict';

  var pluginName = 'eSousMenu',
      attr       = 'data-e-sous-menu';

  var defaults   = {};

  function Plugin(el, options) {
    this.el = el;
    this.scrollPos = 0;
    this.nav = this.el.querySelectorAll('[' + attr + '] a');

    var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
    this.settings   = E.extend(true, defaults, options, dataOptions);

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      document.querySelector('html').style.scrollBehavior = "smooth";
      this.events();
    },

    events: function() {
      var that = this;
      for (var i = 0, len = this.nav.length; i < len; i++) {
        this.nav[i].addEventListener('click', that.goTo.bind(that));
      }

      document.addEventListener('scroll', that.scrollNav.bind(that));
      //document.addEventListener('scroll', that.readScroll.bind(that));
    },

    goTo: function(e) {

      var clickedTab = e.currentTarget;
      var getId = clickedTab.getAttribute('target');
      location.href = "#"+getId;
      
      var uri = window.location.toString();
      if (uri.indexOf("#") > 0) {
        var clean_uri = uri.substring(0,
        uri.indexOf("#"));

        window.history.replaceState({},
        document.title, clean_uri);
      }

      // for (var i = 0, len = this.nav.length; i < len; i++) {
      //   this.nav[i].classList.remove("is-active");      
      // }
      // clickedTab.classList.add("is-active");
      // var target = document.querySelector('#' + getId);
      // E.scrollTo({
      //   next: target,
      //   offset: 90
      // });
    },
    scrollNav: function() {
      for (var i = 0, len = this.nav.length; i < len; i++) {
        var getId = this.nav[i].getAttribute('target');
        var target = document.querySelector('#' + getId);
        var navBarHeight = target.getBoundingClientRect().top;
        var height = target.offsetHeight;
        this.nav[i].classList.remove("is-active");
        if((navBarHeight < 160) && (navBarHeight > ((height * -1)+160))) {
          this.nav[i].classList.add("is-active");
        }
      }
    }
  };

  E.plugins[pluginName] = function(options) {
    var elements = document.querySelectorAll('['+ attr +']');
    for (var i = 0, len = elements.length; i < len; i++) {
      if (elements[i][pluginName]) continue;
      elements[i][pluginName] = new Plugin(elements[i], options);
    }
  };

  document.addEventListener('DOMContentLoaded', function(){
    E.plugins[pluginName]();
    E.updaters[pluginName] = function() {
      E.plugins[pluginName]();
    };
  });

})(window, document, window.E || {});


/*
inputMat password
*/


;(function(window, document, E, undefined){

    'use strict';
  
    var pluginName = 'eSpeedScroll',
        attr       = 'data-e-speed-scroll';
  
    var defaults   = {};
  
    function Plugin(el, options) {
      this.el = el;
      
      this.scroll_position = 0;
      this.scroll_direction;
      this.timer = undefined;
      this.prior = window.scrollY;
      this.scrolling = false;
      this.target = document.querySelector(".c-headerCel--sousMenu")
  
      var dataOptions = E.isJson(this.el.getAttribute(attr)) ? JSON.parse(this.el.getAttribute(attr)): {};
      this.settings   = E.extend(true, defaults, options, dataOptions);
  
      this.init();
    }
  
    Plugin.prototype = {
      init: function() {
        this.events();
      },
  
      events: function() {
        var that = this;
          document.addEventListener('scroll', that.scrollVelocity.bind(that));
      },
  

      scrollVelocity : function(e) {
        this.scroll_direction = (document.body.getBoundingClientRect()).top > this.scroll_position ? true : false;
        this.scroll_position = (document.body.getBoundingClientRect()).top;
        //console.log(this.scroll_direction);
        if (this.scroll_direction) {
            //console.log( Math.abs(window.scrollY - this.prior))
            if (Math.abs(window.scrollY - this.prior) > 80) {
                this.target.classList.add("c-headerCel--sousMenuPartiel");
            }
          //end scroll velocity  
        }
        else {
            console.log("down");
            this.target.classList.remove("c-headerCel--sousMenuPartiel");
        }
        this.prior = window.scrollY


      }
    };
  
    E.plugins[pluginName] = function(options) {
      var elements = document.querySelectorAll('['+ attr +']');
      for (var i = 0, len = elements.length; i < len; i++) {
        if (elements[i][pluginName]) continue;
        elements[i][pluginName] = new Plugin(elements[i], options);
      }
    };
  
    document.addEventListener('DOMContentLoaded', function(){
      E.plugins[pluginName]();
      E.updaters[pluginName] = function() {
        E.plugins[pluginName]();
      };
    });
  
  })(window, document, window.E || {});
  
  
;(function(window, document, E, undefined) {

  'use strict';

  if (!document.querySelector(".c-navAnchorEcoGest"))
    return;

  document.addEventListener("DOMContentLoaded", function() {

    // store tabs variable
    
    var myTabs = document.querySelectorAll(".js_btn");
    var myTopTabs = document.querySelectorAll(".js_Nav");
    var myMainPanes = document.querySelectorAll(".c-navAnchorEcoGest");
    var target = document.querySelector(".c-carouselEcoGest");

    // function for top header
    function myNavClicks(e) {

      var clickedTab = e.currentTarget;
      //var anchorReference = e.target;
      var activePaneId = clickedTab.getAttribute("href");
      var activePane = document.querySelector(activePaneId);

      for (var i = 0; i < myTopTabs.length; i++) {
        //myTopTabs[i].closest('.c-itemEcoGest').classList.remove("c-headerEcoGest__active");
        myTopTabs[i].classList.remove("c-headerEcoGest__active");
      }


      clickedTab.classList.add("c-headerEcoGest__active");
      e.preventDefault();
      
      for (var j = 0; j < myMainPanes.length; j++) {
        myMainPanes[j].classList.remove("c-navAnchorEcoGest__active");
      }
      
      activePane.classList.add("c-navAnchorEcoGest__active");

      E.scrollTo({
        next: target,
        offset : 110
      });
    }

    //function for tab item
    function myTabClicks(e) {
      
      var clickedTab = e.currentTarget;
      var ActiveMain = clickedTab.closest('.c-navAnchorEcoGest__active');

      var myTabs = ActiveMain.querySelectorAll(".js_btn");
      var myContentPanes = ActiveMain.querySelectorAll(".c-mainEcoGest__tab");

      var item = clickedTab.closest('.c-itemEcoGest');
      var anchorReference = e.target;
      var activePaneId = anchorReference.getAttribute("href");
      var activePane = document.querySelector(activePaneId);

      for (var i = 0; i < myTabs.length; i++) {
        myTabs[i].closest('.c-itemEcoGest').classList.remove("c-itemEcoGestActive");

      }

      item.classList.add("c-itemEcoGestActive");
      e.preventDefault();

      
      for (var j = 0; j < myContentPanes.length; j++) {
        myContentPanes[j].classList.remove("c-mainEcoGest__active");
      }
      
      activePane.classList.add("c-mainEcoGest__active");

      E.scrollTo({
        next: target,
        offset : 110
      });

    }
    // eventListner for btn item
    for (var i = 0; i < myTabs.length; i++) {
      myTabs[i].addEventListener("click", myTabClicks);
    }
    //eventListner for nav
    for (var j = 0; j < myTopTabs.length; j++) {
      myTopTabs[j].addEventListener("click", myNavClicks);
    }

    // parametre url pour contrib
    var url = window.location.search;

    var nav = url.substring(url.lastIndexOf("=")+1);
    if(nav !== undefined && nav.slice(0,3)==='nav'){
      var numNav = parseInt(nav.slice(3))-1;
      
        myTopTabs[numNav].click();
        
        var targetUrl = document.querySelector("body");
        E.scrollTo({
            next: targetUrl,
            offset : 110
        });
    }

    //social share
    (function(){
      var shareButtons = document.querySelectorAll(".share_Js");

      if (shareButtons) {
          [].forEach.call(shareButtons, function(button) {
          button.addEventListener("click", function(event) {
             var width = 650,
                height = 450;
    
            event.preventDefault();
    
            window.open(this.href, 'Share Dialog', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width='+width+',height='+height+',top='+(screen.height/2-height/2)+',left='+(screen.width/2-width/2));
          });
        });
      }
    })();

  });


})(window, document, window.E || {});
// data-e-foreign-target
// data-e-foreign-toggle


;(function($, window, document, E, undefined){
  'use strict';

  $(function() {
    var $foreign = $('[data-e-foreign-toggle]');

    if ( !$foreign.length ) return;

    var foreign = document.querySelector('[data-e-foreign-toggle]');

    function foreignToggle( namevalue, pattern1, pattern2, maxlength1, maxlength2  ){

      var $inputMat = $("input[id='"+ namevalue + "']"),
          attr = $inputMat.attr('pattern'),
          attr2 = 'pattern 2';

      if ( $inputMat.attr("pattern") === pattern1 ) {
        $inputMat.attr('pattern', pattern2)
                 .attr('maxlength',maxlength2);
      } else {
        $inputMat.attr('pattern', pattern1)
                 .attr('maxlength',maxlength1);
      }
    }

    $foreign.on("click", function(e) {
      var foreignValue = JSON.parse(this.getAttribute('data-e-foreign-toggle'));

      foreignToggle(
        foreignValue.id.name,
        foreignValue.id.pattern1,
        foreignValue.id.pattern2,
        foreignValue.id.maxlength1,
        foreignValue.id.maxlength2
      );
    });
  });
})(jQuery, window, document, window.E || {});