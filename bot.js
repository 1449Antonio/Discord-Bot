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



/*client.on('message', message => {
	if (message.content.startsWith('*kick')) 
	{
		if(message.member.hasPermission("KICK_MEMBERS")){
			const member = message.mentions.members.first();
			member.kick();
			message.channel.send("Bye bye");
		}
		else
			message.channel.send('Trying to kick someone when you don\'t have permission? Seems sus ngl');
	}

	if (message.content.startsWith('*ban'))
	{	
		
	}


    if (message.content.startsWith('*')) {
		//var args = message.content.slice(1).trim().split(' ');
		//let regex = /\s+/g
 		//let newStr = message.content.replace(" ", "");
		var args = message.content.slice(1).split("/ +/");
		const cmd = args.shift().toLowerCase();
        switch(cmd) {
            // *ping
            case 'ping':
                message.channel.send('Pong!')
            	break;
            
	    	case 'flip':
			
		
	     	case 'roll':
			

			case 'status':
				
			case 'help status':
				message.channel.send('States the current status of the bot');
				break;
			case 'help ping':
				message.channel.send('Says pong');
				break;
			case 'help flip':
				message.channel.send('Flips a coin and outputs the result');
				break;
			case 'help roll':
				message.channel.send('Rolls a six sided dice and outputs the result');
				break;

			case 'help strikelimit':
				message.channel.send('Shows the strike limit of the server. If you exceed the strike limit, the strike giver is notified');
				break;
			
			case 'help strikeset':
				message.channel.send('Do *strikeSet [value] without the brackets to set the strike limit of the server');
				break;
				
			case 'help kick':
				message.channel.send('Do *kick @user to kick the user');
				break;
			case 'help ban':
				message.channel.send('Do *ban @user to ban the user');
				break;
			
			case 'help':
				{
					message.channel.send('Welcome to Iki Bot. Below are the following functions. Say *help (command) without the parenthesis for more help');
					const helpEmbed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setDescription('Admin:\nkick\nban\nstrikeSet\n\nGlobal:\nping\nflip\nroll\nstatus\nstrikeLimit')
					
	
					message.channel.send(helpEmbed);
					break;
				}

			case 'strikelimit':
				if (strikeLimit == -1)
					message.channel.send('No strike limit set. Please set a limit');
				else
					message.channel.send('The strike limit for this server is ' + strikeLimit);
				break;

/*
	       case 'jenga':
		 bot.sendMessage({to: channelID, message: 'Welcome to Jenga! There are several blocks stacked up in various horizontal and vertical positions. Your task is to remove a block without it falling, before the computer does the same. To do so, simply input H, M, or L. H means you chose a high risk move, M means you chose a medium risky move, and L means you chose a low risk. This will repeat until either you or the computer loses (tower falls). If you wish to continue, say yes, no caps. Otherwise, say anything else.'});
	      	jenga(userID);
		
		break; */
/*         }
     }
});
/*
async function jenga(ID){
	 const filter = m => m.author.id === ID
		await message.channel.awaitMessages(filter, {
		max: 1, // leave this the same
		time: 10000, // time in MS. there are 1000 MS in a second
  		 }).then((collected) => {
    		if(collected.first().content.toLowerCase() === 'yes')
   		 	message.channel.send('You said yes. Say quit whenever you want to stop.');
		else
			message.channnel.send('Aww, no fun');
		console.log('collected :' + collected.first().content)
		}).catch(() => {
    		// what to do if a user takes too long goes here 

		message.reply('You took too long! Goodbye!'); 
		});
*/	
		 