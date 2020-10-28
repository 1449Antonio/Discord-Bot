const Discord = require('discord.js');
const client = new Discord.Client();
const cmd = require('./command')
const config = require('./config.json')
const StrikeNumberSchema = require('./Schemas/StrikeNumber-schema') //note, "Schemas" was a separate folder I created
const mongo = require('./mongo');


client.on('ready', async () => {
	console.log('Ready!');
	await mongo().then(mongoose =>{
		try{
			console.log('Connected to mongo!');
		} finally{
			mongoose.connection.close() 
		}
	})

	cmd(client, 'GiveStrike', async (message) =>{
		if (!message.member.hasPermission("ADMINISTRATOR")) 
		{
			message.channel.send('You do not have permission for this') 
		}

		else{


		await mongo().then(async (mongoose) => {
			try {
				await StrikeNumberSchema.findOneAndUpdate({
					_id: message.mentions.members.first().id + " " + message.guild.id, 
	
				}, {
					$inc: {
						'StrikeCount': 1 
					}
				}, {
					upsert: true 
				}).exec()
			} finally{
				mongoose.connection.close()
			}
		}) 
	}
	}) 

	cmd(client, 'RemoveStrike', async (message) =>{
		if (!message.member.hasPermission("ADMINISTRATOR"))
		{
			message.channel.send('You do not have permission for this')
		}

		else{

		await mongo().then(async (mongoose) => {
			try{
				await StrikeNumberSchema.findOneAndUpdate({
					_id: message.mentions.members.first().id + " " + message.guild.id,	
				}, {
					$inc: {
						'StrikeCount': -1
					}
				}, {
					upsert: true
				}).exec()
			} finally{
				mongoose.connection.close()
			}
		})
	}
	})

	cmd(client, 'StrikeNum', async (message) =>{
		if (!(message.mentions.members.first().id === message.member.id || message.member.hasPermission("ADMINISTRATOR")))
		{
			message.channel.send('You do not have permission for this')
		}

		else{
		
		await mongo().then(async (mongoose) => {
			try{
				var collect =  await StrikeNumberSchema.findOne({
					_id: message.mentions.members.first().id + " " + message.guild.id,
 
				 })

				let str = collect.StrikeCount
				message.channel.send(str)
				}catch
				{
					message.channel.send("Sorry, this user has no strikes")
				}finally{
				mongoose.connection.close()
			}
		})
	}
	})

	cmd(client, 'kick', (message) => {
		if(message.member.hasPermission("KICK_MEMBERS")){
			const member = message.mentions.members.first();
			member.kick();
			message.channel.send("Bye bye");
		}
		else
			message.channel.send('Trying to kick someone when you don\'t have permission? Seems sus ngl');
	});

	cmd(client, 'ping', (message) => {
		message.channel.send('Pong!');
	});

	cmd(client, 'ban', (message) => {
		if(message.member.hasPermission("BAN_MEMBERS")){
			const user = message.mentions.users.first();
			message.guild.members.ban(user);
			message.channel.send('The user was the imposter. 0 imposters remaining'); }

		else
			message.channel.send("Woah! You can't do that! You're an imposter!");	
	});


	cmd(client, 'flip', (message) => {
		var coin = Math.round((Math.random() *1));
			if (coin == 0)
				message.channel.send('You got Tails!');
			else
				message.channel.send('You got Heads!');
	});

	cmd(client, 'roll', (message) => {
		var roll = Math.floor((Math.random() * 6) + 1);
				if (roll == 1)
					message.channel.send('You rolled a 1!');
				else if (roll == 2)
					message.channel.send('You rolled a 2!');		
				else if (roll == 3)
					message.channel.send('You rolled a 3!');
				else if (roll == 4)
					message.channel.send('You rolled a 4!');
				else if (roll == 5)
					message.channel.send('You rolled a 5!');
				else
					message.channel.send('You rolled a 1!');
	});

	cmd(client, 'status', (message) => {
				message.channel.send('MAJOR CONSTRUCTION! Please occasionally check back for updates.');
				
	})
		


	
});

client.login(config.token);
	
		 
