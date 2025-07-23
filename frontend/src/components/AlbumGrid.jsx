import { useEffect, useState } from 'react';

export default function AlbumGrid({ token, onTrackPlay }) {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch('/albums', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setAlbums(data.items || []));
  }, [token]);

  const handlePlay = (context_uri) => {
    fetch('/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context_uri }),
    }).then(() => {
      if (onTrackPlay) onTrackPlay();
    });
  };

  return (
    <div className="grid-container">
      {albums.map(({ album }) => (
        <div
          key={album.id}
          className="grid-card"
          onClick={() => handlePlay(album.uri)}
          role="button"
          tabIndex={0}
          onKeyPress={e => { if (e.key === 'Enter') handlePlay(album.uri); }}
        >
          <img src={album.images[0]?.url} alt={album.name} className="grid-image" />
          <div className="grid-title">{album.name}</div>
          <div className="grid-subtitle">{album.artists[0]?.name || ''}</div>
        </div>
      ))}
    </div>
  );
}