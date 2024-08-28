const express = require("express");
const config = require("../config.js");
const cookie = require("../cookie.js");

const router = express.Router();

router.get("/:clientId", (req, res) => {
  const idToken = req.cookies["app.idt"];
  console.log("clearing token cookies");
  cookie.setSecure(res, "app.at", "", 0);
  cookie.setSecure(res, "app.rt", "", 0);
  cookie.setReadable(res, "app.at_exp", "", 0);
  cookie.setReadable(res, "app.idt", "", 0);

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

module.exports = router;
