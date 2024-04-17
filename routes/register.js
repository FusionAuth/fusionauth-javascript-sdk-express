const express = require("express");
const config = require("../config.js");
const cookie = require("../cookie.js");
const pkce = require("../pkce.js");
const redirectState = require("../redirectState.js");

const router = express.Router();

router.get("/", async (req, res) => {
  console.log("accepting request for register");

  console.log(`client_id is ${req.query.client_id}`);
  const newState = redirectState.pushRedirectUrlToState(
    req.query.redirect_uri,
    req.query.state
  );

  const code = await pkce.generatePKCE();
  cookie.setSecure(res, "codeVerifier", code.code_verifier);
  const redirect_uri = `${req.protocol}://${req.get("host")}/app/callback`;
  const queryParams = {
    client_id: req.query.client_id,
    scope: 'openid offline_access',
    response_type: "code",
    redirect_uri: redirect_uri,
    code_challenge: code.code_challenge,
    code_challenge_method: "S256",
    state: newState,
  };
  const fullUrl = generateUrl(queryParams);

  res.redirect(fullUrl);
});

function generateUrl(queryParams) {
  const query = new URLSearchParams(queryParams);
  return `${config.fusionAuthBaseUrl}/oauth2/register?${query}`;
}

module.exports = router;
