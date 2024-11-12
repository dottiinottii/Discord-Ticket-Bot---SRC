const Discord = require("discord.js");

module.exports = {
  name: "mylogs",
  description: "View your logs",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    const logs = require("../../json/logs.json");
    const userId = interaction.user.id;
    const userLogs = logs[userId];

    if (!userLogs || userLogs.length === 0) {
      interaction.reply({ content: `You have no ticket records.`, ephemeral: true });
      return;
    }

    let currentPage = 0;
    const maxPage = userLogs.length - 1;

    const embed = new Discord.EmbedBuilder()
      .setTitle("Ticket Records")
      .setDescription("Here are your ticket records:")
      .addFields({ name: "Ticket Owner", value: `${interaction.guild.members.cache.get(userLogs[currentPage].dono_ticket)}`, inline: true })
      .addFields({ name: "Ticket Closed By", value: `${interaction.guild.members.cache.get(userLogs[currentPage].fechou_ticket)}`, inline: true })
      .addFields({ name: "Handled By", value: `${interaction.guild.members.cache.get(userLogs[currentPage].assumido) ?? `No One Handled`}`, inline: true })
      .addFields({ name: "Reason", value: `\`${userLogs[currentPage].motivo}\``, inline: true })
      .addFields({ name: "Code", value: `\`${userLogs[currentPage].codigo}\``, inline: true })
      .setFooter({ text: `Page ${currentPage + 1} of ${userLogs.length}` });

    const row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("previousPage")
        .setLabel("Previous Page")
        .setStyle(1),
      new Discord.ButtonBuilder()
        .setCustomId("nextPage")
        .setLabel("Next Page")
        .setStyle(1)
    );

    interaction.reply({ embeds: [embed], components: [row], ephemeral: true });

    const filter = (i) => i.customId === "previousPage" || i.customId === "nextPage";
    const collector = interaction.channel.createMessageComponentCollector({ filter });

    collector.on("collect", (i) => {
      if (i.customId === "previousPage" && currentPage > 0) {
        currentPage--;
      } else if (i.customId === "nextPage" && currentPage < maxPage) {
        currentPage++;
      }

      embed.fields = [];
      embed
        .setFields(
          { name: "Ticket Owner", value: `${interaction.guild.members.cache.get(userLogs[currentPage].dono_ticket)}`, inline: true },
          { name: "Ticket Closed By", value: `${interaction.guild.members.cache.get(userLogs[currentPage].fechou_ticket)}`, inline: true },
          { name: "Handled By", value: `${interaction.guild.members.cache.get(userLogs[currentPage].assumido) ?? `No One Handled`}`, inline: true },
          { name: "Reason", value: `\`${userLogs[currentPage].motivo}\``, inline: true },
          { name: "Code", value: `\`${userLogs[currentPage].codigo}\``, inline: true }
        )
        .setFooter({ text: `Page ${currentPage + 1} of ${userLogs.length}` });

      i.update({ embeds: [embed] });
    });
  }
};
