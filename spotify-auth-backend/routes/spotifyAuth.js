const express = require('express');
const querystring = require('querystring');
const axios = require('axios');
const { generateRandomString } = require('../utils/spotifyUtils');
const router = express.Router();

const {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  FRONTEND_URI,
} = process.env;

router.get('/login', (req, res) => {
  const state = generateRandomString(16);
  const scope = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-library-read',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-read-playback-position',
    'user-top-read',
  ].join(' ');

  const queryParams = querystring.stringify({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI,
    state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
      },
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    const queryParams = querystring.stringify({
      access_token,
      refresh_token,
      expires_in,
    });

    res.redirect(`${FRONTEND_URI}/#${queryParams}`);
  } catch (error) {
    console.error('Spotify Token Error:', error.response?.data || error.message);
    res.status(500).send('Error retrieving Spotify tokens');
  }
});

router.get('/refresh_token', async (req, res) => {
  const refresh_token = req.query.refresh_token;

  if (!refresh_token) {
    return res.status(400).send('Missing refresh_token');
  }

  try {
    const refreshResponse = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
      },
    });

    res.json(refreshResponse.data);
  } catch (error) {
    console.error('Refresh Token Error:', error.response?.data || error.message);
    res.status(500).send('Failed to refresh token');
  }
});

// PUT /spotify/play
router.put('/play', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { uris, context_uri } = req.body;

  try {
    await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        uris ? { uris } : { context_uri }
      ),
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;