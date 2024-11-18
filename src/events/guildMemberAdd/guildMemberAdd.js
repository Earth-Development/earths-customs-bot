const { Client, GuildMember, EmbedBuilder } = require('discord.js');
const { db } = require('../../index.js');

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
  try {
    const guild = member.guild;
    if (!guild) return;

    
    const [rows] = await db.query('SELECT default_role_id FROM settings WHERE id = 1');

    if (rows.length === 0 || !rows[0].default_role_id) {
      console.log('No default role found for this guild.');
      return;
    }

    const roleId = rows[0].default_role_id;
    const role = guild.roles.cache.get(roleId);

    if (!role) {
      console.log(`Role with ID ${roleId} not found in this guild.`);
      return;
    }

    
    await member.roles.add(role);
    console.log(`Assigned role ${role.name} to ${member.user.tag}.`);

    
    const welcomeChannel = guild.channels.cache.find(ch => ch.name === 'welcome');

    if (welcomeChannel && welcomeChannel.isTextBased()) {
     
      const welcomeEmbed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('Welcome to the server!')
        .setDescription(`Hello ${member.user}, welcome to **${guild.name}**! We're glad to have you here.`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields({ name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true })
        .addFields({ name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true })
        .setFooter({ text: 'Enjoy your stay!', iconURL: guild.iconURL() })
        .setTimestamp();

      
      await welcomeChannel.send({ embeds: [welcomeEmbed] });
      console.log(`Sent a welcome message to ${member.user.tag}.`);
    } else {
      console.log('No #welcome channel found, or it is not a text channel.');
    }
  } catch (error) {
    console.log(`Error handling guildMemberAdd: ${error}`);
  }
};
