export default function Login() {
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const RESPONSE_TYPE = 'code';

  const SCOPES = [
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-library-read',
    'user-read-email',
    'playlist-read-private',
    'streaming',
    'app-remote-control',
  ].join(' ');

  const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}&show_dialog=true`;

  const handleLogin = () => {
    window.location.href = loginUrl;
  };

  return (
    <div className="login-container">
      <div className="intro">
        <h1 className="intro-title">🎵 Spotify Dashboard</h1>
        <h3 className="intro-subtitle" >Login below</h3>
        <p className="intro-text">
          Welcome! This is a project built by me, <strong>Andrew Lewis</strong> — a full-stack web developer passionate about clean design, music, and building meaningful digital experiences.
        </p>
        <p className="intro-text">
          This app uses the Spotify API to show your playlists, albums, recently played tracks, and more. It’s a sleek, Apple Music–inspired web dashboard powered by React, Node.js, and the Spotify Web API.
        </p>
        <p className="intro-links">
          GitHub: <a href="https://github.com/andrewpjlewis/apple-music-custom">github.com/andrewpjlewis/apple-music-custom</a><br />
          Portfolio: <a href="https://yourportfolio.com" target="_blank" rel="noopener noreferrer">yourportfolio.com</a>
        </p>
      </div>

      <button onClick={handleLogin} className="login-button">
        Login with Spotify
      </button>
    </div>
  );
}
