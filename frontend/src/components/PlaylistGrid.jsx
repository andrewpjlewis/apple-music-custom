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

  return (
    <div className="grid">
      {playlists.map(playlist => (
        <div className="card" key={playlist.id}>
          <img src={playlist.images[0]?.url} alt={playlist.name} />
          <div>{playlist.name}</div>
          <div className="subtext">{playlist.owner.display_name}</div>
        </div>
      ))}
    </div>
  );
}
