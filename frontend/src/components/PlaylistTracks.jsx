import { useEffect, useState } from 'react';

export default function PlaylistTracks({ token, playlist, onTrackPlay }) {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    fetch(`/spotify/playlists/${playlist.id}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setTracks(data.items));
  }, [playlist.id, token]);

  const playTrack = (uri) => {
    fetch('/spotify/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [uri] }),
    }).then(() => {
      if (onTrackPlay) onTrackPlay();
    });
  };

  const playPlaylist = () => {
    fetch('/spotify/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context_uri: playlist.uri }),
    }).then(() => {
      if (onTrackPlay) onTrackPlay();
    });
  };

  // Fisher-Yates shuffle
  const shuffleArray = (array) => {
    const arr = array.slice(); // copy array
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const shufflePlaylist = () => {
    const shuffledTracks = shuffleArray(tracks);
    const uris = shuffledTracks.map(t => t.track.uri);

    fetch('/spotify/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris }),
    }).then(() => {
      if (onTrackPlay) onTrackPlay();
    });
  };

  return (
    <div className="playlist-tracks-container">
      <h2>{playlist.name}</h2>
      <button className="ios-style-btn" onClick={playPlaylist}>Play Playlist</button>
      <button className="ios-style-btn" onClick={shufflePlaylist} style={{ marginLeft: '8px' }}>
        Shuffle Playlist
      </button>
      <ul className="track-list">
        {tracks.map(t => (
          <li
            key={t.track.id}
            className="track-list-item"
            onClick={() => playTrack(t.track.uri)}
            role="button"
            tabIndex={0}
            onKeyPress={e => { if (e.key === 'Enter') playTrack(t.track.uri); }}
          >
            {t.track.name} — {t.track.artists.map(a => a.name).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}