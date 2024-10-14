const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.clientId,     // Replace with your Client ID
    clientSecret: process.env.clientSecret,  // Replace with your Client Secret
});

async function authenticateSpotify() {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log('Spotify access token granted.');
    } catch (error) {
        console.error('Error getting Spotify access token:', error);
    }
}


async function getSpotifyUrl(artist, title) {
    try {
        const searchQuery = `${artist} ${title}`;
        const response = await spotifyApi.searchTracks(searchQuery, { limit: 1 });
        if (response.body.tracks.items.length > 0) {
            const song = response.body.tracks.items[0];
            return song.external_urls.spotify;  // Return the Spotify URL for the song
        } else {
            return 'Song not found on Spotify';
        }
    } catch (error) {
        console.error('Error searching song on Spotify:', error);
        return null;
    }
}

module.exports = { authenticateSpotify, getSpotifyUrl };