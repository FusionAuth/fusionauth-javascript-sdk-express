import { Buffer } from 'node:buffer';

// save and restore redirect_uri base64 encoded onto state
export function generateRedirectUrlFromState(req) {
  console.log(`state is ${req.query.state}`);
  const [encodedUri, savedState] = req.query.state.split(':');
  const redirectUri = Buffer.from(encodedUri, 'base64').toString('ascii');
  const queryParams = {
    state: savedState,
    locale: req.query.locale,
    userState: req.query.userState,
  };
  const query = new URLSearchParams(queryParams);
  return `${redirectUri}?${query}`;
}
export function pushRedirectUrlToState(client_redirect_uri, client_state) {
  const encodedUri = Buffer.from(client_redirect_uri).toString('base64');
  return encodedUri + ':' + client_state;
}
