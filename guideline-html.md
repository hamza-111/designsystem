# GUIDELINE HTML

Avant de commancer le moindre CSS, commencer par créer un HTML sémantique : L'ordre des données est important ainsi que l'utilisation des balises HTML5.

Le style ne doit **pas** dépendre du HTML.


## A respecter

*  ne **jamais** mettre de double dash `--` dans un commentaire HTML (bug principalement sur IE), remplacer par `- - (sans espace)`.

* Une img doit **toujours** avoir un alt rempli, sauf si c'est une img de décoration. Dans ce cas, il doit être présent, mais **vide**.

* `target="_blank"` ne devrait jamais être utilisé. S'il est nécessaire, toujours ajouter l'attribut `rel="noopener noreferrer"` (https://www.grahamcluley.com/2016/09/phishing-data-theft-await-users-target_blank-vulnerability/)

* une balise `<a>` doit correspondre à un lien vers une page ou vers une ancre. S'il s'agit uniquement d'un bouton d'action JS, utiliser un `<button type="button">`. En règle générale, penser à une utilisation sans JS et à l'accessibilité pour déterminer s'il s'agit d'un lien ou d'un bouton.

