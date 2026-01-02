import React, { useEffect, useState } from "react";

interface Track {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

export const spotify = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [songInput, setSongInput] = useState("");

  // Polling für aktuellen Track
  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const res = await fetch("http://localhost:3001/current");
        const data = await res.json();
        if (data && data.item) setCurrentTrack(data.item);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCurrent();
    const interval = setInterval(fetchCurrent, 2000);
    return () => clearInterval(interval);
  }, []);

  // Steuerfunktionen
  const control = async (endpoint: string) => {
    await fetch(`http://localhost:3001/${endpoint}`, { method: "POST" });
  };

  const playTrack = async () => {
    if (!songInput) return;
    await fetch(`http://localhost:3001/play-track/${songInput}`, { method: "POST" });
    setSongInput("");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{currentTrack?.name || "Lädt..."}</h1>
      <h2 style={styles.artist}>{currentTrack?.artists.map(a => a.name).join(", ")}</h2>
      {currentTrack?.album.images[0] && (
        <img src={currentTrack.album.images[0].url} alt="Album Cover" style={styles.cover} />
      )}

      <div style={styles.buttonRow}>
        <button style={styles.button} onClick={() => control("previous")}>⏮</button>
        <button style={styles.button} onClick={() => control("play")}>▶</button>
        <button style={styles.button} onClick={() => control("pause")}>⏸</button>
        <button style={styles.button} onClick={() => control("next")}>⏭</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <input
          placeholder="Spotify Track ID"
          value={songInput}
          onChange={e => setSongInput(e.target.value)}
          style={{ padding: 10, fontSize: 16, width: 250 }}
        />
        <button style={{ ...styles.button, marginLeft: 10 }} onClick={playTrack}>🎵 Play</button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "sans-serif",
    backgroundColor: "#111",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
  },
  title: { fontSize: "2rem" },
  artist: { fontSize: "1.5rem" },
  cover: { width: 300, height: 300, borderRadius: 20, margin: "1rem 0" },
  buttonRow: { display: "flex", justifyContent: "center", flexWrap: "wrap" },
  button: {
    fontSize: "2rem",
    padding: "1rem 2rem",
    margin: "1rem",
    borderRadius: 15,
    backgroundColor: "#1DB954",
    color: "white",
    border: "none",
    touchAction: "manipulation",
  },
};
