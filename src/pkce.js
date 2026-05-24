import { webcrypto as crypto } from 'crypto';

export async function generatePKCE() {
  console.log('in generatePKCE');
  const code_verifier = generateRandomString();

  const encoder = new TextEncoder();
  const data = encoder.encode(code_verifier);
  const sha256 = await crypto.subtle.digest('SHA-256', data);

  let str = '';
  const bytes = new Uint8Array(sha256);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i]);
  }

  const code_challenge = btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return { code_verifier: code_verifier, code_challenge: code_challenge };
}

function dec2hex(dec) {
  return ('0' + dec.toString(16)).substr(-2);
}

function generateRandomString() {
  const array = new Uint32Array(56 / 2);
  crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join('');
}
