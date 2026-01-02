## Grundkonzept Hardware-Aufbau
    lokaler Server hostet R.A.I.N.E.R, die Datenbank und die Website für das UI
    Jedes Gerät, welches das UI nutzen möchte, greift auf eine lokale Website zu, die sich dann mit der Datenbank verbindet.
    R.A.I.N.E.R läuft als eine einzige Instanz im Hintergrund und kann beispielsweise mit dem UI auf 2 Arten agieren:

        1. home Seite auf dem UI fragt 192.168.178.1:???? (evtl. integriert ins UI Backend) mittels iframe ab, was eine local gehostete Website ist, welche vom Sprachassitenten verändert werden kann (kann für bsp. Websuche oder ähnliches verwendet werden)
        2:
            - R.A.I.N.E.R zeig mir die Route zur goldenen Möwe - soll das Navigationssystem mit Adresse Mcs starten.
            - R.A.I.N.E.R spiel 3 Uhr Nachts - dafür auf dem Server Spotify installieren, damit selbstständig Songs abgespielt werden können, unabhängig vom UI.
            - R.A.I.N.E.R zeig mir das TopDown - soll die Seite TopDown öffnen, dafür muss in app.tsx die variable site geändert werden. 
        Dafür muss wahrscheinlich noch eine andere Art der Kommunikation zwischen dem UI und R.A.I.N.E.R bestehen, das muss ich mir noch überlegen

## Backend Aufbau
    192.168.178.1:3001/{backendApplication}/{applicationControlls}

    backendApplication:
        - Spotify
        - TopDown Informationsverarbeitung
        - Navigation
        - Datenbank??
        - R.A.I.N.E.R??