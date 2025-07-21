import React from 'react';

export default function Logout({ setToken }) {
  const handleLogout = async () => {
    try {
      const res = await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setToken('');
        window.localStorage.removeItem('spotify_token');
        window.location.href = '/';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button onClick={handleLogout} className="sidebar-logout-btn">
      Logout
    </button>
  );
}
