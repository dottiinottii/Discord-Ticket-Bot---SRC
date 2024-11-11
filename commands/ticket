const Discord = require("discord.js");
const ticket = require("../../json/logs.json");

module.exports = {
  name: "ticket",
  description: "Ticket Panel",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
      interaction.reply({ content: `You do not have permission to use this command.`, ephemeral: true });
    } else {
      const embed = new Discord.EmbedBuilder()
        .setColor("Default")
        .setDescription("Ticket");

      interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setDescription("Configure the ticket before sending it")
            .setFooter({ text: "If you've made any previous changes, click update" }),
          embed
        ],
        components: [
          new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.ButtonBuilder()
                .setCustomId("add-title")
                .setLabel("Add Title")
                .setStyle(1),
              new Discord.ButtonBuilder()
                .setCustomId("alter-desc")
                .setLabel("Add Description")
                .setStyle(1),
              new Discord.ButtonBuilder()
                .setCustomId("add-footer")
                .setLabel("Add Footer")
                .setStyle(1),
              new Discord.ButtonBuilder()
                .setCustomId("add-image")
                .setLabel("Add Banner")
                .setStyle(1),
              new Discord.ButtonBuilder()
                .setCustomId("send_ticket")
                .setLabel("Send Ticket")
                .setStyle(1)
            ),
          new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.ButtonBuilder()
                .setCustomId("reset-ticket")
                .setLabel("Update")
                .setStyle(2)
            )
        ],
        ephemeral: true
      });
    }
  }
};
