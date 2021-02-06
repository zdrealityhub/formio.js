const fs = require('fs');
const path = require('path');
const through = require('through2');

module.exports = function() {
  return through.obj(function(file, encoding, callback) {
    try {
      const { base, relative } = file;
      const relativeDirPath = path.dirname(path.join(base, relative));
      let contents = file.contents.toString('utf8');
      contents = contents.replace(/{%-\s*include\('([^']+)'\)\s*%}/g, (wholeMatch, includePath) => {
        if (!includePath) return wholeMatch;

        const filePath = path.join(relativeDirPath, includePath);
        return fs.readFileSync(filePath, 'utf8');
      });

      file.contents = Buffer.from(contents);
      return callback(null, file);
    } catch (ex) {
      return callback(ex);
    }
  });
};
