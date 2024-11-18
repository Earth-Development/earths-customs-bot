const { EmbedBuilder } = require('discord.js');
const { db } = require('../../index.js'); // Adjust the path as needed

module.exports = {
    name: 'baltop',
    description: 'Displays the top users with the highest balance.',

    callback: async (client, interaction) => {
        await interaction.deferReply();

        try {
            // Fetch top 10 users sorted by balance in descending order
            const [rows] = await db.query('SELECT user_id, balance FROM economy ORDER BY balance DESC LIMIT 10');

            if (rows.length === 0) {
                return interaction.editReply('No users found on the leaderboard.');
            }

            // Build the leaderboard content
            const leaderboard = rows.map((row, index) => {
                const user = client.users.cache.get(row.user_id);
                const username = user ? user.username : 'Unknown User';
                return `**${index + 1}.** ${username} - **${row.balance}** coins`;
            }).join('\n');

            // Create the embed
            const embed = new EmbedBuilder()
                .setTitle('🏆 Balance Leaderboard')
                .setDescription(leaderboard)
                .setColor('#FFD700')
                .setTimestamp();

            // Send the embed
            interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching the leaderboard:', error);
            interaction.editReply('There was an error displaying the leaderboard.');
        }
    },
};
