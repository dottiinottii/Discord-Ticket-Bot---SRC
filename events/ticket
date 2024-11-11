const Discord = require("discord.js");
const config1 = require("../config.json");
const ticket = require("../json/config.ticket.json");
const { QuickDB } = require("quick.db");
const db = new QuickDB({ table: "ticket" });
const randomString = require("randomized-string");
const fs = require('fs');
const assumedFilePath = "json/assumed.json";
function readAssumedData() {
  try {
    const data = fs.readFileSync(assumedFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}
function saveAssumedData(data) {
  fs.writeFileSync(assumedFilePath, JSON.stringify(data, null, 4), "utf8");
}

module.exports = {
    name: 'ticket',
    async execute(interaction, message, client) {
        const rawData = fs.readFileSync('json/config.ticket.json');
        const config = JSON.parse(rawData);

        if(interaction.customId === "open-ticket") {
            const cleanUsername = interaction.user.username
                .toLowerCase()
                .replace(/[\s._]/g, "");

            const channel = interaction.guild.channels.cache.find(
                (c) => c.name === `🎫-${cleanUsername}`
            );

            if (channel)
                return interaction.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                        .setColor("#ce717b")
                        .setDescription(
                            `${interaction.user} You already have an open ticket in ${channel}.`
                        ),
                    ],
                    components: [
                        new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setLabel("Go to your Ticket")
                                    .setStyle(Discord.ButtonStyle.Link)
                                    .setURL(channel.url)
                            ),
                    ],
                    ephemeral: true,
                });

            const modal = new Discord.ModalBuilder()
                .setCustomId("modal_ticket")
                .setTitle("Describe the reason for the ticket");

            const text = new Discord.TextInputBuilder()
                .setCustomId("reason")
                .setLabel("Describe the reason for the ticket")
                .setPlaceholder("Type here ✏")
                .setStyle(1);

            modal.addComponents(new Discord.ActionRowBuilder().addComponents(text));
            
            return interaction.showModal(modal);
        }

        if(interaction.isModalSubmit() && interaction.customId === "modal_ticket") {
            const reason = interaction.fields.getTextInputValue("reason");
            const permissionOverwrites = [
                {
                    id: interaction.guild.id,
                    deny: ["ViewChannel"],
                },
                {
                    id: interaction.user.id,
                    allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions"],
                },
                {
                    id: ticket.config_main.staff_role,
                    allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions"],
                },
            ];

            interaction.reply({
                content: `Your Ticket is being opened, please wait...`,
                ephemeral: true
            });

            await db.add(`ticketCount_${interaction.user.id}`, 1);
            
            const abc = await db.get(`ticketCount_${interaction.user.id}`);
            var randomToken = randomString
                .generate({ length: 6, charset: "hex" })
                .toUpperCase();

            const ticketCode = randomToken;
            
            const staffRole = interaction.guild.roles.cache.get(ticket.config_main.staff_role);
            const channel = await interaction.guild.channels.create({
                name: `🎫-${interaction.user.username}`,
                type: 0,
                parent: ticket.config_main.ticket_category,
                topic: interaction.user.id,
                permissionOverwrites: permissionOverwrites,
            }).then((channels) => {
                interaction.editReply({
                    content: `${interaction.user} Your Ticket was opened in the channel: ${channels.url}`,
                    components: [
                        new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setStyle(5)
                                    .setURL(channels.url)
                                    .setLabel("Go to the ticket")
                            )
                    ]
                });
                const user = interaction.user;

                db.set(`ticket_${channels.id}`, {
                    user: interaction.user.id,
                    reason: reason,
                    code: ticketCode,
                    staff: "No one has taken over"
                });

                function replaceVariables(text, user, reason, code) {
                    return text
                        .replace('{user}', user)
                        .replace('{reason}', reason)
                        .replace('{assumed}', "No one has taken over")
                        .replace('{code}', code);
                }

                const embeds = new Discord.EmbedBuilder()
                    .setDescription(replaceVariables(config.inside_config.text, user, reason, ticketCode));
                
                if(ticket.inside_config.thumbnail) {
                    embeds.setImage(`${ticket.inside_config.thumbnail}`);
                }

                channels.send({
                    content: `||${staffRole} - ${interaction.user}||`,
                    embeds: [embeds],
                    components: [
                        new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                    .setCustomId("exit_ticket")
                                    .setLabel("Exit ticket")
                                    .setStyle(Discord.ButtonStyle.Danger),
                                new Discord.ButtonBuilder()
                                    .setCustomId("member_panel")
                                    .setLabel("Member Panel")
                                    .setStyle(2),
                                new Discord.ButtonBuilder()
                                    .setCustomId("staff_panel")
                                    .setLabel("Staff Panel")
                                    .setStyle(2),
                                new Discord.ButtonBuilder()
                                    .setCustomId("take_ticket")
                                    .setLabel("Take over Ticket")
                                    .setStyle(3),
                                new Discord.ButtonBuilder()
                                    .setCustomId("finalize_ticket")
                                    .setLabel("Finalize Ticket")
                                    .setStyle(Discord.ButtonStyle.Danger),
                            )
                    ]
                });

                const logChannel = interaction.guild.channels.cache.get(ticket.config_main.log_channel);
                if(!logChannel) return;
                logChannel.send({
                    content: "New Ticket Opened",
                    embeds: [
                        new Discord.EmbedBuilder()
                        .addFields(
                            { name: "👥 User", value: `${interaction.user} \`${interaction.user.id}\``, inline: true },
                            { name: "🎫 Ticket", value: `${channels.url}`, inline: true },
                            { name: "🔰 Open Tickets", value: `${abc}`, inline: true },
                            { name: "🔐 Ticket Code", value: `\`${ticketCode}\``, inline: true },
                            { name: "⚠ Ticket Reason", value: `\`${reason}\``, inline: true },
                        )
                    ]
                });
            });
        }

        if(interaction.customId === "staff_panel") {
            const user1 = interaction.guild.members.cache.get(interaction.user.id);
            const roleIdToCheck = ticket.config_main.staff_role;

            const hasRequiredRole = user1.roles.cache.has(roleIdToCheck);

            if (!hasRequiredRole) {
                await interaction.reply({ content: 'You do not have permission to use this button.', ephemeral: true });
                return;
            }

            interaction.reply({
                content: `${interaction.user}`,
                embeds: [
                    new Discord.EmbedBuilder()
                    .setDescription("✅ | Staff Panel Opened Successfully!")
                ],
                ephemeral: true,
                components: [
                    new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                        .setCustomId("staff_panel_options")
                        .setPlaceholder("Choose an option")
                        .addOptions(
                            { label: "Call User", description: "Notify the user", value: "Call_User" },
                            { label: "Add a user", description: "Add a user to the ticket", value: "add_user" },
                            { label: "Remove a user", description: "Remove a user from the ticket", value: "remove_user" },
                        )
                    )
                ]
            });
        }

        if(interaction.isStringSelectMenu() && interaction.customId === "staff_panel_options") {
            const options = interaction.values[0];
            const tickets = await db.get(`ticket_${interaction.channel.id}`); 
            const userId = tickets.user;
            const user = interaction.guild.members.cache.get(userId);
            const reason = tickets.reason;
            const code = tickets.code;
            const staff = interaction.guild.members.cache.get(tickets.staff);

            if(options === "Call_User") {
                user.send({
                    content: `The staff member ${interaction.user} is calling you, please see the reason in the ticket: ${interaction.channel.url}`,
                    components: [
                        new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                            .setLabel("Go to the ticket")
                            .setStyle(5)
                            .setURL(interaction.channel.url)
                        )
                    ]
                });

                interaction.reply({
                    content: "User has been notified",
                    ephemeral: true
                });
            }

            if(options === "add_user") {
                interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder().setDescription(
                            `👤 | Tag or send the ID of the user you want to add!`
                        ),
                    ],
                    components: [],
                    ephemeral: true,
                });

                const filter = (i) => i.member.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({
                    filter,
                });

                collector.on("collect", async (collect) => {
                    const user_content = await collect.content;
                    collect.delete();

                    const user_collected = interaction.guild.members.cache.get(user_content);

                    if (!user_collected)
                        return interaction.editReply({
                            embeds: [
                                new Discord.EmbedBuilder().setDescription(
                                    `Could not find the user \`${user_content}\`, please try again!`
                                ),
                            ],
                            components: [],
                            ephemeral: true,
                        });

                    if (interaction.channel.permissionsFor(user_collected.id).has("ViewChannel"))
                        return interaction.editReply({
                            embeds: [
                                new Discord.EmbedBuilder().setDescription(
                                    `The user ${user_collected}(\`${user_collected.id}\`) already has access to the ticket!`
                                ),
                            ],
                            components: [],
                            ephemeral: true,
                        });

                    const permissionOverwrites = [
                        {
                            id: interaction.guild.id,
                            deny: ["ViewChannel"],
                        },
                        {
                            id: user.id,
                            allow: [
                                "ViewChannel",
                                "SendMessages",
                                "AttachFiles",
                                "AddReactions",
                                "ReadMessageHistory",
                            ],
                        },
                        {
                            id: user_collected.id,
                            allow: [
                                "ViewChannel",
                                "SendMessages",
                                "AttachFiles",
                                "AddReactions",
                                "ReadMessageHistory",
                            ],
                        },
                        {
                            id: ticket.config_main.staff_role,
                            allow: [
                                "ViewChannel",
                                "SendMessages",
                                "AttachFiles",
                                "AddReactions",
                                "ReadMessageHistory",
                            ],
                        },
                    ];

                    await interaction.channel.edit({
                        permissionOverwrites: permissionOverwrites,
                    });

                    interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder().setDescription(
                                `The user ${user_collected}(\`${user_collected.id}\`) was added successfully!`
                            ),
                        ],
                        components: [],
                        ephemeral: true,
                    });

                    collector.stop();
                });
            }

            if(options === "remove_user") {
                interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder().setDescription(
                            `👤 | Tag or send the ID of the user you want to remove!`
                        ),
                    ],
                    components: [],
                    ephemeral: true,
                });

                const filter = (i) => i.member.id === interaction.user.id;
                const collector = interaction.channel.createMessageCollector({
                    filter,
                });

                collector.on("collect", async (collect) => {
                    const user_content = await collect.content;
                    collect.delete();

                    const user_collected = interaction.guild.members.cache.get(user_content);

                    if (!user_collected)
                        return interaction.editReply({
                            embeds: [
                                new Discord.EmbedBuilder().setDescription(
                                    `Could not find the user \`${user_content}\`, please try again!`
                                ),
                            ],
                            components: [],
                            ephemeral: true,
                        });

                    if (!interaction.channel.permissionsFor(user_collected.id).has("ViewChannel"))
                        return interaction.editReply({
                            embeds: [
                                new Discord.EmbedBuilder().setDescription(
                                    `The user ${user_collected}(\`${user_collected.id}\`) does not have access to the ticket!`
                                ),
                            ],
                            components: [],
                            ephemeral: true,
                        });

                    const staffRoleId = ticket.config_main.staff_role;
                    const permissionOverwrites = [
                        {
                            id: interaction.guild.id,
                            deny: ["ViewChannel"],
                        },
                        {
                            id: user_collected.id,
                            deny: ["ViewChannel"],
                        },
                        {
                            id: user.id,
                            allow: [
                                "ViewChannel",
                                "SendMessages",
                                "AttachFiles",
                                "AddReactions",
                                "ReadMessageHistory",
                            ],
                        },
                        {
                            id: staffRoleId,
                            allow: [
                                "ViewChannel",
                                "SendMessages",
                                "AttachFiles",
                                "AddReactions",
                                "ReadMessageHistory",
                            ],
                        },
                    ];

                    await interaction.channel.edit({
                        permissionOverwrites: permissionOverwrites,
                    });

                    interaction.editReply({
                        embeds: [
                            new Discord.EmbedBuilder().setDescription(
                                `The user ${user_collected}(\`${user_collected.id}\`) was removed successfully!`
                            ),
                        ],
                        components: [],
                        ephemeral: true,
                    });

                    collector.stop();
                });
            }
        }

        if(interaction.customId === "finalize_ticket") {
            const tickets = await db.get(`ticket_${interaction.channel.id}`);
            const userId = tickets.user;
            const user = interaction.guild.members.cache.get(userId);
            const reason = tickets.reason;
            const code = tickets.code;
            const logs = interaction.guild.channels.cache.get(ticket.config_main.log_channel);
            const assumed = interaction.guild.members.cache.get(tickets.staff);
            const assumedId = tickets.staff;

            const user1 = interaction.guild.members.cache.get(interaction.user.id);
            const roleIdToCheck = ticket.config_main.staff_role;

            const hasRequiredRole = user1.roles.cache.has(roleIdToCheck);

            if (!hasRequiredRole) {
                await interaction.reply({ content: 'You do not have permission to use this button.', ephemeral: true });
                return;
            }

            interaction.reply({
                content: `This Ticket will be closed in a few seconds...`
            });

            setTimeout(() => {
                interaction.channel.delete();
            }, 5000);

            if(!logs) return console.log("Logs Channel not configured");

            logs.send({
                content: "Ticket Finalized",
                embeds: [
                    new Discord.EmbedBuilder()
                    .addFields(
                        { name: `Ticket Owner`, value: `${user}`, inline: true },
                        { name: `Closed By`, value: `${interaction.user}`, inline: true },
                        { name: `Who Assumed?`, value: `${assumed ?? `No one took over`}`, inline: true },
                        { name: `Ticket Reason`, value: `\`${reason}\``, inline: true },
                        { name: `Ticket Code`, value: `\`${code}\``, inline: true }
                    )
                ]
            });

            const logsData = require('../json/logs.json');

            const userTicketId = user.id;
            const newUserLog = {
                ticket_owner: userTicketId,
                closed_ticket: interaction.user.id,
                assumed: assumedId ?? 'No one took over',
                reason: reason,
                code: code,
            };

            if (!logsData[userTicketId]) {
                logsData[userTicketId] = [newUserLog];
            } else {
                logsData[userTicketId].push(newUserLog);
            }

            fs.writeFileSync('json/logs.json', JSON.stringify(logsData, null, 2), 'utf-8');

            user.send({
                content: "Ticket Finalized",
                embeds: [
                    new Discord.EmbedBuilder()
                    .addFields(
                        { name: `Ticket Owner`, value: `${user}`, inline: true },
                        { name: `Closed By`, value: `${interaction.user}`, inline: true },
                        { name: `Who Assumed?`, value: `${assumed ?? `No one took over`}`, inline: true },
                        { name: `Ticket Reason`, value: `\`${reason}\``, inline: true },
                        { name: `Ticket Code`, value: `\`${code}\``, inline: true }
                    )
                ],
                components: [
                    new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId("rate_service")
                        .setLabel("Rate the service!")
                        .setEmoji("❤")
                        .setStyle(3)
                    )
                ]
            });

            db.set(`final_ticket_${user.id}`, {
                ticket_owner: userTicketId,
                closed_ticket: interaction.user.id,
                assumed: assumedId ?? 'No one took over',
                reason: reason,
                code: code,
            });
        }

        if (interaction.customId === "rate_service") {
            const modal = new Discord.ModalBuilder()
                .setCustomId("modal_rate")
                .setTitle("Rate our service");

            const text = new Discord.TextInputBuilder()
                .setCustomId("rate_number")
                .setLabel("Choose from 1 to 5")
                .setPlaceholder("Type here ✏")
                .setStyle(1)
                .setMaxLength(1)
                .setValue("1");

            const description = new Discord.TextInputBuilder()
                .setCustomId("rate_description")
                .setLabel("Tell us more about our service")
                .setPlaceholder("Type here ✏")
                .setStyle(1)
                .setValue("I really liked the service, quick and practical");

            modal.addComponents(new Discord.ActionRowBuilder().addComponents(text));
            modal.addComponents(new Discord.ActionRowBuilder().addComponents(description));
            
            return interaction.showModal(modal);
        }

        if(interaction.isModalSubmit() && interaction.customId === "modal_rate") {
            const rate = interaction.fields.getTextInputValue("rate_number");
            const description = interaction.fields.getTextInputValue("rate_description");
            const ratingChannel = interaction.client.channels.cache.get(ticket.config_main.rating_channel);
            const tickets = await db.get(`final_ticket_${interaction.user.id}`);

            switch (rate) {
                case "1": {
                    interaction.update({content: "Successfully sent!", components: [], embeds: []});
                    ratingChannel.send({
                        content: "New Rating",
                        embeds: [
                            new Discord.EmbedBuilder()
                            .addFields({ name: `User`, value: `${interaction.user}`, inline: true })
                            .addFields({ name: `Description`, value: `${description}`, inline: true })
                            .addFields({ name: `Rating:`, value: `⭐`, inline: true })
                            .addFields({ name: `Who Assumed:`, value: `${interaction.client.users.cache.get(tickets.assumed) ?? "`No one took over`"}`, inline: true })
                            .addFields({ name: `Ticket Code:`, value: `\`${tickets.code}\``, inline: true })
                            .addFields({ name: `Reason:`, value: `\`${tickets.reason}\``, inline: true })
                        ]
                    });
                    db.delete(`final_ticket_${interaction.user.id}`);
                } break;

                case "2": {
                    interaction.update({content: "Successfully sent!", components: [], embeds: []});
                    ratingChannel.send({
                        content: "New Rating",
                        embeds: [
                            new Discord.EmbedBuilder()
                            .addFields({ name: `User`, value: `${interaction.user}`, inline: true })
                            .addFields({ name: `Description`, value: `${description}`, inline: true })
                            .addFields({ name: `Rating:`, value: `⭐⭐`, inline: true })
                            .addFields({ name: `Who Assumed:`, value: `${interaction.client.users.cache.get(tickets.assumed) ?? "`No one took over`"}`, inline: true })
                            .addFields({ name: `Ticket Code:`, value: `\`${tickets.code}\``, inline: true })
                            .addFields({ name: `Reason:`, value: `\`${tickets.reason}\``, inline: true })
                        ]
                    });
                    db.delete(`final_ticket_${interaction.user.id}`);
                } break;

                case "3": {
                    interaction.update({content: "Successfully sent!", components: [], embeds: []});
                    ratingChannel.send({
                        content: "New Rating",
                        embeds: [
                            new Discord.EmbedBuilder()
                            .addFields({ name: `User`, value: `${interaction.user}`, inline: true })
                            .addFields({ name: `Description`, value: `${description}`, inline: true })
                            .addFields({ name: `Rating:`, value: `⭐⭐⭐`, inline: true })
                            .addFields({ name: `Who Assumed:`, value: `${interaction.client.users.cache.get(tickets.assumed) ?? "`No one took over`"}`, inline: true })
                            .addFields({ name: `Ticket Code:`, value: `\`${tickets.code}\``, inline: true })
                            .addFields({ name: `Reason:`, value: `\`${tickets.reason}\``, inline: true })
                        ]
                    });
                    db.delete(`final_ticket_${interaction.user.id}`);
                } break;

                case "4": {
                    interaction.update({content: "Successfully sent!", components: [], embeds: []});
                    ratingChannel.send({
                        content: "New Rating",
                        embeds: [
                            new Discord.EmbedBuilder()
                            .addFields({ name: `User`, value: `${interaction.user}`, inline: true })
                            .addFields({ name: `Description`, value: `${description}`, inline: true })
                            .addFields({ name: `Rating:`, value: `⭐⭐⭐⭐`, inline: true })
                            .addFields({ name: `Who Assumed:`, value: `${interaction.client.users.cache.get(tickets.assumed) ?? "`No one took over`"}`, inline: true })
                            .addFields({ name: `Ticket Code:`, value: `\`${tickets.code}\``, inline: true })
                            .addFields({ name: `Reason:`, value: `\`${tickets.reason}\``, inline: true })
                        ]
                    });
                    db.delete(`final_ticket_${interaction.user.id}`);
                } break;

                case "5": {
                    interaction.update({content: "Successfully sent!", components: [], embeds: []});
                    ratingChannel.send({
                        content: "New Rating",
                        embeds: [
                            new Discord.EmbedBuilder()
                            .addFields({ name: `User`, value: `${interaction.user}`, inline: true })
                            .addFields({ name: `Description`, value: `${description}`, inline: true })
                            .addFields({ name: `Rating:`, value: `⭐⭐⭐⭐⭐`, inline: true })
                            .addFields({ name: `Who Assumed:`, value: `${interaction.client.users.cache.get(tickets.assumed) ?? "`No one took over`"}`, inline: true })
                            .addFields({ name: `Ticket Code:`, value: `\`${tickets.code}\``, inline: true })
                            .addFields({ name: `Reason:`, value: `\`${tickets.reason}\``, inline: true })
                        ]
                    });
                    db.delete(`final_ticket_${interaction.user.id}`);
                } break;

                default: {
                    interaction.reply({content: `Please choose a number from 1 to 5`});
                } break;
            }
        }

        if(interaction.customId === "take_ticket") {
            const tickets = await db.get(`ticket_${interaction.channel.id}`);
            const userId = tickets.user;
            const user = interaction.guild.members.cache.get(userId);
            const reason = tickets.reason;
            const code = tickets.code;

            const user1 = interaction.guild.members.cache.get(interaction.user.id);
            const roleIdToCheck = ticket.config_main.staff_role;

            const hasRequiredRole = user1.roles.cache.has(roleIdToCheck);

            if (!hasRequiredRole) {
                await interaction.reply({ content: 'You do not have permission to use this button.', ephemeral: true });
                return;
            }

            db.set(`ticket_${interaction.channel.id}`, {
                user: userId,
                reason: reason,
                code: code,
                staff: interaction.user.id
            });

            const staffUserId = interaction.user.id;
            const assumedData = readAssumedData();

            if (!assumedData[staffUserId]) {
                assumedData[staffUserId] = 0;
            }

            assumedData[staffUserId]++;

            saveAssumedData(assumedData);
            fs.writeFileSync("json/assumed.json", JSON.stringify(assumedData, null, 2));

            function replaceVariables(text, user, reason, code) {
                return text
                    .replace('{user}', user)
                    .replace('{reason}', reason)
                    .replace('{assumed}', `${interaction.user}`)
                    .replace('{code}', code);
            }

            const embeds = new Discord.EmbedBuilder()
                .setDescription(replaceVariables(config.inside_config.text, user, reason, code));
            
            if(ticket.inside_config.thumbnail) {
                embeds.setImage(`${ticket.inside_config.thumbnail}`);
            }

            user.send({
                embeds: [
                    new Discord.EmbedBuilder()
                    .setDescription(`Staff: ${interaction.user} has taken over your ticket in the channel: ${interaction.channel.url}`)
                ],
                components: [
                    new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                        .setLabel("Go to the Ticket")
                        .setStyle(5)
                        .setURL(`${interaction.channel.url}`)
                    )
                ]
            });

            interaction.update({
                embeds: [embeds],
                components: [
                    new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId("exit_ticket")
                        .setLabel("Exit ticket")
                        .setStyle(Discord.ButtonStyle.Danger),
                        new Discord.ButtonBuilder()
                        .setCustomId("member_panel")
                        .setLabel("Member Panel")
                        .setStyle(2),
                        new Discord.ButtonBuilder()
                        .setCustomId("staff_panel")
                        .setLabel("Staff Panel")
                        .setStyle(2),
                        new Discord.ButtonBuilder()
                        .setCustomId("take_ticket")
                        .setLabel("Take over Ticket")
                        .setDisabled(true)
                        .setStyle(3),
                        new Discord.ButtonBuilder()
                        .setCustomId("finalize_ticket")
                        .setLabel("Finalize Ticket")
                        .setStyle(Discord.ButtonStyle.Danger),
                    )
                ]
            });

            const logs = interaction.guild.channels.cache.get(ticket.config_main.log_channel);

            const configData = fs.readFileSync("json/assumed.json", "utf-8");
            const assumedConfig = JSON.parse(configData);

            const userId = interaction.user.id;
            const assumedCount = assumedConfig[userId];

            logs.send({
                content: "A Ticket has been assumed",
                embeds: [
                    new Discord.EmbedBuilder()
                    .addFields(
                        { name: "User", value: `${interaction.user}`, inline: true },
                        { name: "Channel", value: `${interaction.channel.url}`, inline: true },
                        { name: "Tickets Assumed", value: `${assumedCount}`, inline: true }
                    )
                ]
            });
        }

        if(interaction.customId === "member_panel") {
            interaction.reply({
                content: `${interaction.user}`,
                embeds: [
                    new Discord.EmbedBuilder()
                    .setDescription("✅ | Ticket Panel Opened Successfully!")
                ],
                ephemeral: true,
                components: [
                    new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                        .setCustomId("member_panel_options")
                        .setPlaceholder("Choose an option")
                        .addOptions(
                            { label: "Call Staff", description: "Call a staff member!", value: "Call_Staff" },
                            { label: "Create a call", description: "Create a call if necessary!", value: "call_create" },
                            { label: "Delete your call", description: "Delete the created call!", value: "del_call" },
                        )
                    )
                ]
            });
        }

        if(interaction.isStringSelectMenu() && interaction.customId === "member_panel_options") {
            const options = interaction.values[0];

            if(options === "Call_Staff") {
                const tickets = await db.get(`ticket_${interaction.channel.id}`);
                const userId = tickets.user;
                const user = interaction.guild.members.cache.get(userId);
                const reason = tickets.reason;
                const code = tickets.code;
                const staff = interaction.guild.members.cache.get(tickets.staff);

                if(interaction.user.id !== user.id) {
                    interaction.reply({
                        content: `Only the user: ${user} can use this function`
                    });
                }
                if(staff) {
                    staff.send({
                        content: `User: ${interaction.user} is waiting for you, please attend to them`,
                        components: [
                            new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                .setURL(interaction.channel.url)
                                .setLabel("Go to the Ticket")
                                .setStyle(5)
                            )
                        ]
                    });

                    interaction.reply({
                        content: "Successfully sent",
                        ephemeral: true
                    });
                } else {
                    interaction.reply({
                        content: "No one has taken over your ticket yet!",
                        ephemeral: true
                    });
                }
            }

            if (options === "call_create") {
                const channel_find = await interaction.guild.channels.cache.find(
                    (c) =>
                        c.name ===
                        `📞-${interaction.user.username.toLowerCase().replace(/ /g, "-")}`
                );

                if (channel_find)
                    return interaction.update({
                        embeds: [
                            new Discord.EmbedBuilder().setDescription(
                                `You already have an open call in ${channel_find}`
                            ),
                        ],
                        components: [
                            new Discord.ActionRowBuilder().addComponents(
                                new Discord.ButtonBuilder()
                                .setStyle(5)
                                .setLabel("Join the call")
                                .setURL(channel_find.url)
                            ),
                        ],
                        ephemeral: true,
                    });

                const permissionOverwrites = [
                    {
                        id: interaction.guild.id,
                        deny: ["ViewChannel"],
                    },
                    {
                        id: interaction.user.id,
                        allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions"],
                    },
                    {
                        id: ticket.config_main.staff_role,
                        allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions"],
                    },
                ];

                const channel = await interaction.guild.channels.create({
                    name: `📞-${interaction.user.username.toLowerCase().replace(/ /g, "-")}`,
                    type: 2,
                    parent: interaction.channel.parent,
                    permissionOverwrites: permissionOverwrites,
                });

                interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder().setDescription(
                            `Call successfully created in ${channel}`
                        ),
                    ],
                    components: [
                        new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder()
                            .setStyle(5)
                            .setLabel("Join the call")
                            .setURL(channel.url)
                        ),
                    ],
                    ephemeral: true,
                });
            }

            if (options === "del_call") {
                const channel_find = await interaction.guild.channels.cache.find(
                    (c) =>
                        c.name ===
                        `📞-${interaction.user.username.toLowerCase().replace(/ /g, "-")}`
                );

                if (!channel_find)
                    return interaction.update({
                        embeds: [
                            new Discord.EmbedBuilder().setDescription(
                                `You do not have an open call!`
                            ),
                        ],
                        components: [],
                        ephemeral: true,
                    });

                await channel_find.delete();

                interaction.update({
                    embeds: [
                        new Discord.EmbedBuilder().setDescription(
                            `Call successfully deleted!`
                        ),
                    ],
                    components: [],
                    ephemeral: true,
                });
            }
        }

        if(interaction.customId === "exit_ticket") {
            const tickets = await db.get(`ticket_${interaction.channel.id}`);
            const user = tickets.user;
            if(user !== interaction.user.id) {
                interaction.reply({
                    content: `Only the user <@${user}> can exit`,
                    ephemeral: true
                });
                return;
            }

            interaction.channel.edit({
                name: `closed-${interaction.user.username}`,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["ViewChannel"],
                    },
                    {
                        id: interaction.user.id,
                        deny: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions"],
                    },
                    {
                        id: ticket.config_main.staff_role,
                        allow: ["ViewChannel", "SendMessages", "AttachFiles", "AddReactions"],
                    },
                ],
            });

            interaction.reply({
                content: `<@&${ticket.config_main.staff_role}>`,
                embeds: [
                    new Discord.EmbedBuilder()
                    .setDescription("The ticket owner has left, click the button below to close the ticket")
                ],
                components: [
                    new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId("finalize_ticket")
                        .setLabel("Finalize Ticket")
                        .setStyle(Discord.ButtonStyle.Danger),
                    )
                ]
            });
        }
    }
};
