# Styleguide options

### Head

    link(rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,700")
    link(rel="stylesheet" href="../css/common.css")

    link(rel='stylesheet' href='https://cdn.rawgit.com/styledown/styledown/v1.0.2/data/styledown.css')
    script(src='https://cdn.rawgit.com/styledown/styledown/v1.0.2/data/styledown.js')

    script(src="https://code.jquery.com/jquery-1.8.1.min.js")
    script(src="../js/haut/modernizr-custom.js")
    script(src="../js/haut/init.js")
    script(src="../js/bas/vendors.js")
    script(src="../js/bas/common.js")
    style.
      .container {
        margin: 50px;
      }
      .fill {
        background: rgba(0,0,255,.2);
        box-shadow: inset 0 0 1px red;
        padding: 2px 5px;
        min-height: 20px;
      }
      img[data-ab-interchange] {
        width: 200px;
      }
      div.icon, div.icon-contrib{ font-size:35px; }
      h2.sg {
        cursor: pointer;
      }
      .sg-colors-bg > *,
      .sg-colors-txt > * {
        float: left;
        width: 200px;
        height: 60px;
        padding: 5px;
      }
      .sg-colors-bg:after,
      .sg-colors-txt:after {
        content: '';
        display: table;
        clear: both;
      }
      .sg-canvas {
        position: relative;
      }

      [class*="sg-section-iconfonts"] section {
        background-color: rgba(0,0,0,.1);
        padding: 5px;
        display: inline-block;
        vertical-align: top;
        width: 150px;
      }
      [class*="sg-section-iconfonts"] .sg-text,
      [class*="sg-section-iconfonts"] .sg-example {
        float: none;
        width: 100%;
      }
      [class*="sg-section-iconfonts"] .sg-canvas {
        margin: 0 auto;
        color: #000;
        width: 100px;
        height: 100px;
        display: block;
      }
      div.iconVente, div.icon-contrib, div.icon {
        font-size: 80px;
        background-color: white;
      }
      [class*="sg-section-iconfonts"] h3 {
        display: none;
      }
      [class*="sg-section-iconfonts"] p code.sg {
        background-color: white;
        display: block;
        min-height: 40px;
      }
    script.
      $(function(){
        var $h2           = $('h2.sg'),
            $allSections  = $('section.sg-block');

        $h2.addClass('is-closed');
        $allSections.addClass('u-visibilityHidden');

        $h2.on('click', function(){
          var $this = $(this);

          if ($this.hasClass('is-closed')) {
            $h2.addClass('is-closed');
            $allSections.addClass('u-visibilityHidden');
            $this.removeClass('is-closed');
            $this.closest('.sg-section').find('section.sg-block').removeClass('u-visibilityHidden');
          } else {
            $h2.addClass('is-closed');
            $allSections.addClass('u-visibilityHidden');
          }
        });
      });


### Body

    .container
      h1 Gaz Tarif Réglementé UI kit
      div#styleguides(sg-content)


    script
