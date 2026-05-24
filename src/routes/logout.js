import express from 'express';
import { config } from '../config.js';
import { cookieHelpers } from '../cookie.js';

const router = express.Router();

router.get('/:clientId', (req, res) => {
  console.log('clearing token cookies');
  cookieHelpers.setSecure(res, 'app.at', '', 0);
  cookieHelpers.setSecure(res, 'app.rt', '', 0);
  cookieHelpers.setReadable(res, 'app.at_exp', '', 0);
  cookieHelpers.setReadable(res, 'app.idt', '', 0);

  const queryParams = {
    redirect_uri: req.query.redirect_uri,
    client_id: req.params.clientId,
  };

  const fullUrl = generateUrl(queryParams);

  res.redirect(fullUrl);
});

function generateUrl(queryParams) {
  const query = new URLSearchParams(queryParams);
  return `${config.fusionAuthBaseUrl}/oauth2/logout?${query}`;
}

export default router;
