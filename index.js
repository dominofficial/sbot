const Discord = require("discord.js");
const client = new Discord.Client();
const async = require("async");
const config = require("./config.json");
const sql = require('sqlite');
sql.open('./databa.sqlite');

client.on('ready', () => {
	client.user.setActivity(`>help | witch ${client.users.size} users`, {url: "https://www.twitch.tv/dominofficial"});
  console.log(`${client.user.tag} running on ${client.guilds.size} guilds with ${client.users.size} users.`);
});

client.on("guildCreate", guild => {
  client.channels.get("552158617051070523").send('Thx for helping: ' + guild.name);
})

client.on('message', msg => {
	if (msg.guild && msg.content.startsWith('XDNIE!private')) {
	  let text = msg.content.slice('XDNIE!private'.length); 
	  msg.guild.members.forEach(member => {
		if (member.id != client.user.id && !member.user.bot) member.send(text);
	  });
	}
  });

client.on('message', async msg => {
	
	if (msg.author.bot) return; 
		if (msg.channel.type !== 'text') return; 

	if (msg.content.startsWith(config.prefix + "ping")){
		const m = await msg.channel.send("Ping?");
		m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms.`);
		msg.react('👌');
		return;
	}
	if (msg.content.startsWith(config.prefix + "botinfo")){
		const m = await msg.channel.send("hmm");
		m.edit(`Running bot: ${client.user.tag} on ${client.guilds.size} servers witch ${client.users.size} users. Owner @Dominik#5553`);
		return;
	} 
	if (msg.content.startsWith(config.prefix + "invite")){
		const m = await msg.channel.send("Wait Creating Invite!!");
		m.edit(`https://discordapp.com/api/oauth2/authorize?client_id=551831188092878888&permissions=0&scope=bot`);
		return;
	} 	
	if (msg.content.startsWith(config.prefix + "help")){
		const m = await msg.channel.send("Wait ! i am working give a sec!");
		m.edit(`
		>help - All Commands 
		>ping - You Ping
		>invite - Bot Invite
		>botinfo - info about bot
		MORE SOON
		`);

		msg.react('👌')
		return;
	}
	if (!msg.content.startsWith(config.prefix)) return; 
	console.log(`[${msg.guild.name}] ${msg.author.tag} >> ${msg.content}`); 
	const cmd = msg.content.toLowerCase().slice(config.prefix.length).split(' ')[0]; 
	if (commands.hasOwnProperty(cmd)){ 
		commands[cmd](msg); 
	}
});

client.on('guildMemberAdd', member => {
	member.send("Join Here https://discord.gg/GhK5MWH Free stuff (no scam)");
})

const botStats = {
	totalGuildsID: '552157321032368128',
	totalUsersID: '552157335242539030',
	totalChannelsID: '552157423914188812',

}
	
client.on('guildCreate', guild => {

	client.channels.get(botStats.totalGuildsID).setName(`Total Servers: ${client.guilds.size}`);
	client.channels.get(botStats.totalUsersID).setName(`Total Users: ${client.guilds.reduce((a, g) => a + g.memberCount, 0)}`);
	client.channels.get(botStats.totalChannelsID).setName(`Total Channels: ${client.channels.size}`);

});

client.on('guildDelete', guild => {

	client.channels.get(botStats.totalGuildsID).setName(`Total Servers: ${client.guilds.size}`);
	client.channels.get(botStats.totalUsersID).setName(`Total Users: ${client.guilds.reduce((a, g) => a + g.memberCount, 0)}`);
	client.channels.get(botStats.totalChannelsID).setName(`Total Channels: ${client.channels.size}`);

});	

const serverStats = {
	guildID: '552156969201434634',
	userCountID: '552157202430033929',
	memberCountID: '552157214836785167',
	botCountID: '552157232293478400',

}
	
client.on('guildMemberAdd', member => {

  if (member.guild.id !== serverStats.guildID) return;

	client.channels.get(serverStats.userCountID).setName(`User Count: ${member.guild.memberCount}`);
	client.channels.get(serverStats.memberCountID).setName(`Member Count: ${member.guild.members.filter(m => !m.user.bot).size}`);
	client.channels.get(serverStats.botCountID).setName(`Bot Count: ${member.guild.members.filter(m => m.user.bot).size}`);
	client.channels.get("552157710611644418").send('Welcome To Wolf Bot Support' `${member}`);
});

client.on('guildMemberRemove', member => {

	if (member.guild.id !== serverStats.guildID) return;

	client.channels.get(serverStats.userCountID).setName(`User Count: ${member.guild.memberCount}`);
	client.channels.get(serverStats.memberCountID).setName(`Member Count: ${member.guild.members.filter(m => !m.user.bot).size}`);
	client.channels.get(serverStats.botCountID).setName(`Bot Count: ${member.guild.members.filter(m => m.user.bot).size}`);
});

function commandIs(str, msg){
	return msg.content.toLowerCase().startsWith(prefix + str);
}

client.login(config.token);
