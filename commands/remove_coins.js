const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { removeTokens } = require('../mongoose.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove_coins')
		.setDescription('Отнять коины у игрока')
			.addUserOption(option =>
				option.setName('пользователь')
					.setDescription('Пользователь у которого вы желаете отнять токены')
					.setRequired(true))
            .addIntegerOption(option =>
                option.setName('количество')
                    .setDescription('Количество коинов которое вы желаете отнять')
                    .setRequired(true))
        .setDefaultMemberPermissions(8),
	async execute(interaction) {
		const user = interaction.options.getUser('пользователь');
		const tokens = interaction.options.getInteger('количество');
        await removeTokens(user.id, tokens)
        const tokendsEmbed = new MessageEmbed() 
		.setTitle(`У пользователя ${user.username} было отнято ${tokens} Velvet Coins`)
		.setColor('0x992d22')
		await interaction.reply({ embeds: [tokendsEmbed], ephemeral: true }).catch(error => {console.log(error)});
	},
};