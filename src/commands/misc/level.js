const { Client, Interaction } = require('discord.js');
const { db } = require('../../index.js');

module.exports = {
    name: 'level',
    description: 'Check your current level and XP.',

    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const userId = interaction.user.id;

        try {
            const [rows] = await db.query('SELECT xp, level FROM user_levels WHERE user_id = ?', [userId]);

            if (rows.length === 0) {
                await interaction.reply('You have no level or XP yet. Start chatting to gain XP!');
            } else {
                const { xp, level } = rows[0];
                await interaction.reply(`You are at level ${level} with ${xp} XP.`);
            }
        } catch (error) {
            console.log(`Error fetching user level: ${error}`);
            await interaction.reply('There was an error retrieving your level. Please try again later.');
        }
    },
};
