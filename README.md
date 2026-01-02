## Die drei Konzepte
### Konzept 1
- Ein einziges Backend (**R.A.I.N.E.R**) -> serverseitig
- Alle UIs sind nur unterschiedliche Visualisierungen desselben Systems
- Home-Seite, Spotify etc. zeigen überall dieselben Inhalte
- Frontend und Backend sind immer synchron

> unflexibel, am wenigsten Funktionen

### Konzept 2
- Jedes UI besitzt ein eigenes Backend -> clientseitig
- Unterschiedliche Daten & Funktionen je Gerät möglich
- **R.A.I.N.E.R** kann pro Gerät andere Aufgaben übernehmen
- Clients:
    - Pc: `.exe` mit Windows-Kiosk-UI
    - Android: Handy-App

> flexibel, sehr hoher Programmieraufwand

### Konzept 3
- Zentrales Backend -> serverseitig
- Pro UI eine eigene **SessionID**
- Sessions können zwischen Geräten geteilt werden, für Navi, Spotify usw.

> sehr flexibel, moderater Entwicklungsaufwand

## Backend Aufbau
```txt
192.168.178.1:3001/{backendApplication}/{applicationControlls}
```
backendApplication:
- Spotify
- TopDown Informationsverarbeitung
- Navigation
- Datenbank
- R.A.I.N.E.R

## Möglichkeiten mit R.A.I.N.E.R
- "R.A.I.N.E.R, zeig mir die Route zur goldenen Möwe" -> soll das Navigationssystem mit Adresse Mcs starten.
- "R.A.I.N.E.R, spiel 3 Uhr Nachts" -> dafür auf dem Server Spotify installieren, damit selbstständig Songs abgespielt werden können, unabhängig vom UI.
- "R.A.I.N.E.R, zeig mir das TopDown" -> soll die Seite TopDown öffnen, dafür muss in app.tsx die variable site geändert werden. 

> Dafür muss wahrscheinlich noch eine andere Art der Kommunikation zwischen dem UI und R.A.I.N.E.R bestehen, das muss ich mir noch überlegen. (Evtl mit Websocket, R.A.I.N.E.R sendet Befehle wie openView:"topDown" oder navigationDest:"Möwe", navigation.start)