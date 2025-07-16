// deploy-commands.js
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import 'dotenv/config';
const commands = [
    new SlashCommandBuilder()
        .setName('issue')
        .setDescription('Erstellt ein GitHub Issue')
        .addStringOption(opt => opt.setName('titel')
        .setDescription('Erstelle einen aussagekräftigen Titel für das Issue')
        .setRequired(true))
        .addStringOption(opt => opt.setName('beschreibung')
        .setDescription('Beschreibe das Problem oder Feature ausführlich, beschriebe Schritte zum Reproduzieren.')
        .setRequired(false))
        .toJSON(),
];
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
(async () => {
    try {
        console.log('❯ Registriere Slash-Commands …');
        await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), { body: commands });
        console.log('✓ Slash-Commands global registriert (kann bis zu 1 h dauern).');
    }
    catch (err) {
        console.error(err);
    }
})();
