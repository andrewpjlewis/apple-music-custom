const express = require('express');
const fetch = require('node-fetch'); // or global fetch in Node >=18
const router = express.Router();

// Helper to extract Bearer token from Authorization header
function getAccessTokenFromHeaders(req) {
  const auth = req.headers.authorization || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : null;
}

// Middleware to require access token for all /spotify/* routes
function requireAccessToken(req, res, next) {
  const token = getAccessTokenFromHeaders(req);
  if (!token) {
    return res.status(401).json({ error: 'Missing access token' });
  }
  req.accessToken = token; // attach token to request object
  next();
}

// Apply middleware to all routes below
router.use(requireAccessToken);

// GET /spotify/playlists
router.get('/playlists', async (req, res) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { Authorization: `Bearer ${req.accessToken}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Playlists API Error:', err);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// GET /spotify/albums
router.get('/albums', async (req, res) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/albums', {
      headers: { Authorization: `Bearer ${req.accessToken}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Albums API Error:', err);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
});

// GET /spotify/recently-played
router.get('/recently-played', async (req, res) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
      headers: { Authorization: `Bearer ${req.accessToken}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Recently Played API Error:', err);
    res.status(500).json({ error: 'Failed to fetch recently played' });
  }
});

// GET /spotify/currently-playing
router.get('/currently-playing', async (req, res) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${req.accessToken}` },
    });

    if (response.status === 204) {
      // No content currently playing
      return res.status(204).send();
    }

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Currently Playing API Error:', err);
    res.status(500).json({ error: 'Failed to fetch currently playing' });
  }
});

module.exports = router;
