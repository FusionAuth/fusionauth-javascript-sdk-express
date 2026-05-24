/* eslint-disable no-undef */
export const config = {
  // FusionAuth info (copied from the FusionAuth admin panel)
  clientId: `${process.env.AUTH_CLIENT_ID}`,
  clientSecret: `${process.env.AUTH_CLIENT_SECRET}`,
  fusionAuthBaseUrl: `${process.env.AUTH_BASE_URL}`,

  // port this server runs on
  serverPort: `${process.env.PORT}`,
};
