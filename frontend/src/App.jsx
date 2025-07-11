import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import AlbumGrid from './components/AlbumGrid';
import PlaylistGrid from './components/PlaylistGrid';
import RecentGrid from './components/RecentGrid';
import SearchBar from './components/SearchBar';
import NowPlayingBar from './components/NowPlayingBar';
import Login from './components/Login';

function App() {
  const [view, setView] = useState('albums');
  const [token, setToken] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    if (!token && hash) {
      const tokenFromHash = new URLSearchParams(hash.substring(1)).get('access_token');
      if (tokenFromHash) {
        setToken(tokenFromHash);
        window.localStorage.setItem('spotify_token', tokenFromHash);
        window.location.hash = ''; // clean URL
      }
    } else {
      const storedToken = window.localStorage.getItem('spotify_token');
      if (storedToken) setToken(storedToken);
    }
  }, [token]);

  const renderView = () => {
    if (query) return <SearchBar token={token} query={query} />;
    switch (view) {
      case 'albums':
        return <AlbumGrid token={token} />;
      case 'playlists':
        return <PlaylistGrid token={token} />;
      case 'recent':
        return <RecentGrid token={token} />;
      default:
        return null;
    }
  };

  if (!token) return <Login />;

  return (
    <div className="app">
      <Sidebar onSelect={setView} onSearch={setQuery} />
      <main>
        {renderView()}
        <NowPlayingBar token={token} />
      </main>
    </div>
  );
}

export default App;