const { readdirSync } = require('fs');
const { EmbedBuilder } = require('discord.js');
const path = require('path');

module.exports = {
  name: 'commands',
  description: 'Displays a list of all available commands grouped by category',

  callback: async (client, interaction) => {
    await interaction.deferReply();


    const commandCategories = ['admin', 'economy', 'misc', 'moderation'];
    const commandsDirectory = path.join(__dirname, '..'); 


    const commandList = {};


    for (const category of commandCategories) {
      const categoryPath = path.join(commandsDirectory, category);
      const commandFiles = readdirSync(categoryPath).filter(file => file.endsWith('.js'));


      commandList[category] = commandFiles.map(file => {
        const command = require(path.join(categoryPath, file));
        return command.name;
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('Available Commands')
      .setDescription('Here is a list of all available commands, grouped by category:')
      .setColor(0x00AE86);

    
    for (const [category, commands] of Object.entries(commandList)) {
      embed.addFields([{ name: category.charAt(0).toUpperCase() + category.slice(1), value: commands.join(', ') || 'No commands available', inline: false }]);
    }

    
    interaction.editReply({ embeds: [embed] });
  },
};
