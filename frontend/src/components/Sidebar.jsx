import { useState } from 'react';
import Logout from './Logout';

export default function Sidebar({ onSelect, onSearch, setToken }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on selection (optional)
  const handleSelect = (view) => {
    onSearch('');
    onSelect(view);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Hamburger button, visible only on mobile */}
      <button
        aria-label="Toggle menu"
        className={`hamburger-btn ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(prev => !prev)}
      >
        <span className="hamburger-line top" />
        <span className="hamburger-line middle" />
        <span className="hamburger-line bottom" />
      </button>

      {/* Backdrop, shown only when menu is open */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? 'visible' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <nav className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <h2 className="sidebar-title">Library</h2>
        <input
          type="text"
          placeholder="Search..."
          className="sidebar-search"
          onChange={e => onSearch(e.target.value)}
        />
        <ul className="sidebar-list">
          <li onClick={() => handleSelect('playlists')} className="sidebar-list-item">
            Playlists
          </li>
          <li onClick={() => handleSelect('albums')} className="sidebar-list-item">
            Albums
          </li>
          <li onClick={() => handleSelect('recent')} className="sidebar-list-item">
            Recently Played
          </li>
          <li>
            <div className="sidebar-logout">
              <Logout setToken={setToken} />
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}
