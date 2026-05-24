import express from 'express';
import {
  fusionAuthClient,
  getFormURLEncodedPayload,
} from '../fusionAuthClient.js';
import { config } from '../config.js';
import { cookieHelpers } from '../cookie.js';
import { generateRedirectUrlFromState } from '../redirectState.js';

const router = express.Router();

router.get('/', async (req, res) => {
  console.log('accepting request for token exchange');
  const code = req.query.code;
  const codeVerifier = req.cookies.codeVerifier;
  const redirect_uri = `${req.protocol}://${req.get('host')}/app/callback`;

  try {
    // POST request to /oauth2/token endpoint
    const { access_token, id_token, refresh_token, expires_in } =
      await fusionAuthClient('/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: getFormURLEncodedPayload({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code: code,
          code_verifier: codeVerifier,
          grant_type: 'authorization_code',
          redirect_uri: redirect_uri,
        }),
      });

    if (!(access_token && refresh_token)) {
      console.log('Either refresh token or access token is missing.');
      res.sendStatus(503);
      return;
    }

    console.log('saving tokens as cookies');
    // save tokens as cookies
    cookieHelpers.setSecure(res, 'app.at', access_token);
    cookieHelpers.setSecure(res, 'app.rt', refresh_token);

    const expires_in_ms = expires_in * 1000;
    cookieHelpers.setReadable(
      res,
      'app.at_exp',
      (Date.now() + expires_in_ms) / 1000
    );
    cookieHelpers.setReadable(res, 'codeVerifier', '', 0);
    cookieHelpers.setReadable(res, 'app.idt', id_token);

    const redirectUrl = generateRedirectUrlFromState(req);

    res.redirect(redirectUrl);
  } catch (error) {
    console.error(
      '❗️ An error ocurred exchanging the auth code for an auth token.'
    );
    res.status(500).send(error);
  }
});

export default router;
