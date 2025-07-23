import { useEffect } from 'react';

let player = null;

export default function SpotifyPlayerSDK({ token, setRefreshTrigger }) {
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      player = new window.Spotify.Player({
        name: 'My Web Player',
        getOAuthToken: cb => cb(token),
        volume: 0.5,
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => console.error(message));
      player.addListener('authentication_error', ({ message }) => console.error(message));
      player.addListener('account_error', ({ message }) => console.error(message));
      player.addListener('playback_error', ({ message }) => console.error(message));

      // Playback status updates
      player.addListener('player_state_changed', (state) => {
        if (state) setRefreshTrigger(Date.now());
      });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);

        // Transfer playback to this device
        fetch(`https://api.spotify.com/v1/me/player`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            device_ids: [device_id],
            play: true,
          }),
        }).catch(err => {
          console.error('Failed to transfer playback:', err);
        });
      });

      player.connect();
    };

    return () => {
      if (player) {
        player.disconnect();
        player = null;
      }
    };
  }, [token, setRefreshTrigger]);

  return null;
}