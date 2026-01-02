Auswahl: User (Flo, Chris, Sam, Andru, Max, Andrea, DifferentUser) oder bestehender Session beitreten (SessionID eingeben)
Neue Session erstellen:
    Daten: SessionID(Wenn möglich irgendwie Gerätenamen integrieren + 6 Buchstaben/Ziffern), User, createdAt(Timestamp) 

User (Default als User, von dem aus Standard Daten abgegriffen werden können, der aber nicht ausgewählt werden kann)
    Daten: Name, (vielleicht: SpotifyDaten (SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)), Navi Standorte(Umsetzung?), Favourites(Umsetzung?), Settings

Zugriff auf Backend:
    192.168.178.1:3001/{sessionID}/{backendApplication}/{applicationControlls}


Gerüst für das Projekt:
┌─────────────┐
│  Frontend   │
│  (UI)       │
│             │
│ REST + WS   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│        Backend          │
│                         │
│  ┌──────────────┐       │
│  │  API Layer   │       │
│  └──────────────┘       │
│          │              │
│  ┌──────────────┐       │
│  │ R.A.I.N.E.R  │◄──────┤ Sprach- & Intent-Logik
│  └──────────────┘       │
│          │              │
│  ┌──────────────┐       │
│  │ Service Layer│       │
│  └──────────────┘       │
│          │              │
│  ┌──────────────┐       │
│  │ DB Adapter   │──────► PostgreSQL
│  └──────────────┘       │
│                         │
│  WebSocket Event Hub    │
└─────────────────────────┘



Für das session Ding:
    Wenn eine session gelöscht/"überschrieben" wird, müssen alle Mitglieder aus der session gekickt werden. 
    Idee dafür:
        in main entweder jede sekunde check, ob session noch valide ist
        wenn session gelöscht wird, per push an main eine variable ändern