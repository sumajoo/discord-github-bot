import { Client, GatewayIntentBits, Events, MessageFlags, Interaction } from 'discord.js';
import axios from 'axios';
import 'dotenv/config';

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () =>
  console.log(`🤖 Eingeloggt als ${client.user!.tag}`)
);

export async function handleIssueInteraction(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'issue') return;

  const title = interaction.options.getString('titel');
  const body  = interaction.options.getString('beschreibung')!;

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

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
}

client.on(Events.InteractionCreate, handleIssueInteraction);

if (process.env.NODE_ENV !== 'test') {
  client.login(process.env.DISCORD_TOKEN);
}
