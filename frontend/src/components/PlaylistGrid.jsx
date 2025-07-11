import { useEffect, useState } from 'react';

export default function PlaylistGrid({ token }) {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    fetch('/spotify/playlists', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setPlaylists(data.items || []));
  }, [token]);

  const handlePlay = (context_uri) => {
    fetch('/spotify/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context_uri }),
    });
  };

  return (
    <div className="grid">
      {playlists.map(playlist => (
        <div
          className="card cursor-pointer"
          key={playlist.id}
          onClick={() => handlePlay(playlist.uri)}
        >
          <img src={playlist.images[0]?.url} alt={playlist.name} />
          <div>{playlist.name}</div>
          <div className="subtext">{playlist.owner.display_name}</div>
        </div>
      ))}
    </div>
  );
}