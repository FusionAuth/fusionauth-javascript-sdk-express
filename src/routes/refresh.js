import express from 'express';
import {
  fusionAuthClient,
  getFormURLEncodedPayload,
} from '../fusionAuthClient.js';
import { config } from '../config.js';
import { cookieHelpers } from '../cookie.js';

const router = express.Router();

router.post('/:clientId', async (req, res) => {
  if (!req.cookies['app.rt']) {
    res.sendStatus(400);
    return;
  }

  try {
    const fusionAuthResponse = await fusionAuthClient('/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: getFormURLEncodedPayload({
        client_id: req.params.clientId,
        client_secret: config.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: req.cookies['app.rt'],
        access_token: req.cookies['app.at'],
      }),
    });

    const { access_token, id_token, refresh_token, expires_in } =
      fusionAuthResponse;
    if (!(access_token && refresh_token)) {
      res.sendStatus(503);
      return;
    }

    cookieHelpers.setSecure(res, 'app.at', access_token);
    cookieHelpers.setSecure(res, 'app.rt', refresh_token);

    const expires_in_ms = expires_in * 1000;
    cookieHelpers.setReadable(
      res,
      'app.at_exp',
      (Date.now() + expires_in_ms) / 1000
    );
    cookieHelpers.setReadable(res, 'app.idt', id_token);

    res.sendStatus(204);
  } catch {
    res.sendStatus(500);
  }
});

export default router;
