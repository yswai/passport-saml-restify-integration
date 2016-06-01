/*jslint node: true, indent: 2 */
'use strict';

var passport = require('passport');
var restify, bunyan, routes, log, server;

restify = require('restify');
bunyan  = require('bunyan');
routes  = require('./routes/');

var CookieParser = require('restify-cookies');
var sessions = require("client-sessions");

log = bunyan.createLogger({
  name        : 'saml',
  level       : process.env.LOG_LEVEL || 'info',
  stream      : process.stdout,
  serializers : bunyan.stdSerializers
});

server = restify.createServer({
  name : 'saml',
  log  : log,
  formatters : {
    'application/json' : function (req, res, body, cb) {
      res.setHeader('Cache-Control', 'must-revalidate');

      // Does the client *explicitly* accepts application/json?
      var sendPlainText = (req.header('Accept').split(/, */).indexOf('application/json') === -1);

      // Send as plain text
      if (sendPlainText) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      }

      // Send as JSON
      if (!sendPlainText) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      }
      return cb(null, JSON.stringify(body));
    }
  }
});

var config = require('./config/config')[process.env.NODE_ENV || 'development'];
var bootPassport = require('./config/passport')(passport, config);

server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.use(sessions({
  // cookie name dictates the key name added to the request object
  cookieName: 'session',
  // should be a large unguessable string
  secret: 'yoursecret',
  // how long the session will stay valid in ms
  duration: 365 * 24 * 60 * 60 * 1000
}));
server.use(CookieParser.parse);
server.pre(restify.pre.sanitizePath());
server.use(passport.initialize());
server.use(passport.session());

/*jslint unparam:true*/
// Default error handler. Personalize according to your needs.
server.on('uncaughtException', function (req, res, route, err) {
  console.log('******* Begin Error *******');
  console.log(route);
  console.log('*******');
  console.log(err.stack);
  console.log('******* End Error *******');
  if (!res.headersSent) {
    return res.send(500, { ok : false });
  }
  res.write("\n");
  res.end();
});
/*jslint unparam:false*/

server.on('after', restify.auditLogger({ log: log }));
routes(server, config);

console.log('Server started.');
server.listen(3001, function () {
  log.info('%s listening at %s', server.name, server.url);
});
