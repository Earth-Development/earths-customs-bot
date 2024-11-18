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
      const reason =
        interaction.options.get('reason')?.value || 'No reason provided';
  
      await interaction.deferReply();
  
      const targetUser = await interaction.guild.members.fetch(targetUserId);
  
      if (!targetUser) {
        await interaction.editReply("That user doesn't exist in this server.");
        return;
      }
  
      if (targetUser.id === interaction.guild.ownerId) {
        await interaction.editReply(
          "Unable to kick user since they own the server."
        );
        return;
      }
  
      const targetUserRolePosition = targetUser.roles.highest.position;
      const requestUserRolePosition = interaction.member.roles.highest.position;
      const botRolePosition = interaction.guild.members.me.roles.highest.position;
  
      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply(
          "Unable to kick member since they are at the same level/higher than you."
        );
        return;
      }
  
      if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply(
          "Unable to kick user since they have a higher role than me."
        );
        return;
      }
  
      try {
        await targetUser.send(`You have been kicked from ${interaction.guild.name} for: \`${reason}\`\n\nYou can rejoin whenever you decide.`);
      } catch (error) {
        console.log(`Could not DM user: ${error}`);
      }

      try {
        await targetUser.kick({ reason });
        await interaction.editReply(`User ${targetUser} was kicked\nReason: ${reason}`);
    
        
        await db.query('INSERT INTO modlogs (user_id, action, reason) VALUES (?, ?, ?)', [targetUser.id, 'kick', reason]);
    } catch (error) {
        console.log(`There was an error when kicking: ${error}`);
    }
    },
  
    name: 'kick',
    description: 'Kicks a member from this server.',
    options: [
      {
        name: 'target-user',
        description: 'The user you want to kick.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: 'reason',
        description: 'The reason you want to kick.',
        type: ApplicationCommandOptionType.String,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers],
  };