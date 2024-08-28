import express from 'express';
import * as session from 'express-session';
import cors from 'cors';
import config from './config.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import nocache from 'nocache';
import loginRoute from './routes/login.js';
import callbackRoute from './routes/callback.js';
import refreshRoute from './routes/refresh.js';
import logoutRoute from './routes/logout.js';
import registerRoute from './routes/register.js';
import meRoute from './routes/me.js';

// configure Express app and install the JSON middleware for parsing JSON bodies
const app = express();

app.use(bodyParser.json());

app.use(cookieParser());

// configure CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(nocache());

// configure sessions
app.use(
  session({
    secret: '1234567890',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 3600000,
      sameSite: 'lax',
    },
  }),
);

// use routes
app.use('/app/login', loginRoute);
app.use('/app/callback', callbackRoute);
app.use('/app/refresh', refreshRoute);
app.use('/app/logout', logoutRoute);
app.use('/app/register', registerRoute);
app.use('/app/me', meRoute);

// start server
app.listen(config.serverPort, () =>
  console.log(
    `FusionAuth example server listening on port ${config.serverPort}.`,
  ),
);
