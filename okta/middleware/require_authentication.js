const OktaJwtVerifier = require('@okta/jwt-verifier');
require('dotenv').config();

const OKTA_DOMAIN = process.env.ISSUER;
const CLIENT_ID = process.env.CLIENT_ID;

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: OKTA_DOMAIN,
  clientId: CLIENT_ID,
  assertClaims: {
    aud: 'api://default',
  },
});

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    return res.status(401).end();
  }

  const accessToken = match[1];
  const expectedAudience = 'api://default';

  return oktaJwtVerifier
    .verifyAccessToken(accessToken, expectedAudience)
    .then((jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
};
