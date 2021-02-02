const fs = require('fs');
const path = require('path');
require('./env');

const template = path.resolve(process.argv[2]);
const target = path.resolve(process.argv[3]);

fs.existsSync(template);

fs.readFile(template, function (err, tmpl) {
  const content = Object.keys(process.env).reduce(
    (result, key) => result.replace(`$\{${key}}`, process.env[key]),
    tmpl.toString()
  );

  fs.writeFileSync(target, content);
});
