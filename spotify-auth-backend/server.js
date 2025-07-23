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
    secret: 'super_secret_key',
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