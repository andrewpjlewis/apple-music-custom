import { useEffect, useState } from 'react';
import PlaylistTracks from './PlaylistTracks';
import { API_BASE_URL } from '../api';

export default function PlaylistGrid({ token, onTrackPlay }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/spotify/playlists`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setPlaylists(data.items || []));
  }, [token]);

  if (selectedPlaylist) {
    return <PlaylistTracks token={token} playlist={selectedPlaylist} onTrackPlay={onTrackPlay} />;
  }

  return (
    <div className="grid-container">
      {playlists.map(playlist => (
        <div
          key={playlist.id}
          className="grid-card"
          onClick={() => setSelectedPlaylist(playlist)}
          role="button"
          tabIndex={0}
          onKeyPress={e => { if (e.key === 'Enter') setSelectedPlaylist(playlist); }}
        >
          <img src={playlist.images[0]?.url} alt={playlist.name} className="grid-image" />
          <div className="grid-title">{playlist.name}</div>
          <div className="grid-subtitle">{playlist.owner.display_name || ''}</div>
        </div>
      ))}
    </div>
  );
}