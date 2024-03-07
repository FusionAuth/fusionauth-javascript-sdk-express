const express = require('express');
const session = require('express-session');
const cors = require('cors');
const config = require('./config.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const nocache = require("nocache");

// configure Express app and install the JSON middleware for parsing JSON bodies
const app = express();

app.use(bodyParser.json());

app.use(cookieParser());

// configure CORS
app.use(cors(
  {
    origin: true,
    credentials: true
  })
);

app.use(nocache());

// configure sessions
app.use(session(
  {
    secret: '1234567890',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 3600000,
      sameSite: 'lax'
    }
  })
);

// use routes
app.use('/app/login', require('./routes/login.js'));
app.use('/app/callback', require('./routes/callback.js'));
app.use('/app/refresh/:clientID', require('./routes/refresh.js'));
app.use('/app/logout', require('./routes/logout.js'));
app.use('/app/register', require('./routes/register.js'));
app.use('/app/me', require('./routes/me.js'));

// start server
app.listen(config.serverPort, () => console.log(`FusionAuth example server listening on port ${config.serverPort}.`));
