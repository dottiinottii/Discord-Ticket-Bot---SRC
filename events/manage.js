const config = require("../config.json");
const ticket = require("../json/config.ticket.json");
const { ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
    name: 'manage',
    async execute(interaction, message, client) {
        if(interaction.isStringSelectMenu() && interaction.customId === "ticket_management") {
            const options = interaction.values[0];
            const role = interaction.guild.roles.cache.get(ticket.config_main.staff_role);
            const log_channel = interaction.guild.channels.cache.get(ticket.config_main.log_channel);
            const evaluation_channel = interaction.guild.channels.cache.get(ticket.config_main.evaluation_channel);
            const ticket_category = interaction.guild.channels.cache.get(ticket.config_main.ticket_category);

            if(options === "main_selectmenu") {
                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Change the main settings!")
                        .setDescription(`📕 ** | Staff Role:** ${role ?? `\`Not Set\``} \n 🛠 **| Logs Channel:**${log_channel ?? `\`Not Set\``}\n 🛠 **| Evaluation Channel:**${evaluation_channel ?? `\`Not Set\``}  \n 🛠 **| Ticket Category:**${ticket_category ?? `\`Not Set\``}`)
                    ],
                    components: [
                        new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                            .setPlaceholder("Change some main options")
                            .setCustomId("main_1")
                            .addOptions(
                                {
                                    label: "Staff Role",
                                    description: "Change the Staff Role",
                                    value: "change_staff_role"
                                },
                                {
                                    label: "Logs Channel",
                                    description: "Change Logs Channel",
                                    value: "change_log_channel"
                                },
                                {
                                    label: "Evaluation Channel",
                                    description: "Change Evaluation Channel",
                                    value: "change_evaluation_channel"
                                },
                                {
                                    label: "Ticket Category",
                                    description: "Change Ticket Category ID",
                                    value: "change_ticket_category_id"
                                },
                                {
                                    label: "Back",
                                    description: "Go back to the options",
                                    value: "back_select"
                                },
                            )
                        )
                    ]
                });
            }
            if(options === "ticket_selectmenu") {
                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Change some extra ticket settings")
                        .setDescription(`Visual Modifications of the ticket (after opening a ticket) \n\nMention who opened the ticket: {user} \nShow Ticket Code: {code} \nShow who Assumed the Ticket: {assumed} \nShow the reason for the ticket: {reason}`)
                    ],
                    components: [
                        new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                            .setCustomId("ticket_secondary")
                            .setPlaceholder("Change some of the options below")
                            .addOptions(
                                {
                                    label: "Change Ticket Panel",
                                    value: "change_panel"
                                },
                                {
                                    label: "Change Thumbnail",
                                    value: "change_thumbnail"
                                },
                                {
                                    label: "Reset Options",
                                    value: "reset"
                                },
                                {
                                    label: "Back",
                                    value: "back_select"
                                }
                            )
                        )
                    ]
                });
            }
        }

        if(interaction.isStringSelectMenu() && interaction.customId === "ticket_secondary") {
            const options = interaction.values[0];

            if(options === "change_panel") {
                const modal = new ModalBuilder().setCustomId("change_panel").setTitle("Change Panel");

                const text = new TextInputBuilder()
                .setCustomId("text_modal")
                .setLabel("Edit the panel message")
                .setPlaceholder("Type here ✏")
                .setStyle(2)
                .setValue(`${ticket.config_inside.text}`);

                modal.addComponents(new ActionRowBuilder().addComponents(text));
                
                return interaction.showModal(modal);
            }

            if(options === "change_thumbnail") {
                const modal = new ModalBuilder()
                .setCustomId("modal_change_thumbnail")
                .setTitle("Change Thumbnail");

                const panel = new TextInputBuilder()
                .setCustomId("change_thumbnail")
                .setLabel("What will be the new image?")
                .setRequired(true)
                .setStyle(1)
                .setPlaceholder("Enter a URL!");

                modal.addComponents(new ActionRowBuilder().addComponents(panel));
                
                return interaction.showModal(modal);
            }

            if(options === "reset") {
                ticket.config_inside.text = "👥 **| User:** {user} \n\n💻 **| Ticket Reason:** {reason}  \n\n 🔐** | Ticket Code: {code} ** \n\n🔰 **| Information:** __*Welcome to your Ticket! Wait until a **STAFF** member assists you. Avoid tagging multiple times to prevent penalties!*__ \n\n 🧰 **| Ticket Assumed: **{assumed}";
                interaction.reply({
                    content: "Successfully reset!",
                    ephemeral: true
                });

                fs.writeFileSync('json/config.ticket.json', JSON.stringify(ticket));
            }

            if(options === "back_select") {
                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Manage your ticket!")
                        .setDescription("🔐 - Ticket: Manage some aspects of the ticket \n\n 🔔 - Main: Change some main settings")
                    ],
                    components: [
                        new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
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
                    ]
                });
            }
        }

        if(interaction.isStringSelectMenu() && interaction.customId === "main_1") {
            const options = interaction.values[0];
            if(options === "change_staff_role") {
                const modal = new ModalBuilder().setCustomId("modal_role").setTitle("Role Management");

                const id = new TextInputBuilder()
                .setCustomId("role_id")
                .setLabel("Enter a role ID")
                .setPlaceholder("Type here ✏")
                .setStyle(1);

                modal.addComponents(new ActionRowBuilder().addComponents(id));
                
                return interaction.showModal(modal);
            }
            if(options === "change_log_channel") {
                const modal = new ModalBuilder()
                .setCustomId("modal_change_logs")
                .setTitle("Change Logs Channel");

                const id = new TextInputBuilder()
                .setCustomId("log_channel_id")
                .setLabel("Enter the log channel ID")
                .setStyle(1)
                .setValue(`${interaction.channel.id}`);

                modal.addComponents(new ActionRowBuilder().addComponents(id));
                
                return interaction.showModal(modal);
            }
            if(options === "change_ticket_category_id") {
                const modal = new ModalBuilder()
                .setCustomId("modal_change_category")
                .setTitle("Change Category");

                const id = new TextInputBuilder()
                .setCustomId("category_id")
                .setLabel("Change the ticket category")
                .setStyle(1)
                .setPlaceholder("Enter an ID");

                modal.addComponents(new ActionRowBuilder().addComponents(id));
                
                return interaction.showModal(modal);
            }
            if(options === "change_evaluation_channel") {
                const modal = new ModalBuilder()
                .setCustomId("modal_change_evaluation")
                .setTitle("Change Evaluation Channel");

                const id = new TextInputBuilder()
                .setCustomId("evaluation_channel_id")
                .setLabel("Enter a channel ID")
                .setStyle(1)
                .setPlaceholder("Enter an ID");

                modal.addComponents(new ActionRowBuilder().addComponents(id));
                
                return interaction.showModal(modal);
            }
            if(options === "back_select") {
                interaction.update({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Manage your ticket!")
                        .setDescription("🔐 - Ticket: Manage some aspects of the ticket \n\n 🔔 - Main: Change some main settings")
                    ],
                    components: [
                        new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
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
                    ]
                });
            }
        }

        if(interaction.isModalSubmit() && interaction.customId === "modal_change_evaluation") {
            const thumb = interaction.fields.getTextInputValue("evaluation_channel_id");
            const channel = interaction.guild.channels.cache.get(thumb);

            if(!channel) {
                interaction.reply({ content: "This channel does not exist!", ephemeral: true });
                return;
            }
            ticket.config_main.evaluation_channel = thumb;

            fs.writeFileSync('json/config.ticket.json', JSON.stringify(ticket));

            interaction.reply({
                content: `Evaluation channel changed successfully!`,
                ephemeral: true
            });
        }

        if(interaction.isModalSubmit() && interaction.customId === "modal_change_category") {
            const thumb = interaction.fields.getTextInputValue("category_id");
            const channel = interaction.guild.channels.cache.get(thumb);

            if(!channel) {
                interaction.reply({ content: "This category does not exist!", ephemeral: true });
                return;
            }
            ticket.config_main.ticket_category = thumb;

            fs.writeFileSync('json/config.ticket.json', JSON.stringify(ticket));

            interaction.reply({
                content: `Ticket category changed successfully!`,
                ephemeral: true
            });
        }

        if(interaction.isModalSubmit() && interaction.customId === "modal_role") {
            const thumb = interaction.fields.getTextInputValue("role_id");
            const channel = interaction.guild.roles.cache.get(thumb);

            if(!channel) {
                interaction.reply({ content: "This role does not exist!", ephemeral: true });
                return;
            }
            ticket.config_main.staff_role = thumb;

            fs.writeFileSync('json/config.ticket.json', JSON.stringify(ticket));

            interaction.reply({
                content: `Staff role changed successfully!`,
                ephemeral: true
            });
        }

        if(interaction.isModalSubmit() && interaction.customId === "modal_change_logs") {
            const thumb = interaction.fields.getTextInputValue("log_channel_id");
            const channel = interaction.guild.channels.cache.get(thumb);

            if(!channel) {
                interaction.reply({ content: "This channel does not exist!", ephemeral: true });
                return;
            }
            ticket.config_main.log_channel = thumb;

            fs.writeFileSync('json/config.ticket.json', JSON.stringify(ticket));

            interaction.reply({
                content: `Logs channel changed successfully!`,
                ephemeral: true
            });
        }

        if(interaction.isModalSubmit() && interaction.customId === "change_panel") {
            const thumb = interaction.fields.getTextInputValue("text_modal");
            ticket.config_inside.text = thumb;

            fs.writeFileSync('json/config.ticket.json', JSON.stringify(ticket));

            interaction.reply({
                content: `Panel changed successfully!`,
                ephemeral: true
            });
        }

        if(interaction.isModalSubmit() && interaction.customId === "modal_change_thumbnail") {
            const thumb = interaction.fields.getTextInputValue("change_thumbnail");
            ticket.config_inside.thumbnail = thumb;

            fs.writeFileSync('json/config.ticket.json', JSON.stringify(ticket));

            interaction.reply({
                content: `Thumbnail changed successfully!`,
                ephemeral: true
            });
        }
    }
};
