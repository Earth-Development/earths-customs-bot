const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
  } = require('discord.js');
  
  const { db } = require('../../index.js');
  
  module.exports = {
    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
      const targetUserId = interaction.options.get('target-user').value;
      const reason = interaction.options.get('reason')?.value || 'No reason provided';
  
      await interaction.deferReply();
  
      const targetUser = await interaction.guild.members.fetch(targetUserId);
  
      if (!targetUser) {
        await interaction.editReply("That user doesn't exist in this server.");
        return;
      }
  
      try {

        await targetUser.send(`You have been warned in ${interaction.guild.name} for: \`${reason}\``);
      } catch (error) {
        console.log(`Could not DM user: ${error}`);
      }
  

      await interaction.editReply(`User ${targetUser} has been warned for: ${reason}`);
  

      try {
        await db.query('INSERT INTO modlogs (user_id, action, reason) VALUES (?, ?, ?)', [
            targetUser.id,
            'warn', // Make sure this matches the column type and length
            reason
        ]);
    
        console.log(`Logged warning of ${targetUser.tag} to the database.`);
      } catch (error) {
        console.log(`There was an error logging the warning to the database: ${error}`);
      }
    },
  
    name: 'warn',
    description: 'Warns a member in this server and logs it to modlogs.',
    options: [
      {
        name: 'target-user',
        description: 'The user you want to warn.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: 'reason',
        description: 'The reason for the warning.',
        type: ApplicationCommandOptionType.String,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers],
  };
  