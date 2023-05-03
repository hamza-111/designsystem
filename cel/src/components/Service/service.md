# Composant Service

## Description :

le composants comporte 3 composants et 1 sous composant.
- composant serviceActive
- composant serviceNonActive
- composant autreService
- sous composant serviceItem

## Description fonctionnel :

- le sous composant serviceItem represent les "services" ou "options" activable (traitement coté dev back)
- elles sont affichés dans chacune des 3 composants *serviceActive*, *serviceNonActive* et *autreService*


# Dépendance(s) :

- le serviceActive utilise le composant *carousel* de REBORN avec le plugin *slick*
http://kenwheeler.github.io/slick/

NOTE : particularité du composnt *serivceActive* :
les sous-composant serivceItem sont contenu dans un block Slider, un css modificateur spécifique s'applique sur ce dernier des lors qu'il devient enfant du composant *serviceActive*

##service.scss

@import "serviceNonActive/serviceNonActive";
@import "autreService/autreService";
@import "serviceItem/serviceItem";
@import "serviceActive/serviceActive";


##service.pug

include serviceNonActive/serviceNonActive
include autreService/autreService
include serviceItem/serviceItem
include serviceActive/serviceActive


## composant serviceActive
include ../serviceItem/serviceItem
include ../../../../../common/src/components/carousel/carousel

Le carousel affiche:
- 4 items en desktop
- 3 items en tablet
- 1 items en mobile

###paramatre de la mixin serviceActive###

    +serviceActive({
      vide : true
    })

parametre vide est à false par defaut.
Si true Alors le carousel ne s'affiche pas et un message s'affiche


## composant serviceNonActive
include ../serviceItem/serviceItem

## composant autreService
include ../serviceItem/serviceItem

