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