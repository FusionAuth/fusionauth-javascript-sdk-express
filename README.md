# Example: FusionAuth Web SDKs Server Implementation

This repository provides an example server implementation for [FusionAuth Web SDKs](https://github.com/FusionAuth/fusionauth-javascript-sdk). FusionAuth Web SDKs can be utilized in one of two ways:

1. Hosting Your Own Server: Implementing a server that handles OAuth token exchange and fulfills the [server code requirements for FusionAuth Web SDKs](https://github.com/FusionAuth/fusionauth-javascript-sdk-express#server-code-requirements).
2. Using the FusionAuth Hosted Server: Leveraging the server hosted on your FusionAuth instance, eliminating the need to write your own server code.

If you opt for hosting your own server, this repository will serve as an example. The provided example is in JavaScript and utilizes [Express](https://expressjs.com/). If you opt to implement your own server you are free to use any technology stack as long as it meets the server code requirements.

## Setup

To get started, follow these steps:

1. From the root directory, run `npm install`.
2. Rename the `.env.example` file to `.env` and update the values with your FusionAuth details.
3. Run `npm run start`.

You should observe the console output `🚀 Server running on port 9000`.

## Server code requirements

The endpoints described below serve as a summary of requirements and expected behaviors of each endpoint. For additional details on these endpoints you can reference the [Hosted Backend documentation](https://fusionauth.io/docs/apis/hosted-backend).

Your server must have the following endpoints:

#### `GET /app/login`

This endpoint must:

1.  Generate PKCE code.
    - The code verifier should be saved in a secure **HTTP-only** cookie.
    - The code challenge is passed along
2.  Encode and save `redirect_url` from the client app to `state`.
3.  Redirect browser to `/oauth2/authorize` with a `redirect_uri` to `/app/token-exchange`

[Example implementation](https://github.com/FusionAuth/fusionauth-javascript-sdk-express/blob/main/routes/login.js)

#### `GET /app/callback`

This endpoint must:

1.  Call
    [/oauth2/token](https://fusionauth.io/docs/v1/tech/oauth/endpoints#complete-the-authorization-code-grant-request)
    to complete the Authorization Code Grant request. The `code` comes from the request query parameter and
    `code_verifier` should be available in the secure **HTTP-only** cookie, while
    the rest of the parameters should be set/configured on the server
    side.

2.  Once the token exchange succeeds, read the `app.at` from the
    response body and set it as a secure, **HTTP-only** cookie with the same
    name.

3.  If you wish to support refresh tokens, repeat step 2 for the
    `app.rt` cookie.

4.  Save the expiration time in a readable `app.at_exp` cookie. This value should be represented as seconds since the epoch.

5.  And save the `app.idt` id token in a readable cookie.

6.  Redirect browser back to encoded url saved in `state`.

[Example implementation](https://github.com/FusionAuth/fusionauth-javascript-sdk-express/blob/main/routes/callback.js)

#### `GET /app/register`

This endpoint is similar to `/login`. It must:

1.  Generate PKCE code.
    - The code verifier should be saved in a secure **HTTP-only** cookie.
    - The code challenge is passed along
2.  Encode and save `redirect_url` from the client app to `state`.
3.  Redirect browser to `/oauth2/register` with a `redirect_uri` to `/app/callback`

[Example implementation](https://github.com/FusionAuth/fusionauth-javascript-sdk-express/blob/main/routes/register.js)

#### `GET /app/me`

This endpoint must:

1.  Use `app.at` from cookie and use as the Bearer token to call `/oauth2/userinfo`
2.  Return json data

[Example implementation](https://github.com/FusionAuth/fusionauth-javascript-sdk-express/blob/main/routes/me.js)

#### `GET /app/logout`

This endpoint must:

1.  Clear the `app.at` and `app.rt` secure, **HTTP-only**
    cookies.
2.  Clear the `app.at_exp` and `app.idt` secure cookies.
3.  Redirect to `/oauth2/logout`

[Example implementation](https://github.com/FusionAuth/fusionauth-javascript-sdk-express/blob/main/routes/logout.js)

#### `POST /app/refresh` (optional)

This endpoint is necessary if you wish to use refresh tokens. This
endpoint must:

1.  Call
    [/oauth2/token](https://fusionauth.io/docs/v1/tech/oauth/endpoints#refresh-token-grant-request)
    to get a new `app.at` and `app.rt`.

2.  Update the `app.at`, `app.at_exp`, `app.idt`, and `app.rt` cookies from the
    response.

[Example implementation](https://github.com/FusionAuth/fusionauth-javascript-sdk-express/blob/main/routes/refresh.js)

## Upgrade Policy

This library may periodically receive updates with bug fixes, security patches, tests, code samples, or documentation changes.

These releases may also update dependencies, language engines, and operating systems, as we\'ll follow the deprecation and sunsetting policies of the underlying technologies that the libraries use.

This means that after a dependency (e.g. language, framework, or operating system) is deprecated by its maintainer, this library will also be deprecated by us, and may eventually be updated to use a newer version.

# Change Log

### 2.0.0

#### Breaking Changes

- Modified routes to match FusionAuth API changes in 1.45.0.

#### Enhancements

- Change config.js to use environment variables
- Automatically restart the dev server when changes are detected
- Added linting and formatting along with enforcement via pre-commit hook
