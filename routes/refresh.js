const express = require('express');
const { fusionAuthClient, getFormURLEncodedPayload } = require('../fusionAuthClient.js');
const config = require('../config.js');
const cookie = require('../cookie.js');

const router = express.Router();

router.post('/', async (req, res) => {
  if (!req.cookies['app.rt']) {
    res.sendStatus(400);
    return;
  }

  try {
    const fusionAuthResponse = await fusionAuthClient('/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: getFormURLEncodedPayload({
        'client_id': config.clientID,
        'client_secret': config.clientSecret,
        'grant_type': 'refresh_token',
        'refresh_token': req.cookies['app.rt'],
        'access_token': req.cookies['app.at'],
      })
    })

    const { access_token, id_token, refresh_token, expires_in } = fusionAuthResponse
    if (!(access_token && refresh_token)) {
      res.sendStatus(503);
      return
    }

    cookie.setSecure(res, 'app.at', access_token);
    cookie.setSecure(res, 'app.rt', refresh_token);

    const expires_in_ms = expires_in * 1000;
    cookie.setReadable(res, 'app.at_exp', Date.now() + expires_in_ms, expires_in_ms);
    cookie.setReadable(res, "app.idt", id_token);

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500)
  }
});

module.exports = router;