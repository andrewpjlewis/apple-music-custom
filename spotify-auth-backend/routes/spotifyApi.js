const express = require('express');
const fetch = require('node-fetch'); // or native fetch in Node 18+
const router = express.Router();

function getAccessTokenFromHeaders(req) {
  const auth = req.headers.authorization || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : null;
}

function requireAccessToken(req, res, next) {
  const token = getAccessTokenFromHeaders(req);
  if (!token) return res.status(401).json({ error: 'Missing access token' });
  req.accessToken = token;
  next();
}

router.use(requireAccessToken);

router.get('/playlists', async (req, res) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { Authorization: `Bearer ${req.accessToken}` },
    });
    if (!response.ok) {
      const errData = await response.json();
      console.error('Spotify Playlists API error:', errData);
      return res.status(response.status).json(errData);
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Playlists API Error:', err);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

router.get('/albums', async (req, res) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/albums', {
      headers: { Authorization: `Bearer ${req.accessToken}` },
    });
    if (!response.ok) {
      const errData = await response.json();
      console.error('Spotify Albums API error:', errData);
      return res.status(response.status).json(errData);
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Fetch /albums failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/recently-played', async (req, res) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
      headers: { Authorization: `Bearer ${req.accessToken}` },
    });
    if (!response.ok) {
      const errData = await response.json();
      console.error('Spotify Recently Played API error:', errData);
      return res.status(response.status).json(errData);
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Recently Played API Error:', err);
    res.status(500).json({ error: 'Failed to fetch recently played' });
  }
});

router.get('/currently-playing', async (req, res) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${req.accessToken}` },
    });
    if (response.status === 204) return res.status(204).send();
    if (!response.ok) {
      const errData = await response.json();
      console.error('Spotify Currently Playing API error:', errData);
      return res.status(response.status).json(errData);
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Fetch /currently-playing failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;