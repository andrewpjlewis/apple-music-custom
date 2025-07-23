import { useEffect } from 'react';

let player = null;

export default function SpotifyPlayerSDK({ token, setRefreshTrigger }) {
  useEffect(() => {
    if (!token) return;

    // Handler to initialize the player once SDK is ready
    const onSpotifyWebPlaybackSDKReady = () => {
      player = new window.Spotify.Player({
        name: 'My Web Player',
        getOAuthToken: (cb) => cb(token),
        volume: 0.5,
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => console.error('Init error:', message));
      player.addListener('authentication_error', ({ message }) => console.error('Auth error:', message));
      player.addListener('account_error', ({ message }) => console.error('Account error:', message));
      player.addListener('playback_error', ({ message }) => console.error('Playback error:', message));

      // Playback status updates
      player.addListener('player_state_changed', (state) => {
        if (state) setRefreshTrigger(Date.now());
      });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);

        fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_ids: [device_id],
            play: true,
          }),
        }).catch((err) => {
          console.error('Failed to transfer playback:', err);
        });
      });

      // Connect to the player
      player.connect();
    };

    // If the Spotify SDK is already loaded, initialize immediately
    if (window.Spotify && window.Spotify.Player) {
      onSpotifyWebPlaybackSDKReady();
    } else {
      // Otherwise, set the global callback
      window.onSpotifyWebPlaybackSDKReady = onSpotifyWebPlaybackSDKReady;
    }

    // Cleanup on unmount or token change
    return () => {
      if (player) {
        player.disconnect();
        player = null;
      }
    };
  }, [token, setRefreshTrigger]);

  return null;
}