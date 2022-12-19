var SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
    clientId: "a692c0f8577c4d22a6e4daca1218035f",
    clientSecret: "abf171fafe214141bbd868c17d26bea1",
    redirectUri: "http://localhost:5001/bananas/",
});

const scopes = [
    "ugc-image-upload",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "streaming",
    "app-remote-control",
    "user-read-email",
    "user-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-read-private",
    "playlist-modify-private",
    "user-library-modify",
    "user-library-read",
    "user-top-read",
    "user-read-playback-position",
    "user-read-recently-played",
    "user-follow-read",
    "user-follow-modify",
];

let token = "";
let refreshToken = "";

const loginSpotify = async (req, res, next) => {
    const result = res.redirect(spotifyApi.createAuthorizeURL(scopes));
    console.log(result);
};

const enterUser = async (req, res, next) => {
    try {
        const error = req.query.error;
        const code = req.query.code;
        const state = req.query.state;

        if (error) {
            console.error("Callback Error:", error);
            res.send(`Callback Error: ${error}`);
            return;
        }

        spotifyApi.authorizationCodeGrant(code).then((data) => {
            console.log(`\n\nHellooooooooooooo ${token}\n`);
            const access_token = data.body["access_token"];
            console.log(`ACCESS-TOKEN : ${access_token}`);
            token = access_token;
            const refresh_token = data.body["refresh_token"];
            refreshToken = refresh_token;
            const expires_in = data.body["expires_in"];

            spotifyApi.setAccessToken(token);
            spotifyApi.setRefreshToken(refreshToken);

            console.log("\naccess_token:", access_token);
            console.log("\nrefresh_token:", refresh_token);
            console.log(
                `\nSucessfully retreived access token. Expires in ${expires_in}s.\n`
            );
            console.log(`helloooooooooooo \n${token}\n`);
            res.send(access_token);

            setInterval(async () => {
                const data = await spotifyApi.refreshAccessToken();
                const access_token = data.body["access_token"];

                console.log("The access token has been refreshed!");
                console.log("access_token:", access_token);
                spotifyApi.setAccessToken(access_token);
            }, (expires_in / 2) * 1000);
        });
    } catch (err) {
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json(result.body);
    }
};

const getUserInfo = async (req, res, next) => {
    try {
        const result = await spotifyApi.getMe();

        res.status(200)
            .setHeader("Content-Type", "application/json")
            .json(result.body);
    } catch (err) {
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json(result.body.tracks.items[0].name);
    }
};

const getTrack = async (req, res, next) => {
    try {
        const track = req.query.track;
        const artist = req.query.artist;
        const result = await spotifyApi.searchTracks(
            `track:${track} artist:${artist}`
        );

        let top5tracks = {};
        const tracks = result.body.tracks;

        console.log(tracks);

        for (let i = 0; i < 5; i++) {
            let trackInfo = {};
            item = tracks.items[i];

            trackInfo._id = item.id;
            trackInfo.trackName = item.name;
            trackInfo.trackLink = item.external_urls.spotify;

            let albums = {};
            albums._id = item.album.id;
            albums.albumName = item.album.name;
            albums.albumLink = item.album.external_urls.spotify;

            trackInfo.trackAlbum = albums;

            let artists = [];
            for (let j = 0; j < item.artists.length; j++) {
                let artistInfo = {};

                artistInfo._id = item.artists[j].id;
                artistInfo.artistName = item.artists[j].name;
                artists[j] = artistInfo;
            }
            trackInfo["trackArtists"] = artists;

            top5tracks[`track ${i + 1}`] = trackInfo;
        }

        // res.send(result);
        res.send(top5tracks);

        // console.log(result.body.tracks);
    } catch (err) {
        res.status(400)
            .setHeader("Content-Type", "application/json")
            .json({ success: false, msg: err.message });
    }
};

module.exports = {
    getUserInfo,
    loginSpotify,
    enterUser,
    getTrack,
};