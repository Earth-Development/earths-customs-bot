const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { db } = require('../../index.js');

module.exports = {
  name: 'setjoinrole',
  description: 'Set the join role.',
  options: [
    {
      name: 'role',
      description: 'The role to assign to new members.',
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  callback: async (client, interaction) => {
    const role = interaction.options.getRole('role');

    try {
      
      await db.query('INSERT INTO settings (id, default_role_id) VALUES (1, ?) ON DUPLICATE KEY UPDATE default_role_id = ?', [role.id, role.id]);

      await interaction.reply(`Default role set to: ${role.name}`);
    } catch (error) {
      console.error(`Database error: ${error}`);
      await interaction.reply('There was an error saving the role to the database.');
    }
  },
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
