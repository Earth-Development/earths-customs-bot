const { Server } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(client, Server);
    
    
    const existingCommandsMap = new Map();
    applicationCommands.cache.forEach(cmd => {
      existingCommandsMap.set(cmd.name, cmd);
    });

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = existingCommandsMap.get(name);

      if (existingCommand) {
        
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`🗑 Deleted command "${name}".`);
          continue;
        }

        
        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });

          console.log(`🔁 Edited command "${name}".`);
        }
      } else {
        
        if (!localCommand.deleted) {
          await applicationCommands.create({
            name,
            description,
            options,
          });

          console.log(`👍 Registered command "${name}."`);
        } else {
          console.log(
            `⏩ Skipping registering command "${name}" as it's set to delete.`
          );
        }
      }
    }

    
    for (const existingCommand of applicationCommands.cache.values()) {
      const localCommandExists = localCommands.some(
        (localCommand) => localCommand.name === existingCommand.name
      );
      if (!localCommandExists) {
        await applicationCommands.delete(existingCommand.id);
        console.log(`🗑 Deleted command "${existingCommand.name}" (no longer defined locally).`);
      }
    }

  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};
