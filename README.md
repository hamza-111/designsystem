# ENGIE REBORN

- Task runner: **Gulp**
- CSS: **Sass** (aucun framework CSS), méthode **BEM**
- HTML: **Pug**
- JS: vanilla JS (si possible)

**Des guidelines CSS, JS et HTML sont disponibles à la racine du projet, merci de vous y référer.**

---


# Préparer l'environnement de travail

- Installer [Node 8.x](https://nodejs.org/dist/latest-v8.x/) et [Yarn](https://yarnpkg.com/latest.msi)

- Paramétrer le proxy pour NPM
    ```
    > npm config set strict-ssl false
    > npm config set registry "https://registry.npmjs.org/"
    > npm config set proxy http://proxygin.melinda.local:8080
    > npm config set https-proxy http://proxygin.melinda.local:8080
    ```

- Installer gulp globalement
    ```
    > yarn global add gulp gulp-cli
    ```

- Installer toutes les dépendances
    ```
    > yarn install
    ```

---

# Travail sur un Kit

Tout se passe dans le répertoire **src**, ne **JAMAIS** modifier les fichiers dans les répertoires **dist** et **temp**, il seront systématiquement écrasés !

## Créer un nouveau composant

Inspirez-vous des composants déjà existants.

* Choisissez un nom simple et suffisamment générique (en camelCase)
* Utilisez ce nom pour créer le répertoire, les fichiers, les classes
* Importez le nouveau SCSS dans le **_global.scss** (racine du répertoire "components")
* Inclure le nouveau Pug de mixin dans **mixins.pug** (racine du répertoire "components")
* demo.pug est là pour la démo du composant

Exemple :
```
components/
    modal/
        demo.pug
        modal.pug
        modal.js
        _modal.scss

    _global.scss
    mixins.pug
```

## Ajouter une page

* Copier + renommer une page pour vous en servir de base.
* Editer **server.js** en ajoutant votre page dans le array **"routes"**
* **block variables** : éditer les variables globales de la page

## JavaScript

Vous pouvez utiliser boilerplate.js comme base.
Evitez d'utiliser jQuery.
Pensez à expliquer le fonctionnement dans un commentaire en début de script :

```
/*
  Description:
  ...

  HTML:
  ...

  JS usage:
  ...
*/
```

En règle générale : **Pensez à commenter votre code !**

## Commencer votre travail

Pour lancer **Browser-sync**, **Express** et **builder les assets** placez-vous dans le répertoire de votre choix et faites :

```
> gulp
```

- kit common : http://localhost:4011
- kit header : http://localhost:4021
- kit vente : http://localhost:4041
- kit cel : http://localhost:4051
- kit headerCel : http://localhost:4071
- kit suivie conso : http://localhost:4091

---

# GIT et livraisons

Les branches se créées toujours depuis la branche **dev**, les Merge Requests se font vers la branche **dev**.

## How to

On ne push JAMAIS sur **master** et exceptionnellement sur **dev** : toujours créer des branches et faire des Merge Requests.

Créer une branche :
- `git checkout -b nom_de_branche`

Récupérer une branche sur **origin** :
- `git fetch origin -P`
- `git checkout nom_de_branche`

Faire un commit :
- `git add .`
- `git commit -m "1036: texte de commit"`

Faire une Merge Request :
- `git push origin nom_de_branche`
- Créer la Merge Request sur Gitlab vers la **dev**
- Assigner la à un autre développeur pour la peer review

Régulièrement maintenir à jour ses branches, surtout sa branche **dev** :
- `git checkout nom_de_branche`
- `git pull origin nom_de_branche`


## Déploiements

Version DEV :
- `git checkout dev`
- `git pull origin dev`
- se placer à la racine du projet
- `npm run deploy:dev`

Version MASTER (avec création de tags) :
- `git checkout dev`
- `git pull origin dev`
- se placer à la racine du projet
- `npm version minor` (ou `patch`, ou `major`)

# point d'ATTENTION
les node_modules doivent etre iso avec l'équipe. prévenir en cas de d'updrade pour éviter de probable erreur au niveau du gulp.

---

# Vendors utilisés

## CSS
- Reset CSS Eric Meyer (http://meyerweb.com/eric/tools/css/reset)
- include-media (http://include-media.com)

## JS
- AB-mediaQuery (https://github.com/lordfpx/AB-mediaQuery)
- AB-interchange (https://github.com/lordfpx/AB-interchange)
- slick.js (http://kenwheeler.github.io/slick/)
- js.cookie.js (https://github.com/js-cookie/js-cookie)
- Flatpikr (https://chmln.github.io/flatpickr)

## Polyfills
- String.prototype.startsWith
- String.prototype.endsWith
- window.CustomEvent
- classList
- matchMedia
- element.closest()

---

# Tips
- En cas d'erreur de type `Error: listen EADDRINUSE :::xxxx` dans le terminal

```
taskkill /F /IM node.exe
```
"# mixinGulp" 
"# front-reborn-tr" 
