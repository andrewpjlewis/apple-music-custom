import { useState } from 'react';
import Sidebar from './components/Sidebar';
import AlbumGrid from './components/AlbumGrid';
import PlaylistGrid from './components/PlaylistGrid';
import RecentGrid from './components/RecentGrid';

function App() {
  const [view, setView] = useState('albums');
  const [token, setToken] = useState('<your-access-token>'); // Replace with actual logic

  const renderView = () => {
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

  return (
    <div className="app">
      <Sidebar onSelect={setView} />
      <main>{renderView()}</main>
    </div>
  );
}

export default App;