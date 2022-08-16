const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { registerUser } = require('../mongoose.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('marriage')
		.setDescription('Информация о браке')
        .addUserOption(option =>
            option.setName('пользователь')
                .setDescription('Пользователь для просмотра информации')),
	async execute(interaction) {
        const user = await registerUser(interaction.options.getUser('пользователь') || interaction.user.id);
        const userUser = interaction.options.getUser('пользователь') || interaction.user.id
        const married = user.married > 0;
        if (!married) {
            await interaction.reply({ embeds: [new MessageEmbed().setTitle('Пользователь не женат')], ephemeral: true }).catch(error => {console.log(error)});
            return;
        } else {
            if (await interaction.guild.members.cache.has(String(user.married))) {
                const partner = await interaction.guild.members.fetch(String(user.married));
                const partnerUser = await registerUser(partner.id);
                const marriedEmbed = new MessageEmbed()
                    .setTitle(`Пользователь ${userUser.username} женат с пользователем ${partner.displayName}`)
                    .addFields(
                        { name: 'Супруг:', value: `Имя: ${userUser}\nКоины: ${user.tokens}` },
                        { name: 'Супруга:', value: `Имя: ${partner}\nКоины: ${partnerUser.tokens}` }
                    )
                    .setColor('0xf1c40f')
                await interaction.reply({ embeds: [marriedEmbed], ephemeral: true }).catch(error => {console.log(error)});
            } else {
                await interaction.reply({ embeds: [new MessageEmbed().setTitle('Не удалось найти вашу супругу на сервере!')], ephemeral: true }).catch(error => {console.log(error)});
            }
        }
	},
};