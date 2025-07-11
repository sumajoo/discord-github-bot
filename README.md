# Discord GitHub Bot

Ein Discord Bot, der es ermöglicht, GitHub Issues direkt aus Discord heraus zu erstellen. Benutzer können mit dem `/issue` Slash-Command einfach und schnell Issues in einem GitHub Repository erstellen.

## 🚀 Features

- **Slash-Command Integration**: Verwende `/issue` um GitHub Issues zu erstellen
- **Automatische Zuordnung**: Issues werden automatisch mit dem Discord-Benutzerprofil verknüpft
- **Ephemere Antworten**: Nur der Benutzer sieht die Bot-Antworten
- **Fehlerbehandlung**: Robuste Fehlerbehandlung mit benutzerfreundlichen Meldungen

## 📋 Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn
- Discord Application/Bot Token
- GitHub Personal Access Token
- GitHub Repository für Issues

## 🛠️ Installation

1. **Repository klonen**

   ```bash
   git clone https://github.com/sumajoo/discord-github-bot.git
   cd discord-github-bot
   ```

2. **Dependencies installieren**

   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**

   Erstelle eine `.env` Datei im Root-Verzeichnis:

   ```env
   DISCORD_TOKEN=dein_discord_bot_token
   APPLICATION_ID=deine_discord_application_id
   GITHUB_TOKEN=dein_github_personal_access_token
   GITHUB_REPO=benutzername/repository-name
   ```

4. **TypeScript kompilieren**

   ```bash
   npx tsc
   ```

5. **Slash-Commands registrieren**

   ```bash
   node dist/deploy-commands.js
   ```

6. **Bot starten**
   ```bash
   node dist/index.js
   ```

## ⚙️ Konfiguration

### Discord Bot Setup

1. Besuche das [Discord Developer Portal](https://discord.com/developers/applications)
2. Erstelle eine neue Application
3. Gehe zu "Bot" und erstelle einen Bot
4. Kopiere den Bot Token für `DISCORD_TOKEN`
5. Kopiere die Application ID für `APPLICATION_ID`
6. Lade den Bot zu deinem Server ein mit den folgenden Berechtigungen:
   - `applications.commands` (Slash Commands)
   - `bot`

### GitHub Token Setup

1. Gehe zu [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Erstelle einen neuen Token (classic) mit folgenden Bereichen:
   - `repo` (für private Repositories)
   - `public_repo` (für öffentliche Repositories)
3. Kopiere den Token für `GITHUB_TOKEN`

### Repository Konfiguration

Setze `GITHUB_REPO` auf das Format `benutzername/repository-name` (z.B. `sumajoo/discord-github-bot`)

## 📖 Verwendung

### Issue erstellen

Verwende den `/issue` Slash-Command in Discord:

```
/issue titel:"Bug: Button funktioniert nicht" beschreibung:"Der Submit-Button auf der Startseite reagiert nicht auf Klicks. Browser: Chrome 120"
```

**Parameter:**

- `titel` (Pflicht): Ein aussagekräftiger Titel für das Issue
- `beschreibung` (Optional): Detaillierte Beschreibung des Problems oder Features

### Beispiel-Ausgabe

Nach erfolgreicher Erstellung erhältst du eine Antwort wie:

```
✅ Issue erstellt: https://github.com/benutzername/repository/issues/123
```

## 🏗️ Projektstruktur

```
discord-github-bot/
├── src/
│   ├── deploy-commands.ts    # Registrierung der Slash-Commands
│   └── index.ts             # Haupt-Bot-Logik
├── package.json
├── tsconfig.json
├── .env                     # Umgebungsvariablen (nicht in Git)
└── README.md
```

## 🔧 Development

### TypeScript kompilieren und überwachen

```bash
npx tsc --watch
```

### Bot in Development-Modus starten

```bash
npm run dev
```

(Hinweis: Füge `"dev": "ts-node src/index.ts"` zu den npm scripts hinzu)

## 📝 Commands

### `/issue`

Erstellt ein neues GitHub Issue.

**Optionen:**

- `titel` (String, Pflicht): Titel des Issues
- `beschreibung` (String, Optional): Beschreibung des Issues

**Beispiel:**

```
/issue titel:"Feature Request: Dark Mode" beschreibung:"Würde gerne einen Dark Mode für die Anwendung haben"
```

## 🚨 Fehlerbehandlung

- Bei Fehlern wird eine benutzerfreundliche Nachricht angezeigt
- Detaillierte Fehler werden in der Konsole geloggt
- Der Bot antwortet nur ephemer (nur für den Benutzer sichtbar)

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt steht unter der ISC Lizenz.

## 🔐 Sicherheit

- **Tokens sicher aufbewahren**: Niemals Tokens in Git committen
- **Minimale Berechtigungen**: GitHub Token nur mit nötigen Berechtigungen erstellen
- **Umgebungsvariablen**: Verwende immer `.env` für sensible Daten

## 📞 Support

Bei Problemen oder Fragen wende dich an sumajoo oder erstelle ein Issue in diesem Repository.

---

**Made with ❤️ from vienna**
