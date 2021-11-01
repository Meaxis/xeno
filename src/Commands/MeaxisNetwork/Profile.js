const Command = require('../../Structures/Command')
const fetch = require('node-fetch')
let Utils = require('../../Structures/Util')
const discord = require('discord.js')

Utils = new Utils()

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'profile',
            description: 'Fetches the author\'s MeaxisNetwork User',
            category: 'MeaxisNetwork',
            args: false
        })
    }

    async run(message) {
        let url = `https://api.meaxisnetwork.net/v3/users/search?from=discord&query=${message.author.id}`;
        console.log(url)

        let content = await fetch(url)
            .then(content => content.json());

        print(content)
        

        let Embed = new discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
            .setColor(Utils.getColor())
            .setTimestamp()
            .setTitle(content.username)
            .setThumbnail(content.avatar);

        for (let key of content) {
            let value = content[key]
            if (value && key !== 'titles') {
                Embed.addField(Utils.capitalise(key), value)
            }
        } 

        let list = []
        for (let key of content.titles) {
            list.push(key['name'])
        }

        if (list.length > 0) {
            Embed.addField('Titles', list.join(', '))
        }
        
        await message.channel.send({ embeds: [Embed]})
    }
}