const { db } = require("../../index.js");

module.exports = {
    name: 'weekly',
    description: 'Claim your weekly reward.',

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const userId = interaction.user.id;
        const rewardAmount = 500; // Customize this reward amount
        const now = new Date();

        // Fetch user's last weekly claim time from the database
        const [[user]] = await db.query('SELECT last_weekly, balance FROM economy WHERE user_id = ?', [userId]);

        // Check if the user has claimed their weekly reward within the past 7 days
        if (user && user.last_weekly) {
            const lastWeekly = new Date(user.last_weekly);
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            const timeSinceLastWeekly = now - lastWeekly;

            if (timeSinceLastWeekly < oneWeek) {
                const daysLeft = Math.floor((oneWeek - timeSinceLastWeekly) / (1000 * 60 * 60 * 24));
                await interaction.editReply(`You can claim your weekly reward in ${daysLeft} days.`);
                return;
            }
        }

        // Update user's balance and last weekly claim timestamp
        await db.query(
            'INSERT INTO economy (user_id, balance, last_weekly) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE balance = balance + ?, last_weekly = ?',
            [userId, rewardAmount, now, rewardAmount, now]
        );

        await interaction.editReply(`You've claimed your weekly reward of $${rewardAmount}!`);
    },
};
