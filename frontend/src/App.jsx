import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import AlbumGrid from './components/AlbumGrid';
import PlaylistGrid from './components/PlaylistGrid';
import RecentGrid from './components/RecentGrid';
import SearchBar from './components/SearchBar';
import NowPlayingBar from './components/NowPlayingBar';
import Login from './components/Login';
import SpotifyPlayerSDK from './components/SpotifyPlayerSDK';

function App() {
  const [view, setView] = useState('albums');
  const [token, setToken] = useState('');
  const [query, setQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const hash = window.location.hash;
    if (!token && hash) {
      const tokenFromHash = new URLSearchParams(hash.substring(1)).get('access_token');
      if (tokenFromHash) {
        setToken(tokenFromHash);
        window.localStorage.setItem('spotify_token', tokenFromHash);
        window.location.hash = ''; // clear hash once token extracted
      }
    } else {
      const storedToken = window.localStorage.getItem('spotify_token');
      if (storedToken) setToken(storedToken);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetch('/spotify/currently-playing', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.status === 204) {
          setIsPlaying(false);
        } else {
          return res.json().then(data => setIsPlaying(!!data?.is_playing));
        }
      })
      .catch(err => {
        console.error('Error checking currently playing:', err);
        setIsPlaying(false);
      });
  }, [token]);

  const handleTrackPlay = () => {
    setRefreshCounter(prev => prev + 1);
    setIsPlaying(true);
  };

  const renderView = () => {
    if (query) return <SearchBar token={token} query={query} />;
    switch (view) {
      case 'albums':
        return <AlbumGrid token={token} onTrackPlay={handleTrackPlay} />;
      case 'playlists':
        return <PlaylistGrid token={token} onTrackPlay={handleTrackPlay} />;
      case 'recent':
        return <RecentGrid token={token} onTrackPlay={handleTrackPlay} />;
      default:
        return null;
    }
  };

  if (!token) return <Login />;

  return (
    <div className="app-container">
      <Sidebar onSelect={setView} onSearch={setQuery} setToken={setToken}>
      </Sidebar>
      <main className="main-content">
        {renderView()}
      </main>

      {isPlaying && (
        <NowPlayingBar token={token} refreshTrigger={refreshCounter} />
      )}

      {token && (
        <SpotifyPlayerSDK token={token} setRefreshTrigger={setRefreshCounter} />
      )}
    </div>
  );
}

export default App;