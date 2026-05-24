import express from 'express';
import { config } from '../config.js';
import { cookieHelpers } from '../cookie.js';
import { generatePKCE } from '../pkce.js';
import { pushRedirectUrlToState } from '../redirectState.js';

const router = express.Router();

router.get('/:clientId', async (req, res) => {
  console.log('accepting request for login');

  console.log(`Client ID is: ${req.params.clientId}`);
  const newState = pushRedirectUrlToState(
    req.query.redirect_uri,
    req.query.state
  );
  console.log(`newState is ${newState}`);
  const code = await generatePKCE();
  cookieHelpers.setSecure(res, 'codeVerifier', code.code_verifier);
  const token_exchange_uri = `${req.protocol}://${req.get(
    'host'
  )}/app/callback`;

  const queryParams = {
    client_id: req.params.clientId,
    scope: req.query.scope ?? 'openid offline_access',
    response_type: 'code',
    redirect_uri: token_exchange_uri,
    code_challenge: code.code_challenge,
    code_challenge_method: 'S256',
    state: newState,
  };
  const fullUrl = generateUrl(queryParams);

  res.redirect(fullUrl);
});

function generateUrl(queryParams) {
  const query = new URLSearchParams(queryParams);
  return `${config.fusionAuthBaseUrl}/oauth2/authorize?${query}`;
}

export default router;
