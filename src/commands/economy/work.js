const { db } = require('../../index.js');

module.exports = {
    name: 'work',
    description: 'Earn a random amount of money.',

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const userId = interaction.user.id;
        const earnings = Math.floor(Math.random() * 100) + 1;

        await db.query(
            'INSERT INTO economy (user_id, balance) VALUES (?, ?) ON DUPLICATE KEY UPDATE balance = balance + ?',
            [userId, earnings, earnings]
        );

        interaction.editReply(`${interaction.user.username}, you worked and earned $${earnings}!`);
    },
};
