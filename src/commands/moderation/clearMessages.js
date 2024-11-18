const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  callback: async (client, interaction) => {
    const channel = interaction.options.getChannel('channel');
    const amount = interaction.options.getInteger('amount');

    if (channel.type !== ChannelType.GuildText) {
      await interaction.reply("You can only clear messages in text channels.");
      return;
    }

    if (amount < 1 || amount > 100) {
      await interaction.reply("Please enter a number between 1 and 100.");
      return;
    }

    await interaction.deferReply();

    try {
      const messages = await channel.messages.fetch({ limit: amount });
      
      if (messages.size === 0) {
        await interaction.editReply('No messages found to delete.');
        return;
      }

      await channel.bulkDelete(messages, false);

      await interaction.editReply(`Cleared ${messages.size} messages from ${channel}.`);
    } catch (error) {
    //   console.log(`There was an error when clearing messages: ${error}`); // For troubleshooting in development
      await interaction.editReply('There was an error trying to clear messages in this channel.');
    }
  },

  name: 'clearmessages',
  description: 'Clear messages from a specified channel.',
  options: [
    {
      name: 'channel',
      description: 'The channel to clear messages from.',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: 'amount',
      description: 'The number of messages to clear (1-100).',
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],
};
