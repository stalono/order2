const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { registerUser } = require('../mongoose.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('marry')
		.setDescription('Поженить игроков')
			.addUserOption(option =>
				option.setName('первый-игрок')
					.setDescription('Первый пользователь которого вы желаете поженить')
					.setRequired(true))
            .addUserOption(option =>
                option.setName('второй-игрок')
                    .setDescription('Второй пользователь которого вы желаете поженить')
                    .setRequired(true))
		.setDefaultMemberPermissions(8),
	async execute(interaction) {
		const { wedding } = require('../json/config.json');
		const user1 = await registerUser(interaction.options.getUser('первый-игрок'));
		const user2 = await registerUser(interaction.options.getUser('второй-игрок'));
		const user1CanAfford = user1.tokens >= wedding;
		const user2CanAfford = user2.tokens >= wedding;
		const user1Married = user1.married > 0;
		const user2Married = user2.married > 0;
		const usersIsSame = user1.id === user2.id;
		const user1IsBot = user1.bot
		const user2IsBot = user2.bot
		const canMarry = user1CanAfford && user2CanAfford && !usersIsSame && !user1IsBot && !user2IsBot && !user1Married && !user2Married;
		if (canMarry) {
			user1.tokens -= wedding;
			user2.tokens -= wedding;
			user1.married = user2.id;
			user2.married = user1.id;
			user1.save();
			user2.save();
			const discordUser1 = interaction.options.getUser('первый-игрок');
			const discordUser2 = interaction.options.getUser('второй-игрок');
			const weddingEmbed = new MessageEmbed()
				.setTitle(`Вы успешно поженили пользователей ${discordUser1.username} и ${discordUser2.username}`)
				.setColor('0xf1c40f')
			const DM1 = await discordUser1.createDM().catch(error => {console.log(error)});
			const DM2 = await discordUser2.createDM().catch(error => {console.log(error)});
			const DM1Embed = new MessageEmbed()
				.setTitle(`Вы успешно поженились на пользователе ${discordUser2.username}`)
				.setColor('0xf1c40f')
			const DM2Embed = new MessageEmbed()
				.setTitle(`Вы успешно поженились на пользователе ${discordUser1.username}`)
				.setColor('0xf1c40f')
			DM1.send({ embeds: [DM1Embed], ephemeral: true }).catch(error => {console.log(error)});
			DM2.send({ embeds: [DM2Embed], ephemeral: true }).catch(error => {console.log(error)});
			DM1.delete().catch(error => {console.log(error)});
			DM2.delete().catch(error => {console.log(error)});
			await interaction.reply({ embeds: [weddingEmbed], ephemeral: true }).catch(error => {console.log(error)});
		} else {
			const errorEmbed = new MessageEmbed()
				.setTitle('У одного из пользователей не достаточно коинов, или он уже женат')
				.setColor('0x992d22')
			await interaction.reply({ embeds: [errorEmbed], ephemeral: true }).catch(error => {console.log(error)});
		}
	},
};