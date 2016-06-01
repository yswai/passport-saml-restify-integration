module.exports = {
	development : {
		passport: {
			strategy : 'saml',
			saml : {
				path : '/login/callback',
				// entryPoint : 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
				entryPoint: 'https://idp.ssocircle.com/sso/idpssoinit?metaAlias=%2Fssocircle&spEntityID=ysw-saml-restify',
				issuer : 'passport-saml'
			}
		}
	}
};
