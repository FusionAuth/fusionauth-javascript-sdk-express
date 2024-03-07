const express = require('express');
const config = require('../config.js');
const cookie = require('../cookie.js');

const router = express.Router();

router.get('/', (req, res) => {
  const idToken = req.cookies['app.idt'];
  console.log("clearing token cookies");
  cookie.setSecure(res, 'app.at', '', 0);
  cookie.setSecure(res, 'app.rt', '', 0);
  cookie.setReadable(res, 'app.at_exp', '', 0);
  cookie.setReadable(res, 'app.idt', '', 0);

  const queryParams = {
    post_logout_redirect_uri: req.query.post_logout_redirect_uri,
  };
  if (req.query.client_id) {
    queryParams.client_id = req.query.client_id;
  } else {
    queryParams.id_token_hint = idToken ?? '';
  }

  const fullUrl = generateUrl(queryParams);

  res.redirect(fullUrl);
});

function generateUrl(queryParams) {
  const query = new URLSearchParams(queryParams);
  return `${config.fusionAuthBaseUrl}/oauth2/logout?${query}`;
}

module.exports = router;
