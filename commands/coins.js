const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getTokens } = require('../mongoose.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coins')
		.setDescription('Количество коинов на вашем балансе')
			.addUserOption(option =>
				option.setName('пользователь')
					.setDescription('Пользователь коины которого вы желаете посмотреть')
					.setRequired(false)),
	async execute(interaction) {
		const user = interaction.options.getUser('пользователь');
		const tokens = await getTokens(user || interaction.user.id);
        const tokendsEmbed = user ? new MessageEmbed() 
		.setTitle(`На счету ${user.username}: ${tokens} Velvet Coins`)
		.setColor('0x206694') : new MessageEmbed()
		.setTitle(`На вашем счету: ${tokens} Velvet Coins`)
		.setColor('0x206694')
		await interaction.reply({ embeds: [tokendsEmbed], ephemeral: true }).catch(error => {console.log(error)});
	},
};