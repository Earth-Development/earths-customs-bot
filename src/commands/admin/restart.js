module.exports = {
    name: 'restart',
    description: 'Restarts the bot (owner only).',
  
    callback: async (client, interaction) => {
      const ownerId = '1296270532643393610';
  
     
      if (interaction.user.id !== ownerId) {
        return interaction.reply({
          content: 'You do not have permission to restart the bot.',
          ephemeral: true 
        });
      }
  
      await interaction.deferReply();
  
      try {
        await interaction.followUp('Restarting the bot...');
  
       
        console.log(`Bot is restarting by ${interaction.user.tag}`);
  
        
        process.exit(0); 
      } catch (error) {
        console.log(`Error while restarting: ${error}`);
        interaction.followUp('There was an error trying to restart the bot.');
      }
    },
  };
  