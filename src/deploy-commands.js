// deploy-commands.js

import 'dotenv/config';

export async function deployCommands({ REST, Routes, SlashCommandBuilder }, log = console.log, error = console.error) {
    const commands = [
        new SlashCommandBuilder()
            .setName('issue')
            .setDescription('Erstellt ein GitHub Issue')
            .addStringOption(opt => opt.setName('titel')
            .setDescription('Erstelle einen aussagekräftigen Titel für das Issue')
            .setRequired(true))
            .addStringOption(opt => opt.setName('beschreibung')
            .setDescription('Beschreibe das Problem oder Feature ausführlich, beschreibe Schritte zum Reproduzieren.')
            .setRequired(false))
            .toJSON(),
    ];
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        log('❯ Registriere Slash-Commands …');
        await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), { body: commands });
        log('✓ Slash-Commands global registriert (kann bis zu 1 h dauern).');
    } catch (err) {
        error(err);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    // eslint-disable-next-line import/namespace
    import('discord.js').then(discordjs => {
        deployCommands(discordjs);
    });
}
