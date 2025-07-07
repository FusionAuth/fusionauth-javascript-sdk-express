const express = require('express');
const { fusionAuthClient } = require('../fusionAuthClient.js')
const cookie = require('../cookie.js');

const router = express.Router();

router.get('/', async (req, res) => {
  console.log('In /me...');
  const access_token = req.cookies['app.at'];

  console.log(`Access token from cookie: ${access_token}`);
  const decodedAccessToken = cookie.getDecompressedValue(access_token);
  console.log('Decoded access token:', decodedAccessToken);       

  if (!access_token) {
    console.log('Access token missing')
    res.sendStatus(401);
    return
  }

  try {
    const user = await fusionAuthClient('/oauth2/userinfo', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    })

    res.status(200).send(user)
  } catch (error) {
    res.status(500).send(error)
  }
});

module.exports = router;
