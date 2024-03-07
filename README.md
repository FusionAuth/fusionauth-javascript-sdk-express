# Example: server implementation for FusionAuth Web SDKs.
[FusionAuth Web SDKs](https://github.com/FusionAuth/fusionauth-javascript-sdk) can be used one of 2 ways:
1. By hosting your own server that performs the OAuth token exchange and meets the [server code requirements for FusionAuth Web SDKs](https://github.com/FusionAuth/fusionauth-javascript-sdk-express#server-code-requirements).
2. By using the server hosted on your FusionAuth instance, i.e., not writing your own server code.

If you are hosting your own server, this repo serves as an example. This example uses JavaScript and [express](https://expressjs.com/), but you can write your server however you'd like as long as it meets the [server code requirements](https://github.com/FusionAuth/fusionauth-javascript-sdk-express#server-code-requirements).

## Setup
From the root directory, run `npm install`, then `npm run start`. You should see the console output `FusionAuth example server listening on port 9000`.

## Server code requirements
Your server must have the following endpoints:

#### `GET /app/login`

This endpoint must:

1.  Generate PKCE code.
    a. The code verifier should be saved in a secure HTTP-only cookie.
    b. The code challenge is passed along
2.  Encode and save `redirect_url` from react app to `state`.
3.  Redirect browser to `/oauth2/authorize` with a `redirect_uri` to `/app/token-exchange`

[Example implementation](https://github.com/FusionAuth/fusionauth-javascript-sdk-express/blob/main/routes/login.js)

#### `GET /app/callback`

This endpoint must:

1.  Call
    [/oauth2/token](https://fusionauth.io/docs/v1/tech/oauth/endpoints#complete-the-authorization-code-grant-request)
    to complete the Authorization Code Grant request. The `code` comes from the request query parameter and
    `code_verifier` should be available in the secure HTTP-only cookie, while
    the rest of the parameters should be set/configured on the server
    side.

2.  Once the token exchange succeeds, read the `app.at` from the
    response body and set it as a secure, HTTP-only cookie with the same
    name.

3.  If you wish to support refresh tokens, repeat step 2 for the
    `app.rt` cookie.

4.  Save the expiration time in a readable `app.at_exp` cookie.  And save the `app.idt` id token in a readable cookie.

5.  Redirect browser back to encoded url saved in `state`.

4.  Call
    [/oauth2/userinfo](https://fusionauth.io/docs/v1/tech/oauth/endpoints#userinfo)
    to retrieve the user info object and respond back to the client with
    this object.

[Example implementation](https://github.com/FusionAuth/fusionauth-javascript-sdk-express/blob/main/routes/callback.js)

#### `GET /app/register`

This endpoint is similar to `/login`.  It must:

1.  Generate PKCE code.
    a. The code verifier should be saved in a secure HTTP-only cookie.
    b. The code challenge is passed along
2.  Encode and save `redirect_url` from react app to `state`.
3.  Redirect browser to `/oauth2/register` with a `redirect_uri` to `/app/callback`

[Example implementation](https://github.com/FusionAuth/fusionauth-javascript-sdk-express/blob/main/routes/register.js)

#### `GET /app/me`

This endpoint must:

1.  Use `app.at` from cookie and use as the Bearer token to call `/oauth2/userinfo`
2.  Return json data

[Example implementation](https://github.com/FusionAuth/fusionauth-javascript-sdk-express/blob/main/routes/me.js)

#### `GET /app/logout`

This endpoint must:

1.  Clear the `app.at` and `app.rt` secure, HTTP-only
    cookies.
2.  Clear the `app.at_exp` and `app.idt` secure cookies.
3.  Redirect to `/oauth2/logout`

[Example implementation](https://github.com/FusionAuth/fusionauth-javascript-sdk-express/blob/main/routes/logout.js)

#### `POST /app/token-refresh` (optional)

This endpoint is necessary if you wish to use refresh tokens. This
endpoint must:

1.  Call
    [/oauth2/token](https://fusionauth.io/docs/v1/tech/oauth/endpoints#refresh-token-grant-request)
    to get a new `app.at` and `app.rt`.

2.  Update the `app.at`, `app.at_exp`, `app.idt`, and `app.rt` cookies from the
    response.

[Example implementation](https://github.com/FusionAuth/fusionauth-javascript-sdk-express/blob/main/routes/refresh.js)