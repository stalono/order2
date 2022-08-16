const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Команды бота'),
	async execute(interaction) {
        const { timely, weekly, wedding } = require('../json/config.json');
        const embed = new MessageEmbed()
            .setTitle('Команды бота')
            .addFields(
                { name: '~ Коины ~', value: 'Коины это виртуальная валюта сервера, их можно получать ежедневно и еженедельно или от руководства сервера' },
                { name: '/coins', value: 'Количество ваших коинов' },
                { name: '/timely', value: 'Забрать ежедневную награду' },
                { name: '/weekly', value: 'Забрать еженедельную награду' },
                { name: '/paycoins', value: 'Перевести коины другому игроку' },
                { name: '~ Браки ~', value: 'Игроки могут создавать браки, для этого нужно обратиться к руководству сервера' },
                { name: '/marriage', value: 'Посмотреть активный брак игрока' },
                { name: '/divorce', value: 'Расторгнуть брак' },
                { name: '~ Награды ~', value: 'Бонусы можно забрать с помощью команды, браки создаёт администратор' },
                { name: 'Ежедневный бонус', value: `${timely} коинов` },
                { name: 'Еженедельный бонус', value: `${weekly} коинов` },
                { name: 'Свадьба', value: `${wedding} коинов` },
                )
            .setColor('0x3498db')
		await interaction.reply({ embeds: [embed], ephemeral: true }).catch(error => {console.log(error)});
	},
};