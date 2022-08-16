const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Статус бота'),
	async execute(interaction) {
		await interaction.reply({ content: '**Бот активен**', ephemeral: true }).catch(error => {console.log(error)});
	},
};