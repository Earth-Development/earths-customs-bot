const { Client, Interaction } = require('discord.js');
const { db } = require('../../index.js');

module.exports = {
    name: 'leaderboard',
    description: 'Shows the top 10 users by XP',

    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        try {
           
            const [rows] = await db.query('SELECT user_id, xp, level FROM user_levels ORDER BY xp DESC LIMIT 10');

            if (rows.length === 0) {
                await interaction.reply('No leaderboard data is available yet.');
                return;
            }

           
            let leaderboard = '🏆 **Top 10 Users by XP** 🏆\n\n';
            rows.forEach((row, index) => {
                const user = client.users.cache.get(row.user_id);
                const username = user ? user.username : `Unknown User (${row.user_id})`;
                leaderboard += `**${index + 1}.** ${username} - Level ${row.level}, ${row.xp} XP\n`;
            });

            await interaction.reply(leaderboard);
        } catch (error) {
            console.log(`Error fetching leaderboard: ${error}`);
            await interaction.reply('There was an error retrieving the leaderboard. Please try again later.');
        }
    },
};
