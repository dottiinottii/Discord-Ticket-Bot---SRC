const fs = require("fs");

module.exports = async (client) => {

    const SlashCommandsArray = [];

    fs.readdir(`./Commands`, (error, folder) => {
        folder.forEach(subfolder => {
            fs.readdir(`./Commands/${subfolder}/`, (error, files) => { 
                files.forEach(file => {
                    if(!file?.endsWith('.js')) return;
                    file = require(`../Commands/${subfolder}/${file}`);
                    if(!file?.name) return;
                    client.slashCommands.set(file?.name, file);
                    
                    SlashCommandsArray.push(file);
                });
            });
        });
    });

    client.on("ready", async () => {
        client.guilds.cache.forEach(guild => guild.commands.set(SlashCommandsArray));
    });
};
