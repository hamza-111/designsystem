# GUIDELINE CSS

Les styles sont groupés par composants. 1 composant = 1 fichier Sass. Veillez à bien organiser les styles et les fichiers Sass.

**Support à partir de IE 9**

## Syntaxe

* Indentation de 2 espaces (pas de tabulation).
* 1 espace entre le sélecteur et l'accolade.
* Les deux points sont collés à la règle avec 1 espace avant la valeur.
* 1 règle par ligne.
* 1 ligne vide entre les blocs.
* Utilisation de camelCase pour meilleure lisibilité de la méthode BEM.

```
[selector] {
  [property]: [value];
  [property]: [value];
}
```

Il est possible de mettre sur 1 seule ligne lorsqu'il n'y a qu'une seule règle. Dans ce cas, mettre un espace entre la règle et les accolades :

```
[selector] { [property]: [value]; }
```

## A respecter

* **Eviter les sélecteurs complexes**. Limitez-vous à des sélecteurs d'1 classe et, si nécessaire, complétez le sélecteur avec prudence. Il faut être particulièrement attentif avec Sass de ne pas trop utiliser le nesting.

* **Tous les hacks doivent être commentés.**

* Les classes d'état ne doivent avoir **que** des style d'état.

* Les font-size sont en REM

* Grille maison : http://codepen.io/lordfpx/pen/gMWYby?editors=1100

* Le soulignement des liens doit, si possible, se faire par une bordure et non text-decoration

* **Eviter de styler à partir de tags HTML, d'ID, d'attributs**, sauf si c'est pertinent (attributs **aria** par ex.) : https://www.smashingmagazine.com/2007/07/css-specificity-things-you-should-know/

* **Ne pas annuler le style "outline"**, sinon prévoir une alternative CSS visible.


## Conseils

* **!important** n'est pas interdit, mais il doit être utilisé avec réflexion. Il peut être pertinent sur des classes d'état ("is-active", etc.).

* Eviter la syntaxe Sass de type **&__toto**, sauf pour les modificateurs (&--center), les pseudo-elements et pseudo-classes.


## Optimisations

* Les éléments **fixed** sont redessinés pendant le scroll, pour prévenir ça: `transform: translateZ(0);`

* pour autoPrefixer, attention à IE, il ne prefixe pas s'il y a des transform 3D (comme `transform: translateZ(0);`), forcer le style -ms- dans ce cas:
  ```
  -ms-transform: translateX(0);
      transform: translateZ(0) translateX(0);
  ```