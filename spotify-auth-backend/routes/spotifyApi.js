const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // If using node v18+, global fetch is available.

function getAccessTokenFromHeaders(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  return token;
}

router.get('/playlists', async (req, res) => {
  const accessToken = getAccessTokenFromHeaders(req);
  if (!accessToken) return res.status(401).send('Missing access token');

  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).send('Failed to fetch playlists');
  }
});

router.get('/albums', async (req, res) => {
  const accessToken = getAccessTokenFromHeaders(req);
  if (!accessToken) return res.status(401).send('Missing access token');

  try {
    const response = await fetch('https://api.spotify.com/v1/me/albums', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).send('Failed to fetch albums');
  }
});

router.get('/recently-played', async (req, res) => {
  const accessToken = getAccessTokenFromHeaders(req);
  if (!accessToken) return res.status(401).send('Missing access token');

  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).send('Failed to fetch recently played');
  }
});

module.exports = router;