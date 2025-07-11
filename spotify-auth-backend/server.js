require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const authRoutes = require('./routes/auth'); // Google OAuth routes
const spotifyAuthRoutes = require('./routes/spotifyAuth'); // Spotify auth/login/callback/refresh/play
const spotifyApiRoutes = require('./routes/spotifyApi'); // Spotify API proxy routes (albums, playlists, etc)

require('./config/passport'); // Your passport Google strategy setup

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
    secret: 'super_secret_key', // put in env var for prod
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Route mounting
app.use('/auth', authRoutes);             // Google OAuth
app.use('/', spotifyAuthRoutes);          // Spotify login/callback/refresh/play
app.use('/spotify', spotifyApiRoutes);    // Spotify API proxy

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});