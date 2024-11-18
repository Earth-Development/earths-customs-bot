const { Client, Message } = require('discord.js');
const { db } = require('../../index.js');

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
    if (message.author.bot) return;

    const xpToAdd = Math.floor(Math.random() * 10) + 5; 

    try {
        const userId = message.author.id;

      
        let [rows] = await db.query('SELECT xp, level FROM user_levels WHERE user_id = ?', [userId]);

        if (rows.length === 0) {
          
            await db.query('INSERT INTO user_levels (user_id, xp, level) VALUES (?, ?, ?)', [userId, xpToAdd, 1]);
            rows = [{ xp: xpToAdd, level: 1 }];
        } else {
           
            const currentXP = rows[0].xp + xpToAdd;
            const currentLevel = rows[0].level;
            let newLevel = currentLevel;

            
            const levelUpXP = currentLevel * 100;

            
            if (currentXP >= levelUpXP) {
                newLevel += 1; // Level up
                await message.channel.send(`${message.author}, congratulations! You've leveled up to level ${newLevel}!`);
            }

            
            await db.query('UPDATE user_levels SET xp = ?, level = ? WHERE user_id = ?', [
                newLevel > currentLevel ? currentXP - levelUpXP : currentXP,
                newLevel,
                userId,
            ]);
        }
    } catch (error) {
        console.log(`Error handling leveling system: ${error}`);
    }
};
