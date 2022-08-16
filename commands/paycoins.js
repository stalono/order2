const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { addTokens, removeTokens, getTokens } = require('../mongoose.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('paycoins')
		.setDescription('Отправить коины игроку')
			.addUserOption(option =>
				option.setName('пользователь')
					.setDescription('Пользователь которому вы желаете передать токены')
					.setRequired(true))
            .addIntegerOption(option =>
                option.setName('количество')
                    .setDescription('Количество коинов которое вы желаете отправить')
                    .setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getUser('пользователь');
		const tokens = interaction.options.getInteger('количество');
        const userCanAfford = await getTokens(interaction.user.id) >= tokens;
        if (userCanAfford) { await addTokens(user.id, tokens); await removeTokens(interaction.user.id, tokens); }
        const tokensEmbed = userCanAfford ? new MessageEmbed() 
		.setTitle(`Пользователю ${user.username} было отправлено ${tokens} Velvet Coins`)
		.setColor('0x2ecc71') : new MessageEmbed()
        .setTitle(`У вас недостаточно коинов`)
        .setColor('0xe74c3c');
		await interaction.reply({ embeds: [tokensEmbed], ephemeral: true }).catch(error => {console.log(error)});
	},
};