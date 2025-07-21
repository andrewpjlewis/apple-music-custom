import { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle } from 'lucide-react';

export default function NowPlayingBar({ token, refreshTrigger }) {
  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isShuffling, setIsShuffling] = useState(false);

  const fetchCurrentTrack = () => {
    fetch('/spotify/currently-playing', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => (res.status === 204 ? null : res.json()))
      .then(data => {
        setTrack(data?.item || null);
        setIsPlaying(data?.is_playing || false);
        setIsShuffling(data?.shuffle_state || false);
      })
      .catch(err => {
        console.error('Failed to fetch currently playing:', err);
        setTrack(null);
        setIsPlaying(false);
        setIsShuffling(false);
      });
  };

  useEffect(() => {
    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 5000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (refreshTrigger !== undefined) {
      fetchCurrentTrack();
    }
  }, [refreshTrigger]);

  const togglePlayPause = () => {
    const endpoint = isPlaying ? 'pause' : 'play';
    fetch(`/spotify/${endpoint}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => setIsPlaying(!isPlaying));
  };

  const skipToNext = () => {
    fetch('/spotify/next', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).then(fetchCurrentTrack);
  };

  const skipToPrevious = () => {
    fetch('/spotify/previous', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).then(fetchCurrentTrack);
  };

  const toggleShuffle = () => {
    const newState = !isShuffling;
    setIsShuffling(newState);
    fetch(`/spotify/shuffle?state=${newState}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(err => {
      console.error('Failed to toggle shuffle:', err);
      setIsShuffling(!newState);
    });
  };

  const changeVolume = (e) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    fetch(`/spotify/volume?volume_percent=${vol}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  if (!track) return null;

  return (
    <div className="now-playing-bar">
      {/* Track Info */}
      <div className="track-info">
        <img
          src={track.album.images[0]?.url}
          alt={track.name}
          className="album-art"
        />
        <div className="track-text">
          <div className="track-name">{track.name}</div>
          <div className="artist-name">
            {track.artists.map(a => a.name).join(', ')}
          </div>
        </div>
      </div>

      {/* Media Controls */}
      <div className="media-controls">
        <button
          onClick={toggleShuffle}
          aria-label="Shuffle"
          title={isShuffling ? "Shuffle On" : "Shuffle Off"}
          className={`control-button ${isShuffling ? 'active' : ''}`}
        >
          <Shuffle size={24} />
        </button>

        <button
          onClick={skipToPrevious}
          aria-label="Previous Track"
          className="control-button"
        >
          <SkipBack size={24} />
        </button>

        <button
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="control-button"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={skipToNext}
          aria-label="Next Track"
          className="control-button"
        >
          <SkipForward size={24} />
        </button>
      </div>

      {/* Volume Control */}
      <div className="volume-control">
        <Volume2 size={18} />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={changeVolume}
          aria-label="Volume"
        />
      </div>
    </div>
  );
}