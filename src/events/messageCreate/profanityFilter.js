const { Client, Message } = require('discord.js');
const { db } = require('../../index.js');

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  
  if (message.author.bot) return;

  
  const bannedWords = ['fuck', 'fucker', 'fucking', 'bitch', 'retard', 'anal', 'fucked', 'anus', 'ass', 'boob', 'boner', 'buttplug', 'cock', 'penis', 'clitoris', 'cunt', 'dick', 'dildo', 'fag', 'faggot', 'jizz', 'nigger', 'nigga', 'pussy', 'shit', 'piss', 'slut', 'smegma', 'tit', 'titties', 'wank', 'wanker', 'whore', 'twat']; 

  
  const foundProfanity = bannedWords.some((word) =>
    message.content.toLowerCase().includes(word)
  );

  if (foundProfanity) {
    try {
     
      const member = message.guild.members.cache.get(message.author.id);
      if (member) {
        await member.timeout(600000);
        console.log(`Timed out ${message.author.tag} for using profanity.`);
      }


      await message.delete();
      console.log(`Deleted a message from ${message.author.tag} for profanity.`);

    const reason = "Used Profanity.";

    await db.query('INSERT INTO modlogs (user_id, action, reason) VALUES (?, ?, ?)', [member.id, 'timeout', reason]);
      console.log(`Logged timeout of ${message.author.tag} to the database.`);

      
      await message.author.send(
        `You have been timed out for using inappropriate language.`
      );
    } catch (error) {
      console.log(`Error handling profanity: ${error}`);
    }
  }
};
