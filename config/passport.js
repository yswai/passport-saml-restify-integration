var SamlStrategy = require('passport-saml').Strategy;

module.exports = function (passport, config) {

	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});

	passport.use(new SamlStrategy(
	  {
	    path: config.passport.saml.path,
	    entryPoint: config.passport.saml.entryPoint,
	    issuer: config.passport.saml.issuer
	  },
	  function(profile, done) {
			console.log(`Received SAML profile ${JSON.stringify(profile, null, 2)}`);
			return done(null,
				{
					id : profile.nameID,
					email : profile.EmailAddress,
					displayName : [profile.LastName, profile.FirstName].join(', '),
					firstName : profile.FirstName,
	  			lastName : profile.LastName
				});
	  })
	);

};
