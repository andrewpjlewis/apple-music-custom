require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const authRoutes = require('./routes/auth'); // your Google auth routes
const spotifyAuthRoutes = require('./routes/spotifyAuth'); // Spotify login/callback/refresh
const spotifyApiRoutes = require('./routes/spotifyApi'); // Spotify API proxy

require('./config/passport'); // Google passport strategy setup

const app = express();
const { FRONTEND_URI, PORT = 8888 } = process.env;

// Middleware
app.use(
  cors({
    origin: FRONTEND_URI,
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: 'super_secret_key', // replace with env var in prod
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/', spotifyAuthRoutes);
app.use('/spotify', spotifyApiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});