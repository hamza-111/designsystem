/*
  Description:
  Banner only for mobile
  the Banner propose to dowload the Gaz Tarif Réglementé's App
*/

;(function(window, document, E, undefined){

  'use strict';

  document.addEventListener('DOMContentLoaded', function(){
    var osUserAgent       = navigator.userAgent,
        bannerApp         = document.querySelector('[data-tpl="bannerApp"]'),
        listUserAgentTest = (/Android|iPhone|Windows Phone/i.test(osUserAgent)),
        localStorageTest  = Cookies.get('e-bannerApp') !== 'closed',
        metaAppsId        = E.bannerApp;

    // N'activer que si nécessaire
    if ( !(AB.mediaQuery.is('smallOnly') && listUserAgentTest && localStorageTest && bannerApp) )
      return;

    var tplBannerApp       = bannerApp.innerHTML,
        tplLayoutBannerApp = document.querySelector('[data-e-bannerapp]'),
        iPhoneTest         = /iPhone/i.test(osUserAgent),
        WindowsTest        = /Windows Phone/i.test(osUserAgent),
        AndroidTest        = /Android/i.test(osUserAgent),
        data               = { url: '' };

    // load the bannerApp in the element and get the url
    function appearBannerApp() {
      var metaRexContent = (/app-id=([^\s,]+)/),
          metaId         = '';

      if (iPhoneTest) {
        metaId = metaRexContent.exec(metaAppsId.iOS)[1];
        data.url =  'https://itunes.apple.com/fr/app/id'+ metaId;

      } else if (AndroidTest) {
        metaId = metaRexContent.exec(metaAppsId.Android)[1];
        data.url = "http://play.google.com/store/apps/details?id="+ metaId;
      }

      if (iPhoneTest || AndroidTest) {
        tplLayoutBannerApp.innerHTML = E.templateEngine(tplBannerApp, data);
        document.documentElement.classList.add('has-bannerApp');
        closeBanner();
      }
    }

    // close banner
    function closeBanner() {
      var btnClose = document.querySelector('[data-e-bannerapp-close]');

      if (!btnClose) return;

      btnClose.addEventListener('click' , function() {
        Cookies.set('e-bannerApp', 'closed', { expires: 7 });
        tplLayoutBannerApp.style.display = 'none';
      });
    }

    // on initialise tout
    appearBannerApp();
  });
})(window, document, window.E || {});



