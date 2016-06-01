/*jslint node: true, stupid: true */
'use strict';
var fs = require('fs');

module.exports = function (server, config) {
  fs.readdirSync('./routes').forEach(function (file) {
    if (file.substr(-3, 3) === '.js' && file !== 'index.js') {
      require('./' + file.replace('.js', ''))(server, config);
    }
  });
};
