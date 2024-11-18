const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'embedcreate',
    description: 'Creates a custom embed message with your specified parameters',
    options: [
        {
            name: 'title',
            description: 'The title of the embed',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'description',
            description: 'The description of the embed',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'color',
            description: 'The color of the embed (hex code, e.g., #FF5733)',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'footer',
            description: 'The footer text for the embed',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],

    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            await interaction.reply({
                content: 'You do not have permission to use this command.',
                ephemeral: true, 
            });
            return;
        }

        await interaction.deferReply();

       
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const color = interaction.options.getString('color') || '#ffffff';
        const footer = interaction.options.getString('footer') || '';

        try {
            // Create the embed
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(color)
                .setFooter({ text: footer });

            // Send the embed in response
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(`Error creating embed: ${error}`);
            await interaction.editReply('There was an error creating the embed. Make sure your color is in a valid hex format like #FFFFFF.');
        }
    },
};
