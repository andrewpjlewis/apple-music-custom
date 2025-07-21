const express = require('express');
const fetch = require('node-fetch');
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
      const text = await response.text(); // get raw text instead of json to see error message
      console.error('Spotify Playlists API error (raw):', text);
      return res.status(response.status).send(text);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Fetch /playlists failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/playlists/:id/tracks', async (req, res) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${req.params.id}/tracks`, {
      headers: { Authorization: `Bearer ${req.accessToken}` },
    });
    if (!response.ok) {
      const errData = await response.json();
      console.error('Playlist Tracks Error:', errData);
      return res.status(response.status).json(errData);
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Fetch playlist tracks failed:', err);
    res.status(500).json({ error: 'Internal Server Error' });
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

router.put('/play', async (req, res) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${req.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    if (!response.ok) {
      const errData = await response.json();
      console.error('Spotify Play API error:', errData);
      return res.status(response.status).json(errData);
    }
    res.status(204).send();
  } catch (err) {
    console.error('Play failed:', err);
    res.status(500).json({ error: 'Failed to start playback' });
  }
});

// Pause playback
router.put('/pause', async (req, res) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${req.accessToken}`,
      },
    });
    res.sendStatus(response.status);
  } catch (err) {
    res.status(500).json({ error: 'Failed to pause playback' });
  }
});

// Skip to next
router.post('/next', async (req, res) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/next', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${req.accessToken}`,
      },
    });
    res.sendStatus(response.status);
  } catch (err) {
    res.status(500).json({ error: 'Failed to skip track' });
  }
});

// Skip to previous
router.post('/previous', async (req, res) => {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/previous', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${req.accessToken}`,
      },
    });
    res.sendStatus(response.status);
  } catch (err) {
    res.status(500).json({ error: 'Failed to go to previous track' });
  }
});

// Set volume (0–100)
router.put('/volume', async (req, res) => {
  const volumePercent = req.query.volume_percent;
  try {
    const response = await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volumePercent}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${req.accessToken}`,
      },
    });
    res.sendStatus(response.status);
  } catch (err) {
    res.status(500).json({ error: 'Failed to change volume' });
  }
});

router.put('/shuffle', async (req, res) => {
  const { state } = req.query;
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const response = await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${state}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 204) {
      res.sendStatus(204);
    } else {
      const data = await response.json();
      res.status(response.status).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;