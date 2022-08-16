const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Изменить настройку бота')
        .addStringOption(option =>
            option.setName('параметр')
                .setDescription('Выбор параметра для изменения')
                .setRequired(true)
                .addChoices(
                    { name: 'Коины ежедневно', value: 'timely' },
                    { name: 'Коины еженедельно', value: 'weekly' },
                    { name: 'Цена на брак', value: 'wedding' },
                ))
        .addIntegerOption(option =>
            option.setName('значение')
                .setDescription('Значение параметра')
                .setRequired(true))
        .setDefaultMemberPermissions(8),
	async execute(interaction) {
        const parameter = interaction.options.getString('параметр');
        const value = interaction.options.getInteger('значение');
        const cfg = require('../json/config.json');
        switch (parameter) {
            case 'timely':
                cfg.timely = value;
                break;
            case 'weekly':
                cfg.weekly = value;
                break;
            case 'wedding':
                cfg.wedding = value;
                break;
            default:
                interaction.reply({ content: '**Неизвестный параметр**', ephemeral: true }).catch(error => {console.log(error)});
                return;
        }
        require('fs').writeFileSync('json/config.json', JSON.stringify(cfg, null, 2));
        const cfgEmbed = new MessageEmbed()
            .setTitle(`Параметр ${parameter} успешно изменен на ${value}`)
            .setColor('0x2ecc71')
		await interaction.reply({ embeds: [cfgEmbed], ephemeral: true }).catch(error => {console.log(error)});
	},
};