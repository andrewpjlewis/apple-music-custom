import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../api';

export default function RecentGrid({ token, onTrackPlay }) {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/spotify/recently-played`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setRecent(data.items || []));
  }, [token]);

  const handlePlay = (uri) => {
    fetch(`${API_BASE_URL}/spotify/play`, {
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

  return (
    <div className="grid-container">
      {recent.map(({ track }, i) => (
        <div
          className="grid-card"
          key={i}
          onClick={() => handlePlay(track.uri)}
          role="button"
          tabIndex={0}
          onKeyPress={e => { if (e.key === 'Enter') handlePlay(track.uri); }}
        >
          <img src={track.album.images[0]?.url} alt={track.name} className="grid-image" />
          <div className="grid-title">{track.name}</div>
          <div className="grid-subtitle">{track.artists[0].name}</div>
        </div>
      ))}
    </div>
  );
}