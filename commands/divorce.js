const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { registerUser } = require('../mongoose.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('divorce')
		.setDescription('Расторгнуть брак'),
	async execute(interaction) {
        const user = await registerUser(interaction.user.id);
        const married = user.married > 0;
        if (!married) {
            await interaction.reply({ embeds: [new MessageEmbed().setTitle('Вы не женаты').setColor('0xe74c3c')], ephemeral: true }).catch(error => {console.log(error)});
            return;
        } else {
            const user2 = await registerUser(user.married);
            user.married = 0;
            user2.married = 0;
            user.save();
            user2.save();
            await interaction.reply({ embeds: [new MessageEmbed().setTitle('Вы успешно расторгли брак').setColor('0x992d22')], ephemeral: true }).catch(error => {console.log(error)});
        }
	},
};