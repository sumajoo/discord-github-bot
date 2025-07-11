// index.js
import { Client, GatewayIntentBits, Events, MessageFlags } from 'discord.js';
import axios from 'axios';
import 'dotenv/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () =>
  console.log(`🤖 Eingeloggt als ${client.user!.tag}`)
);

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'issue') return;

  const title = interaction.options.getString('titel');
  const body  = interaction.options.getString('beschreibung')!

  await interaction.deferReply({ flags: MessageFlags.Ephemeral }); // bis zu 15 Minuten Zeit

  try {
    const { data } = await axios.post(
      `https://api.github.com/repos/${process.env.GITHUB_REPO}/issues`,
      {
        title,
        body: `${body}\n\n_Erstellt von Discord-User **${interaction.user.tag}** ([Profil](https://discord.com/users/${interaction.user.id}))_`,
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'discord-github-issue-bot',
        },
      },
    );

    await interaction.editReply(
      `✅ Issue erstellt: <${data.html_url}>`
    );
  } catch (err) {
    console.error(err);
    await interaction.editReply(
      '❌ Fehler beim Erstellen des Issues. Wende dich direkt an Jonas.'
    );
  }
});

client.login(process.env.DISCORD_TOKEN);