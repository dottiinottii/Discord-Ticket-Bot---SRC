const Discord = require("discord.js");
const config = require("../config.json");
const embed = new Discord.EmbedBuilder()
  .setColor("Default")
  .setDescription("Ticket");

module.exports = {
  name: 'config-ticket',
  async execute(interaction, message, client) {

    if (interaction.customId === "add-title") {

      interaction.deferUpdate();

      interaction.channel.send({
        content: "What will be the new title?",
      }).then((msg1) => {
        const filter = (m) => m.author.id === interaction.user.id;
        const collector = msg1.channel.createMessageCollector({
          filter,
          max: 1,
        });

        collector.on("collect", (message) => {
          message.delete();
          embed.setTitle(message.content);
          msg1.edit("⏰ | Updated!");
          setTimeout(() => {
            msg1.delete();
          }, 1000);
        });
      });
    }

    if (interaction.customId === "add-footer") {

      interaction.deferUpdate();

      interaction.channel.send({
        content: "What will be the new footer?",
      }).then((msg1) => {
        const filter = (m) => m.author.id === interaction.user.id;
        const collector = msg1.channel.createMessageCollector({
          filter,
          max: 1,
        });

        collector.on("collect", (message) => {
          message.delete();
          embed.setFooter({ text: `${message.content}`, iconURL: interaction.guild.iconURL() });

          msg1.edit("⏰ | Updated!");
          setTimeout(() => {
            msg1.delete();
          }, 1000);
        });
      });
    }

    if (interaction.customId === "add-image") {

      interaction.deferUpdate();

      interaction.channel.send({
        content: "What will be the new image?",
      }).then((msg1) => {
        const filter = (m) => m.author.id === interaction.user.id;
        const collector = msg1.channel.createMessageCollector({
          filter,
          max: 1,
        });

        collector.on("collect", (message) => {
          message.delete();
          embed.setImage(message.content);

          msg1.edit("⏰ | Updated!");
          setTimeout(() => {
            msg1.delete();
          }, 1000);
        });
      });
    }

    if (interaction.customId === "send_ticket") {

      interaction.channel.send({
        embeds: [embed],
        components: [
          new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.ButtonBuilder()
                .setCustomId("open-ticket")
                .setLabel("Open Ticket")
                .setStyle(Discord.ButtonStyle.Secondary)
            )
        ]
      }).then(() => {
        interaction.reply({
          content: "Successfully sent",
          ephemeral: true
        });
      });
    }

    if (interaction.customId === "alter-desc") {

      interaction.deferUpdate();

      interaction.channel.send({
        content: "What will be the new description?",
      }).then((msg1) => {
        const filter = (m) => m.author.id === interaction.user.id;
        const collector = msg1.channel.createMessageCollector({
          filter,
          max: 1,
        });

        collector.on("collect", (message) => {
          message.delete();
          embed.setDescription(message.content);

          msg1.edit("⏰ | Updated!");
          setTimeout(() => {
            msg1.delete();
          }, 1000);
        });
      });
    }

    if (interaction.customId === "reset-ticket") {
      interaction.update({
        embeds: [
          new Discord.EmbedBuilder()
            .setDescription("Configure the ticket before sending it"),
          embed
        ]
      });
    }
  }
};
