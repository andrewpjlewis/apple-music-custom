require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const authRoutes = require('./routes/auth');
const spotifyAuthRoutes = require('./routes/spotifyAuth');
const spotifyApiRoutes = require('./routes/spotifyApi');

require('./config/passport'); // passport strategies setup

const app = express();
const { FRONTEND_URI, PORT = 8888 } = process.env;

// Middleware
app.use(cors({
  origin: FRONTEND_URI,
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: 'super_secret_key', // use env var in prod
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/', spotifyAuthRoutes);      // for /login, /callback, /refresh_token
app.use('/spotify', spotifyApiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
