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
          "You cannot ban this member since they own the server."
        );
        return;
      }
  
      const targetUserRolePosition = targetUser.roles.highest.position; 
      const requestUserRolePosition = interaction.member.roles.highest.position; 
      const botRolePosition = interaction.guild.members.me.roles.highest.position; 
  
      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply(
          "Unable to ban this user since they have the same role as you or a higher one."
        );
        return;
      }
  
      if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply(
          "Unable to ban this user because they are higher than me."
        );
        return;
      }

      try {
        await targetUser.send(`You have been banned from ${interaction.guild.name} for: \`${reason}\`\n\nYou can request an unban by joining: https://discord.gg/duXZqmmH`);
      } catch (error) {
        console.log(`Could not DM user: ${error}`);
      }
  
      try {
        await targetUser.ban({ reason });
        await interaction.editReply(`User ${targetUser} was banned\nReason: ${reason}`);
    
        
        await db.query('INSERT INTO modlogs (user_id, action, reason) VALUES (?, ?, ?)', [targetUser.id, 'ban', reason]);
    } catch (error) {
        console.log(`There was an error when banning: ${error}`);
      }
    },
  
    name: 'ban',
    description: 'Bans a member from this server.',
    options: [
      {
        name: 'target-user',
        description: 'The user you want to ban.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: 'reason',
        description: 'The reason you want to ban.',
        type: ApplicationCommandOptionType.String,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
  };