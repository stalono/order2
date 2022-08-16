const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { registerUser } = require('../mongoose.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('weekly')
		.setDescription('Забрать еженедельный бонус'),
	async execute(interaction) {
        const { weekly } = require('../json/config.json');
        const user = await registerUser(interaction.user.id);
        const bonus = Number(weekly);
        if (user.weekly + 604800 > Math.floor(Date.now() / 1000)) {
            const left = user.weekly + 604800 - Math.floor(Date.now() / 1000);
            const leftMinutes = Math.floor(left / 60);
            const leftEmbed = new MessageEmbed()
                .setTitle(`Вы уже забирали еженедельный бонус! Вам осталось ждать ${leftMinutes} минут.`)
                .setColor('0xe74c3c')
            interaction.reply({ embeds: [leftEmbed], ephemeral: true }).catch(error => {console.log(error)});
        } else {
            user.weekly = Math.floor(Date.now() / 1000);
            const tokens = user.tokens + bonus;
            user.tokens = tokens;
            user.save();
            const tokensEmbed = new MessageEmbed()
                .setTitle(`Вы забрали еженедельный бонус! Вам начислено ${bonus} токенов.`)
                .setColor('0x2ecc71')
            interaction.reply({ embeds: [tokensEmbed], ephemeral: true }).catch(error => {console.log(error)});
        }
	},
};