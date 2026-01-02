import 'dotenv/config'; 
import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// -------- Spotify Config --------
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  redirectUri: "http://localhost:3001/callback"
});

const scopes = [
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "playlist-read-private",
  "user-library-read"
];

const state = "spotify_auth_state"; // MUSS gesetzt werden

app.get("/login", (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes, state, true));
});

app.get("/callback", async (req, res) => {
  const code = req.query.code as string;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    spotifyApi.setAccessToken(data.body.access_token);
    spotifyApi.setRefreshToken(data.body.refresh_token);
    res.send("Login erfolgreich! Backend ist bereit.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Fehler bei der Authentifizierung");
  }
});

app.post("/play", async (req, res) => {
  try { await spotifyApi.play(); res.sendStatus(200); } catch { res.sendStatus(500); }
});
app.post("/pause", async (req, res) => {
  try { await spotifyApi.pause(); res.sendStatus(200); } catch { res.sendStatus(500); }
});
app.post("/next", async (req, res) => {
  try { await spotifyApi.skipToNext(); res.sendStatus(200); } catch { res.sendStatus(500); }
});
app.post("/previous", async (req, res) => {
  try { await spotifyApi.skipToPrevious(); res.sendStatus(200); } catch { res.sendStatus(500); }
});

app.get("/current", async (req, res) => {
  try {
    const data = await spotifyApi.getMyCurrentPlaybackState();
    res.json(data.body);
  } catch {
    res.sendStatus(500);
  }
});

app.post("/play-track/:id", async (req, res) => {
  try {
    await spotifyApi.play({ uris: [`spotify:track:${req.params.id}`] });
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

app.listen(3001, () => {
  console.log("Backend läuft auf http://localhost:3001");
  console.log("Login: http://localhost:3001/login");
});
