const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { addTokens } = require('../mongoose.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_coins')
		.setDescription('Выдать коины игроку')
			.addUserOption(option =>
				option.setName('пользователь')
					.setDescription('Пользователь которому вы желаете выдать токены')
					.setRequired(true))
            .addIntegerOption(option =>
                option.setName('количество')
                    .setDescription('Количество коинов которое вы хотите выдать')
                    .setRequired(true))
        .setDefaultMemberPermissions(8),
	async execute(interaction) {
		const user = interaction.options.getUser('пользователь');
		const tokens = interaction.options.getInteger('количество');
        await addTokens(user.id, tokens)
        const tokendsEmbed = new MessageEmbed() 
		.setTitle(`Пользователю ${user.username} было добавлено ${tokens} Velvet Coins`)
		.setColor('0x992d22')
		await interaction.reply({ embeds: [tokendsEmbed], ephemeral: true }).catch(error => {console.log(error)});
	},
};