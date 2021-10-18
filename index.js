const Discord = require('discord.js');
const config = require("./config.json");
const fetch = require("node-fetch").default

const bot = new Discord.Client();
const { Client } = require("discord.js");


const client = new Client({
  disableEveryone: true
})
 



const db = require("quick.db");
const { join } = require('path');


const { readdirSync, read } = require('fs');


bot.commands = new Discord.Collection();


bot.on('ready', () => {
  console.log(`Bot is ready! Logged in as ${bot.user.tag} ! `);
    bot.user.setActivity('Over servers rg!help for commands', {type: 'WATCHING'}).catch(console.error)

})


 

const prefix = 'rg!';
//this prefix can be what ever you want ;)

const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const  command = require(join(__dirname, "commands", `${file}`));
    bot.commands.set(command.name, command);
}

bot.on("error", console.error);

const { GiveawaysManager } = require("discord-giveaways");
bot.giveawaysManager = new GiveawaysManager(bot, {
  updateCountdownEvery: 3000,
  default: {
    botsCanWin: false,
    embedColor: "#FF0000",
    reaction: "🎉"
  }
});
bot.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    if(message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);

        const command = args.shift().toLowerCase();

        if(!bot.commands.has(command)) return;


        try {
            bot.commands.get(command).run(bot, message, args);
        } catch (error){
            console.error(error);
        }
    }
})


bot.giveawaysManager.on(
  "giveawayReactionAdded",
  async (giveaway, reactor, messageReaction) => {
    if (reactor.user.bot) return;
    try {
      if(giveaway.extraData){
      await bot.guilds.cache.get(giveaway.extraData.server).members.fetch(reactor.id)
      }
      reactor.send(
        new Discord.MessageEmbed()
          .setTimestamp()
          .setTitle("Entery Approved! | You have a chance to win!!")
          .setDescription(
            `Your entery to [This Giveaway](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID}) has been approved!`
          )
          .setFooter("Royal Solutions™")
          .setTimestamp()
      );
    } catch (error) {
       const guildx = bot.guilds.cache.get(giveaway.extraData.server)
      messageReaction.users.remove(reactor.user);
      reactor.send( new Discord.MessageEmbed()
          .setTimestamp()
          .setTitle(":x: Entery Denied | Databse Entery Not Found & Returned!")
          .setDescription(
            `Your entery to [This Giveaway](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID}) has been denied as you did not join **${guildx.name}**`
          )
          .setFooter("Royal Solutions™")
      );
    }
  }
);
// Check if user reacts on an ended giveaway
bot.giveawaysManager.on('endedGiveawayReactionAdded', (giveaway, member, reaction) => {
     reaction.users.remove(member.user);
     member.send(`**Aw snap! Looks Like that giveaway has already ended!**`)

});
// Dm our winners
bot.giveawaysManager.on('giveawayEnded', (giveaway, winners) => {
     winners.forEach((member) => {
         member.send(new Discord.MessageEmbed()
         .setTitle(`🎁 Let's goo!`)
         .setDescription(`Hello there ${member.user}\n I heard that you have won **[[This Giveaway]](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID})**\n Good Job On Winning **${giveaway.prize}!**\nDirect Message the host to claim your prize!!`)
         .setTimestamp()
         .setFooter(member.user.username, member.user.displayAvatarURL())
         );
     });
});
// Dm Rerolled winners
bot.giveawaysManager.on('giveawayRerolled', (giveaway, winners) => {
     winners.forEach((member) => {
         member.send(new Discord.MessageEmbed()
         .setTitle(`🎁 Let's goo! We Have A New Winner`)
         .setDescription(`Hello there ${member.user}\n I heard that the host rerolled and you have won **[[This Giveaway]](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID})**\n Good Job On Winning **${giveaway.prize}!**\nDirect Message the host to claim your prize!!`)
         .setTimestamp()
         .setFooter(member.user.username, member.user.displayAvatarURL())
         );
     });
});
// When They Remove Reaction
bot.giveawaysManager.on('giveawayReactionRemoved', (giveaway, member, reaction) => {
     return member.send( new Discord.MessageEmbed()
          .setTimestamp()
          .setTitle('❓ Hold Up Did You Just Remove a Reaction From A Giveaway?')
          .setDescription(
            `Your entery to [This Giveaway](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID}) was recorded but you un-reacted, since you don't need **${giveaway.prize}** I would have to choose someone else 😭`
          )
          .setFooter("Think It was a mistake? Go react again!")
      );
});

bot.login("Your Token")