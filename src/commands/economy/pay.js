const { db } = require('../../index.js');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'pay',
    description: 'Pay another user.',

    options: [
        {
            name: 'user',
            description: 'The user you want to pay.',
            type: ApplicationCommandOptionType.User, // Corrected type
            required: true,
        },
        {
            name: 'amount',
            description: 'The amount you want to pay.',
            type: ApplicationCommandOptionType.Integer, // Corrected type
            required: true,
        },
    ],

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const senderId = interaction.user.id;
        const targetUser = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (amount <= 0) {
            await interaction.editReply({ content: 'Amount must be greater than 0.', ephemeral: true });
            return;
        }

        const [[senderBalance]] = await db.query('SELECT balance FROM economy WHERE user_id = ?', [senderId]);

        if (!senderBalance || senderBalance.balance < amount) {
            await interaction.editReply({ content: 'Insufficient funds.', ephemeral: true });
            return;
        }

        await db.query('UPDATE economy SET balance = balance - ? WHERE user_id = ?', [amount, senderId]);
        await db.query(
            'INSERT INTO economy (user_id, balance) VALUES (?, ?) ON DUPLICATE KEY UPDATE balance = balance + ?',
            [targetUser.id, amount, amount]
        );

        interaction.editReply(`${interaction.user.username} paid ${targetUser.username} $${amount}.`);
    },
};
