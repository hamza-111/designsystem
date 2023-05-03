/*
  Description:
  -----------
  Mini template engine
  Tutoriel: http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
  Version plus récente: https://github.com/krasimir/absurd/blob/master/lib/processors/html/helpers/TemplateEngine.js

  HTML:
  ----
  JS supporté (possible d'étendre) :
  var | if | for | else | switch | case | break

  <script data-tpl="voteEspritService" type="text/template">
    <div>[% this.truc %]</div>
    [% if (this.machin) { %]
      <div>...</div>
    [% } %]
  </script>

  JS usage:
  --------
  var templateX = document.querySelector('[data-tpl="templateX"]').innerHTML,
      data = {
        truc: 'xxx',
        machin: true
      };

  E.templateEngine(templateX, data); // data est un objet
*/

;(function (window, document, E, undefined) {

  /* jshint ignore:start */
  // ignorer du linting à cause du new Function indispensable ici!

  E.templateEngine = function(html, options) {
    var re     = /\[%(.+?)%\]/g,
        reExp  = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
        code   = 'with(obj) { var r=[];\n',
        cursor = 0,
        result,
        match;

    var add = function(line, js) {
      js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
        (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
      return add;
    };

    while (match = re.exec(html)) {
      add(html.slice(cursor, match.index))(match[1], true);
      cursor = match.index + match[0].length;
    }

    add(html.substr(cursor, html.length - cursor));
    code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, ' ');

    try {
      result = new Function('obj', code).apply(options, [options]);
    } catch(err) {
      console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n");
    }

    return result;
  };

  /* jshint ignore:end */

})(window, document, window.E || {});