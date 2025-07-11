import { useEffect, useState } from 'react';

export default function NowPlayingBar({ token }) {
  const [track, setTrack] = useState(null);

  useEffect(() => {
    fetch('/spotify/currently-playing', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setTrack(data.item || null));
  }, [token]);

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black text-white p-2 flex items-center gap-4">
      <img src={track.album.images[0]?.url} alt={track.name} className="w-12 h-12 rounded" />
      <div>
        <div className="text-sm font-semibold truncate">{track.name}</div>
        <div className="text-xs text-gray-400 truncate">{track.artists.map(a => a.name).join(', ')}</div>
      </div>
    </div>
  );
}