const pagination = require('discord.js-pagination');
const Discord = require('discord.js');

module.exports = {
    name: "help",
    description: "The help command, what do you expect?",

    async run (client, message, args){
      message.delete()

        // Sort your commands into categories, and make seperate embeds for each category

        const commands = new Discord.MessageEmbed()
        .setTitle('Giveaway Commands')
        .addField('`edit-giveaway`', 'Edits Your Giveaway')
        .addField('`end-giveaway`', 'Ends The Giveaway') 
        .addField('`giveaway`', 'Starts A Giveaway')
        .addField('`start`', 'Also Starts A Giveaway')
        .setTimestamp()


        const pages = [
                commands,
               
                
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '120000';

        pagination(message, pages, emojiList, timeout)
    }
}