require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const authRoutes = require('./routes/auth');
const spotifyAuthRoutes = require('./routes/spotifyAuth');
const spotifyApiRoutes = require('./routes/spotifyApi');

require('./config/passport');

const app = express();
const {
  FRONTEND_URI = 'https://apple-music-custom-frontend.onrender.com',
  PORT = 8888,
} = process.env;

const allowedOrigins = [
  'http://localhost:5173',
  'https://apple-music-custom-frontend.onrender.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'super_secret_key',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Route mounting
app.use('/auth', authRoutes);
app.use('/', spotifyAuthRoutes);
app.use('/spotify', spotifyApiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
