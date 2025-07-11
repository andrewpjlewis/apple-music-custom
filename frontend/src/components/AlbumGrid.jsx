import { useEffect, useState } from 'react';

export default function AlbumGrid({ token }) {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch('/spotify/albums', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setAlbums(data.items || []));
  }, [token]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {albums.map(({ album }) => (
        <div key={album.id} className="bg-gray-800 text-white rounded p-2">
          <img src={album.images[0]?.url} alt={album.name} className="rounded" />
          <div className="mt-2 text-sm">{album.name}</div>
          <div className="text-xs text-gray-400">{album.artists[0].name}</div>
        </div>
      ))}
    </div>
  );
}
