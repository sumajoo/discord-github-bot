# Discord GitHub Bot

A Discord bot that allows you to create GitHub issues directly from Discord. Users can quickly create issues in a GitHub repository using the `/issue` slash command.

## 🚀 Features

- **Slash command integration**: Use `/issue` to create GitHub issues
- **Automatic linking**: Issues are automatically associated with the Discord user profile
- **Ephemeral responses**: Only the user sees the bot's replies
- **Error handling**: Robust error handling with user-friendly messages

## 📋 Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Discord application/bot token
- GitHub personal access token
- GitHub repository for issues

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sumajoo/discord-github-bot.git
   cd discord-github-bot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   DISCORD_TOKEN=your_discord_bot_token
   APPLICATION_ID=your_discord_application_id
   GITHUB_TOKEN=your_github_personal_access_token
   GITHUB_REPO=username/repository-name
   ```

4. **Compile TypeScript**

   ```bash
   npx tsc
   ```

5. **Register slash commands**

   ```bash
   node dist/deploy-commands.js
   ```

6. **Start the bot**
   ```bash
   node dist/index.js
   ```

## ⚙️ Configuration

### Discord Bot Setup

1. Visit the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" and create a bot
4. Copy the bot token for `DISCORD_TOKEN`
5. Copy the application ID for `APPLICATION_ID`
6. Invite the bot to your server with the following permissions:
   - `applications.commands` (slash commands)
   - `bot`

### GitHub Token Setup

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Create a new token (classic) with these scopes:
   - `repo` (for private repositories)
   - `public_repo` (for public repositories)
3. Copy the token for `GITHUB_TOKEN`

### Repository Configuration

Set `GITHUB_REPO` to the format `username/repository-name` (e.g., `sumajoo/discord-github-bot`)

## 📖 Usage

### Create an issue

Use the `/issue` slash command in Discord:

```
/issue title:"Bug: Button does not work" description:"The submit button on the homepage doesn't respond to clicks. Browser: Chrome 120"
```

**Parameters:**

- `title` (required): A meaningful title for the issue
- `description` (optional): Detailed description of the problem or feature

### Example output

After successful creation, you'll receive a response like:

```
✅ Issue created: https://github.com/username/repository/issues/123
```

## 🏗️ Project structure

```
discord-github-bot/
├── src/
│   ├── deploy-commands.ts    # Register slash commands
│   └── index.ts             # Main bot logic
├── package.json
├── tsconfig.json
├── .env                     # Environment variables (not in Git)
└── README.md
```

## 🔧 Development

### Compile and watch TypeScript

```bash
npx tsc --watch
```

### Start the bot in development mode

```bash
npm run dev
```

(Note: add `"dev": "ts-node src/index.ts"` to the npm scripts)

## 📝 Commands

### `/issue`

Creates a new GitHub issue.

**Options:**

- `title` (string, required): Issue title
- `description` (string, optional): Issue description

**Example:**

```
/issue title:"Feature Request: Dark Mode" description:"Would like to have a dark mode for the application"
```

## 🚨 Error handling

- If an error occurs, a user-friendly message is displayed
- Detailed errors are logged to the console
- The bot only replies ephemerally (visible only to the user)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## 📄 License

This project is licensed under the ISC license.

## 🔐 Security

- **Keep tokens safe**: Never commit tokens to Git
- **Minimum permissions**: Create GitHub tokens with only the permissions you need
- **Environment variables**: Always use `.env` for sensitive data

## 📞 Support

If you encounter issues or have questions, contact sumajoo or open an issue in this repository.

---

**Made with ❤️ from Vienna**
