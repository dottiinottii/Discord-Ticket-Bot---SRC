const Discord = require("discord.js");

module.exports = {
  name: "say",
  description: "Make me speak",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "embed",
      description: "I will speak in an embed.",
      type: Discord.ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "normal",
      description: "I will speak normally (without an embed).",
      type: Discord.ApplicationCommandOptionType.String,
      required: false,
    }
  ],

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
      interaction.reply({ content: `You do not have permission to use this command.`, ephemeral: true });
    } else {
      let embedContent = interaction.options.getString("embed");
      let normalContent = interaction.options.getString("normal");

      if (!embedContent && !normalContent) {
        interaction.reply(`Please provide text for at least one option.`);
      } else {
        if (!embedContent) embedContent = "⠀";
        if (!normalContent) normalContent = "⠀";

        let embed = new Discord.EmbedBuilder()
          .setColor("Random")
          .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
          .setDescription(embedContent);

        if (embedContent === "⠀") {
          interaction.reply({ content: `Your message has been sent!`, ephemeral: true });
          interaction.channel.send({ content: `${normalContent}` });
        } else if (normalContent === "⠀") {
          interaction.reply({ content: `Your message has been sent!`, ephemeral: true });
          interaction.channel.send({ embeds: [embed] });
        } else {
          interaction.reply({ content: `Your message has been sent!`, ephemeral: true });
          interaction.channel.send({ content: `${normalContent}`, embeds: [embed] });
        }
      }
    }
  }
};
