# GUIDELINE JS

Les scripts sont géré par composant.

## Syntaxe

* Tabulation de 2 espaces.
* Utilisation exclusive de single quotes
* 1 espace avant et à l'intérieur des accolades, si sur une seule ligne.
  ```
  function test() { console.log('test'); }
  ```

* 1 espace entre les instructions de contrôle et la parenthèse :
  ```
  if (isJedi) { fight(); }
  ```

* Préfixer les objets jQuery d'un $
  ```
  var $myDiv = $('#myDiv');
  ```

* Préfixer les Nodes de 'Node'
  ```
  var isClientTargetNode = document.querySelector('[data-formcontact-client-target]');
  ```

* Respectez les règles définies par la configuration de jsHint (regarder le terminal pour les erreurs et warnings !).

* Ne jamais mettre de virgule à la fin d'un objet ou d'un tableau.
  ```
  var object = {
    toto: 'dfsdf',
    bobo: ''
  };
  ```

## A respecter

* Basez vous sur le boilerplate disponible dans assets/js pour commencer vos scripts.

* Les variables et fonctions sont en anglais.

* Les commentaires sont en français.

* S'appuyer sur des **data-attributs exclusivement** pour initialiser les scripts (http://roytomeij.com/blog/2012/dont-use-class-names-to-find-HTML-elements-with-JS.html. Vous pouvez aussi vous appuyer sur les classes d'état ("is-opened", etc.).

* Utiliser les **data-attributs** (`data-e-xxx`) pour passer des options, des valeurs, etc.

* Ne créez **aucune** variable globale, utilisez l'objet global **E** si nécessaire.

* Englober les scripts dans une **IIFE**.

* Déclarez les variables le plus tôt possible et préparer le type si possible:
  ```
  var string = "";
  var array = [];
  ```

* Si un objet est utilisé plus d'1 fois, **le mettre en cache**.

* "Debounce" les events les plus gourmands: resize, scroll... ou utiliser requestAnimationFrame
  ```
  $(window).scroll(E.debounce(function(e) {
    ...
  }, 150));
  ```

## Conseils

* **Important**: Toujours penser à l'accessibilité, dynamiser les attributs aria dans les scripts (http://www.accede-web.com/notices/interface-riche/)

* Quelques best practices jQuery : http://lab.abhinayrathore.com/jquery-standards/
