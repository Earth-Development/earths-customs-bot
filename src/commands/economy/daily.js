const { db } = require('../../index.js');

module.exports = {
    name: 'daily',
    description: 'Claim your daily reward.',

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const userId = interaction.user.id;
        const rewardAmount = 100; // Customize this reward amount
        const now = new Date();

        // Fetch user's last daily claim time from the database
        const [[user]] = await db.query('SELECT last_daily, balance FROM economy WHERE user_id = ?', [userId]);

        // Check if the user has claimed their daily reward within the past 24 hours
        if (user && user.last_daily) {
            const lastDaily = new Date(user.last_daily);
            const oneDay = 24 * 60 * 60 * 1000;
            const timeSinceLastDaily = now - lastDaily;

            if (timeSinceLastDaily < oneDay) {
                const hoursLeft = Math.floor((oneDay - timeSinceLastDaily) / (1000 * 60 * 60));
                await interaction.editReply(`You can claim your daily reward in ${hoursLeft} hours.`);
                return;
            }
        }

        // Update user's balance and last daily claim timestamp
        await db.query(
            'INSERT INTO economy (user_id, balance, last_daily) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE balance = balance + ?, last_daily = ?',
            [userId, rewardAmount, now, rewardAmount, now]
        );

        await interaction.editReply(`You've claimed your daily reward of $${rewardAmount}!`);
    },
};
