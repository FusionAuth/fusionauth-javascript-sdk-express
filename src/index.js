import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import cookieParser from 'cookie-parser';
import nocache from 'nocache';
import loginRoute from './routes/login.js';
import callbackRoute from './routes/callback.js';
import refreshRoute from './routes/refresh.js';
import logoutRoute from './routes/logout.js';
import registerRoute from './routes/register.js';
import meRoute from './routes/me.js';

(async function main() {
  await startServer();
})();

/**
 * Start the Express web server.
 * @param dataSource Database connection
 */
async function startServer() {
  // configure Express app and install the JSON middleware for parsing JSON bodies
  const app = express();

  app.use(express.json());

  app.use(cookieParser());

  // configure CORS
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use(nocache());

  // use routes
  app.use('/app/login', loginRoute);
  app.use('/app/callback', callbackRoute);
  app.use('/app/refresh', refreshRoute);
  app.use('/app/logout', logoutRoute);
  app.use('/app/register', registerRoute);
  app.use('/app/me', meRoute);

  try {
    const server = await app.listen(config.serverPort);
    console.info(`🚀 Server running on port ${config.serverPort}`);

    // Handle termination signal.
    // eslint-disable-next-line no-undef
    process.on('SIGTERM', async () => {
      console.info('🚦 SIGTERM received. Stopping HTTP server.');
      server.close(async () => {
        console.info('🛑 HTTP server stopped.');
        // eslint-disable-next-line no-undef
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❗️ Error starting server', error);
    throw error;
  }
}
