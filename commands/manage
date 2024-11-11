const Discord = require("discord.js");

module.exports = {
  name: "manage",
  description: "Manage your ticket",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
      interaction.reply({ content: `You do not have permission to use this command.`, ephemeral: true });
    } else {
      interaction.reply({
        content: `${interaction.user}`,
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle("Manage your ticket!")
            .setDescription("🔐 - ticket: manage some aspects of the ticket \n\n 🔔 - main: change some main settings")
        ],
        components: [
          new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.StringSelectMenuBuilder()
                .setCustomId("ticket_management")
                .setPlaceholder("Modify something by selecting one of the options")
                .addOptions(
                  {
                    label: "Ticket",
                    value: "ticket_selectmenu"
                  },
                  {
                    label: "Main",
                    value: "main_selectmenu"
                  }
                )
            )
        ],
        ephemeral: true
      });
    }
  }
};
