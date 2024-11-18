const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { db } = require('../../index'); 

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
  
    callback: async (client, interaction) => {
      const userId = interaction.options.get('target-user').value;
  
      await interaction.deferReply();
  
      try {
        
        const [rows] = await db.query(
          'SELECT action, reason, timestamp FROM modlogs WHERE user_id = ? ORDER BY timestamp DESC',
          [userId]
        );
  
        if (rows.length === 0) {
          await interaction.editReply("No mod logs found for this user.");
          return;
        }
  
        
        const embed = new EmbedBuilder()
          .setTitle(`Mod Logs for <@${userId}>`)
          .setColor('#808080')
          .setTimestamp();
  
        
        rows.forEach(log => {
          
          const formattedDate = new Date(log.timestamp).toLocaleString();
  
          embed.addFields({
            name: `**Action:** ${log.action}`,
            value: `**Reason:** ${log.reason}\n**Timestamp:** ${formattedDate}`,
            inline: false
          });
        });
  
        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error(`Error fetching mod logs: ${error}`);
        await interaction.editReply("There was an error fetching mod logs.");
      }
    },
  
    name: 'modlogs',
    description: 'View mod logs for a user.',
    options: [
      {
        name: 'target-user',
        description: 'The user you want to view mod logs for.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.MuteMembers, PermissionFlagsBits.KickMembers, PermissionFlagsBits. BanMembers], 
    botPermissions: [],
  };