# ACCORDEON

## Démo

[voir la demo + source de l'accordéon (gulp doit etre lancé)](http://localhost:3011/pages/_component-accordion.html)


## Source

```
src\components\accordion
```

## HTML

Classes nécessaires pour un fonctionnement indépendant :
```
c-accordion avec c-accordion--alone
c-accordion__tab
c-accordion__label
```

Classes nécessaires pour une utilisation dans un autre composant (aucun styles) :
```
c-accordion
c-accordion__tab
c-accordion__label
```

## Attributs

Liste des attributs nécessaires :
```
  data-e-accordion='{"jsSlideAnimation": true, "multiselectable": true}'
  data-e-accordion-tab id="tab1" (aria-expanded="true" pour ouvrir à l'ouverture)
  data-e-accordion-panel aria-labelledby="tab1"
```

## JS

Options facultatives (passer plutôt par data-e-accordion)
```
  $0.eAccordion();

  $0.eAccordion({
    jsSlideAnimation: true, // slide animé en JS
    multiselectable:  true  // ouverture multiple
  });
```

Règles d'accessibilité suivies :
http://www.accede-web.com/notices/interface-riche/accordeons/