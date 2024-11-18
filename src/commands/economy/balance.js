const { db } = require('../../index.js');

module.exports = {
    name: 'balance',
    description: 'Check your balance.',

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const userId = interaction.user.id;
        const [rows] = await db.query('SELECT balance FROM economy WHERE user_id = ?', [userId]);

        let balance = 0;
        if (rows.length > 0) {
            balance = rows[0].balance;
        } else {
            await db.query('INSERT INTO economy (user_id, balance) VALUES (?, ?)', [userId, balance]);
        }

        interaction.editReply(`${interaction.user.username}, your balance is $${balance}.`);
    },
};
