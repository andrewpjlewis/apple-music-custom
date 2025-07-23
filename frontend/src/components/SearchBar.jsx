import { useEffect, useState } from 'react';

export default function SearchBar({ token, query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    fetch(`/spotify/search?q=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setResults(data.tracks?.items || []));
  }, [query, token]);

  return (
    <div className="grid">
      {results.map(track => (
        <div key={track.id} className="card">
          <img src={track.album.images[0]?.url} alt={track.name} />
          <div className="truncate">{track.name}</div>
          <div className="subtext truncate">{track.artists.map(a => a.name).join(', ')}</div>
        </div>
      ))}
    </div>
  );
}