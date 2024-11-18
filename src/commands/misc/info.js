const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'info',
    description: 'Replies with server info and bot uptime.',
  
    callback: async (client, interaction) => {
      await interaction.deferReply(); 

      const guild = interaction.guild;
      const memberCount = guild.memberCount;
  

      let totalSeconds = client.uptime / 1000;
      const days = Math.floor(totalSeconds / 86400);
      totalSeconds %= 86400;
      const hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      const embed = new EmbedBuilder()
      .setTitle('Info')
      .setColor('Green')
      .setDescription(`\`\`\`\nMembers: ${memberCount}\n\`\`\`\n\`\`\`\nBot Uptime: ${uptime}\n\`\`\``)
      .setTimestamp();
  
      await interaction.fetchReply(); 
  
      interaction.editReply({ embeds: [embed] });
    },
  };
  