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

  return (
    <div className="grid">
      {recent.map(({ track }, i) => (
        <div className="card" key={i}>
          <img src={track.album.images[0]?.url} alt={track.name} />
          <div>{track.name}</div>
          <div className="subtext">{track.artists[0].name}</div>
        </div>
      ))}
    </div>
  );
}
