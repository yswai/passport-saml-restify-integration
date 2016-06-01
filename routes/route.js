'use strict';

var passport = require('passport');

module.exports = function (server, config) {

  server.get('/', function (req, res, next) {
      res.redirect('/home', next);
  });

  server.get('/login', passport.authenticate(config.passport.strategy, {
    successRedirect: '/home',
    failureRedirect: '/'
  }));

  server.post('/login/callback',
    passport.authenticate(config.passport.strategy,
      {
        // successRedirect: '/home',
        // failureRedirect: '/'
      }),
    function(req, res, next) {
      console.log(`[/login/callback] req.user = ${JSON.stringify(req.user, null, 2)}`);
      res.redirect('/home', next);
      // res.end(JSON.stringify(req.user, null, 2));
    }
  );

  server.get('/home', function (req, res, next) {
    console.log(`[/home] isAuthenticated = ${req.isAuthenticated()}`);
    console.log(`[/home] req.user = ${JSON.stringify(req.user, null, 2)}`);
    if (req.isAuthenticated()) {
      res.end(`User Profile : ${JSON.stringify(req.user, null, 2)}`);
    } else {
      res.redirect('/login', next);
    }
  });

  server.get('/healthcheck', function (req, res) {
    res.end('Status OK');
  });

};
