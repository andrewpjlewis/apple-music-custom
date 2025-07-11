import React from 'react';

export default function Logout() {
  const handleLogout = async () => {
    try {
      const res = await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include', // send cookies/session info
      });
      if (res.ok) {
        // After logout, redirect or refresh app state
        window.location.href = '/'; // redirect to homepage
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}
