import { useEffect, useState } from 'react';

export default function RecentGrid({ token }) {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    fetch('/spotify/recently-played', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setRecent(data.items || []));
  }, [token]);

  const handlePlay = (uri) => {
    fetch('/spotify/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [uri] }),
    });
  };

  return (
    <div className="grid">
      {recent.map(({ track }, i) => (
        <div className="card cursor-pointer" key={i} onClick={() => handlePlay(track.uri)}>
          <img src={track.album.images[0]?.url} alt={track.name} />
          <div>{track.name}</div>
          <div className="subtext">{track.artists[0].name}</div>
        </div>
      ))}
    </div>
  );
}