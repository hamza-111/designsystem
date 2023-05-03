/*
  espritService-comments2.js
  -------------

*/

;(function ($, window, document, E, undefined) {

  'use strict';

  // valeurs par défaut
  var currentPage = 1;
  var filter      = 'commentedonly';
  var note        = '';


  // préparation des variables:
  var codeEspritService = '';
  var lienSignalerAbus  = '';
  var feedBack          = '';
  var requestUrl        = '';
  var perPage           = 5;
  var templateAvis      = '';
  var templatePager     = '';
  var templateVote      = '';
  var $resetNote        = '';
  var $filter           = '';
  var pager             = '[data-e-pager]';
  var blockReviews      = '[data-e-es-reviews]';
  var reviewsList       = '[data-e-es-reviews-list]';


  $(function() {
    // si on est sur la bonne page...
    if ($('[data-e-es-reviews]').length) {
      var settings      = $(blockReviews).data('e-es-reviews');

      codeEspritService = settings.codeES;
      lienSignalerAbus  = settings.lienSignalerAbus;
      feedBack          = settings.feedBack;
      perPage           = settings.perPage;

      $resetNote        = $('[data-e-es-reviews-resetnote]');
      $filter           = $('[data-e-es-reviews-filter]');

      templateAvis      = document.querySelector('[data-tpl="avisEspritService"]').innerHTML;
      templatePager     = document.querySelector('[data-tpl="pagerEspritService"]').innerHTML;
      templateVote      = document.querySelector('[data-tpl="voteEspritService"]').innerHTML;

      // en local, on utilise nos fichiers "fake" simplement
      requestUrl        = settings.requestUrl + (!E.debug ? codeEspritService : '');

      bindEvents();

      // 1er affichage
      getAvisByPage();
      getNumberOfPage();
    }
  });


  function scrollToTop() {
    $('html, body').animate({
      scrollTop: $(reviewsList).offset().top - 100
    }, 250);
  }


  // request du nombre de page et des avis
  function updateReviews() {
    getAvisByPage();
    getNumberOfPage();

    // debug
    if (E.debug) console.log(currentPage, filter, note);

    scrollToTop();
  }


  // différents events
  function bindEvents() {
    var $blockReviews = $(blockReviews);

    // filtres (dropdown)
    $filter.on('change.esReviews', function() {
      handleChoixModeDeTriAvis(this.value);
    });

    // filtres (click)
    $filter.filter(':not(select)').on('click.esReviews', function(e) {
      e.preventDefault();
      handleChoixModeDeTriAvis(this.getAttribute('data-e-es-reviews-filter'));
    });

    // filtre par note
    $blockReviews.on('click.esReviews', '[data-e-es-reviews-note]', function(e) {
      e.preventDefault();
      getAvisByCodeServiceAndNote($(this).data('e-es-reviews-note'));
    });

    // pager
    $blockReviews.on('click.esReviews', pager +' button', function(e) {
      e.preventDefault();

      var rel = this.getAttribute('rel');

      // lien précédent
      if (rel === 'prev') currentPage--;

      // lien suivant
      if (rel === 'next') currentPage++;

      // numéro de page
      if (Number(this.innerText)) currentPage = Number(this.innerText);

      updateReviews();
    });

    // vote sur reviews
    $blockReviews.on('click.esReviews', '[data-e-es-reviews-vote]', function(e) {
      e.preventDefault();
      var data            = $(this).data('e-es-reviews-vote'),
          identifiantAvis = data.id,
          typeVote        = data.vote;
      voterAvisSurService(identifiantAvis, typeVote);
    });
  }


  // DOM ------------------------------------
  // HTML pagination
  function creationPagerHtml(numberOfPage) {
    var data       = {},
        indexFirst = 1,
        max        = 5,
        indexLast  = max,
        pagerHtml  =  '';

    numberOfPage   = parseInt(numberOfPage, 10);

    if (numberOfPage < indexLast) {
      indexLast = numberOfPage;
    }

    if ((currentPage % max === 0 || currentPage > indexLast) && currentPage <= numberOfPage) {
      indexFirst = currentPage;
      indexLast  = indexFirst + indexLast;

      if (indexLast > numberOfPage) {
        indexFirst = numberOfPage - max + 1;
        indexLast  = numberOfPage;
      }
    }

    // template:
    data.numberOfPage = numberOfPage;
    data.indexFirst   = indexFirst;
    data.indexLast    = indexLast;
    data.currentPage  = currentPage;

    pagerHtml += E.templateEngine(templatePager, data);

    $(blockReviews).find(pager).html(pagerHtml);
  }

  // HTML avis
  function pad(s) { return (s < 10) ? '0'+ s : s; }

  function creationHtmlCommentairesAvis(data) {
    var html       = '',
        dateObject = null,
        parts      = null,
        newDate    = null,
        dateFormat = null,
        anonyme    = "Anonyme";

    for ( var i = 0; i < data.length; i++) {
      // formater la date
      dateObject = data[i].date.split('T')[0]; //extraction de la partie date du temps
      parts      = dateObject.match(/(\d+)/g); //split pour format yyyy-mm-dd
      newDate    = new Date(parts[0], parts[1] - 1, parts[2]); //parts[1]-1: les mois sont à base de 0
      dateFormat = (pad(newDate.getDate())) + '/' + pad((newDate.getMonth() + 1)) + '/' + newDate.getFullYear();
      data[i].date   = dateFormat;

      // lienSignalerAbus
      data[i].lienSignalerAbus = lienSignalerAbus;

      // identifiantAvis
      data[i].identifiantAvis = data[i].identifiantAvis ? data[i].identifiantAvis : '';

      // verbatim
      data[i].verbatim = data[i].verbatim ? data[i].verbatim: '';

      // nomClient
      
      if (data[i].nomClient.localeCompare(anonyme) === 0)
    	  data[i].nomClient = "&laquo; Anonyme &raquo;"; // « Anonyme »
      data[i].nomClient = data[i].nomClient ? data[i].nomClient: '';

      // formater la date ExpConso
      dateObject = data[i].dateExpConso.split('T')[0]; //extraction de la partie date du temps
      parts      = dateObject.match(/(\d+)/g); //split pour format yyyy-mm-dd
      newDate    = new Date(parts[0], parts[1] - 1, parts[2]); //parts[1]-1: les mois sont à base de 0
      dateFormat = (pad(newDate.getDate())) + '/' + pad((newDate.getMonth() + 1)) + '/' + newDate.getFullYear();
      data[i].dateExpConso   = dateFormat;


      // formater la date PubAvis
      dateObject = data[i].datePubAvis.split('T')[0]; //extraction de la partie date du temps
      parts      = dateObject.match(/(\d+)/g); //split pour format yyyy-mm-dd
      newDate    = new Date(parts[0], parts[1] - 1, parts[2]); //parts[1]-1: les mois sont à base de 0
      dateFormat = (pad(newDate.getDate())) + '/' + pad((newDate.getMonth() + 1)) + '/' + newDate.getFullYear();
        data[i].datePubAvis   = dateFormat;

      // template
      html += E.templateEngine(templateAvis, data[i]);
    }

    $(reviewsList).html(html);
  }

  // HTML votes
  function creationHtmlCompteursDeVote(identifiantAvis, data){
    // identifiantAvis est retourné sous format de l'url '/identifiantAvis' du coup on enleve le slash
    data.feedBack = feedBack;
    var html = E.templateEngine(templateVote, data);
    $('[data-e-es-reviews-votes="'+ identifiantAvis +'"]').html(html);
  }
  // END DOM ---------------------------------




  // SERVICE ---------------------------------
  // Nombre de pages
  function getNumberOfPage() {
    // Appel du sevice de récupèration
    // de la liste des offres par energie et marque

    var url = requestUrl;

    // en local:
    if (E.debug) {
      url += '/fake_espritService-reviews-page.txt';
      console.log('Nombre de pages:', '/'+ perPage +'/pages/'+ (filter ? 'filter/'+ filter +'/' : '') + note);
    } else {
      url += '/'+ perPage +'/pages/'+ (filter ? 'filter/'+ filter +'/' : '') + note;
    }

    $.ajax({
      async:       false,
      url:         url,
      cache:       false,
      contentType: 'text/plain; charset=utf-8'
    })

    .done(function(data) {
      if (data && data !== "0") {
        if (currentPage === 0) currentPage = 1;
        creationPagerHtml(data);
      }
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
      // TODO: Gestion des erreurs incertaine...
      // Récupérer l'url de la page d'erreur depuis la div cachée
      var $errorPage = $("#page_erreur");

      if ((jqXHR.status === 500) && ($errorPage !== undefined) && ($errorPage.text() !== '')) {
        window.location = $errorPage.text();
      } else if (jqXHR.status === 404) {}
    });
  }

  // Récupération des avis
  function getAvisByPage() {
    // Appel du sevice de récupèration
    // de la liste des offres par energie et marque
    var url = requestUrl;

    if (E.debug) {
      url += '/fake_espritService-reviews-content.json';
      console.log('Liste des avis:', '/'+ currentPage +'/'+ perPage +'/avisClient/'+ (filter ? 'filter/'+ filter +'/' : '') + note);
    } else {
      url += '/'+ currentPage +'/'+ perPage +'/avisClient/'+ (filter ? 'filter/'+ filter +'/' : '') + note;
    }

    $.ajax({
      async:       false,
      url:         url,
      cache:       false,
      contentType: 'application/json; charset=utf-8'
    })

    .done(function(data) {
      if (data && data !== "0") {
        creationHtmlCommentairesAvis(data);
      }
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
      // TODO: Gestion des erreurs incertaine...
      // Récupérer l'url de la page d'erreur depuis la div cachée
      var $errorPage = $("#page_erreur");

      if ((jqXHR.status === 500) && ($errorPage !== undefined) && ($errorPage.text() !== '')) {
        window.location = $errorPage.text();
      } else if (jqXHR.status === 404) {
        $(reviewsList).empty();
        $(blockReviews).find(pager).empty();
      }
    });
  }

  // envoi vote
  function voterAvisSurService(identifiantAvis, typeVote) {
    // Appel du sevice de vote sur un avis et recupération des compteurs de vote de ce dernier
    var url = requestUrl + "/avisClient" +  (!identifiantAvis ? '' : '/'+ identifiantAvis) + "/vote/" + typeVote;

    if (E.debug) {
      console.log('Ajouter avis:', url);
    }

    if (E.debug) {
      // test local
      var fakeData = {CompteurP: 2, CompteurN: 18};
      creationHtmlCompteursDeVote(identifiantAvis, fakeData);
    } else {
      $.ajax({
        async:       false,
        url:         url,
        cache:       false,
        type:        'POST',
        contentType: 'application/json; charset=utf-8'
      })

      .done(function(data) {
        if (data !== null && data !== '' && data !== undefined){
          creationHtmlCompteursDeVote(identifiantAvis, data);
        }
      })

      .fail(function(jqXHR, textStatus, errorThrown) {
        // TODO: Gestion des erreurs incertaine...
        // Récupérer l'url de la page d'erreur depuis la div cachée
        if ((jqXHR.status === 500) && ($("#page_erreur") !== undefined) && ($("#page_erreur").text() !== "")) {
          window.location = $("#page_erreur").text();
        } else if (jqXHR.status === 404) {}
      });
    }
  }
  // END SERVICE ---------------------------------


  // changer le filtre (et le select)
  function setFilter(value) {
    filter = value;

    if (!value) value = '';
    if (!value || value === 'allavis') filter = ''; // = pas de filtres

    $filter.val(value);
  }

  // FILTRES
  function getAvisByCodeServiceAndNote(noteSelected) {
    currentPage = 1;
    note        = noteSelected;
    setFilter('allavis');
    $resetNote.removeClass('u-visibilityHidden');
    updateReviews();
  }

  function getAllAvis() {
    currentPage = 1;
    note        = '';
    $resetNote.addClass('u-visibilityHidden');
    setFilter('allavis');
  }

  function getAllAvisExcludUncommented() {
    currentPage = 1;
    note        = '';
    $resetNote.addClass('u-visibilityHidden');
    setFilter('commentedonly');
  }

  function getAllAvisCommentedByVote() {
    currentPage = 1;
    note        = '';
    $resetNote.addClass('u-visibilityHidden');
    setFilter('commentedbyvote');
  }

  // Appliquer Filtres
  function handleChoixModeDeTriAvis(value){
    switch(value){
      case "commentedonly":   getAllAvisExcludUncommented(); break;
      case "commentedbyvote": getAllAvisCommentedByVote(); break;
      case "allavis":         getAllAvis(); break;
      default:                return;
    }

    updateReviews();
  }

})(jQuery, window, document, window.E || {});