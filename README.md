## Die zwei Konzepte
    Konzept 1:
        Ein einziges Backend, ein R.A.I.N.E.R und die UIs sind nur unterschiedliche Visualisierungen von dem selben Ding, home Seite zeigt immer das selbe an, Spotify ist immer das selbe (also vorne und hinten) und alle Daten sind auf jedem UI die selben.
    
    Konzept 2:
        Pro UI ein seperates Backend - Damit haben wir Flexibilität mit angezeigten Daten vorne und hinten, können R.A.I.N.E.R vorne und hinten bzw. auf noch anderen Geräten für unterschiedliche Zwecke verwenden und sind nicht an eine einzige Instanz gebunden.
    
    Konzept 3:
        Mischung aus beidem: Alles Server-Seitig, grundsätzlich aber für jedes UI ein seperates Backend. Man könnte es mit SessionIDs machen, damit man auf jedem Gerät ein seperates UI hat, wenn man aber von dem Handy aus in die Session vom LKW einsteigen möchte, kann man die SessionID vom LKW verwenden um dieser Session beizutreten und dann vom Handy aus auch auf die selbe Instanz von R.A.I.N.E.R, Navi, Spotify usw zuzugreifen.


## (Konzept 1:) Grundkonzept Aufbau
    Server hostet komplettes Backend, jeder greift auf die selben Inhalte zu

    => am wenigsten Funktionen, unflexibel

## (Konzept 2:) Grundkonzept Aufbau
    Client muss Backend selbst hosten:
        Am Pc easy mit ner .exe, die mit Windows integrierten Funktionen als Kiosk-UI angezeigt wird
        Am Handy möglich durch einfache Android App (nicht verfügbar für Apple)

    => flexibler, unglaublich aufwändig zu programmieren

## (Konzept 3:) Grundkonzept Aufbau
    Server hostet komplettes Backend, jeder hat eigene SessionID und somit eine seperate Instanz, durch das Teilen der SessionID können Geräte auf die selben Inhalte zugreifen

    => programmiertechnisch mittelschwer, einfacher als Konzept 2, flexibler

## Backend Aufbau
    192.168.178.1:3001/{backendApplication}/{applicationControlls}

    backendApplication:
        - Spotify
        - TopDown Informationsverarbeitung
        - Navigation
        - Datenbank
        - R.A.I.N.E.R

## Möglichkeiten mit R.A.I.N.E.R
    - R.A.I.N.E.R zeig mir die Route zur goldenen Möwe - soll das Navigationssystem mit Adresse Mcs starten.
    - R.A.I.N.E.R spiel 3 Uhr Nachts - dafür auf dem Server Spotify installieren, damit selbstständig Songs abgespielt werden können, unabhängig vom UI.
    - R.A.I.N.E.R zeig mir das TopDown - soll die Seite TopDown öffnen, dafür muss in app.tsx die variable site geändert werden. 

    Dafür muss wahrscheinlich noch eine andere Art der Kommunikation zwischen dem UI und R.A.I.N.E.R bestehen, das muss ich mir noch überlegen.