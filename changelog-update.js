var pkg = require('./package.json');
var fs  = require('fs');

fs.readFile('./changelog.md', 'utf8', function(err, data) {
  if (err) return console.log(err);

  var result = data.replace('## Current', '## Current\n\n\n## '+ pkg.version);

  fs.writeFile('./changelog.md', result, 'utf8', function(err) {
    if (err) return console.log(err);
  });
});