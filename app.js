const Discord = require('discord.js');
const client = new Discord.Client();
var readlineSync = require('readline-sync');
const fetch = require('node-fetch');

const config = require('./config');
var guild = null;

client.on('ready', () => {
  async function main () {
    command = readlineSync.promptCL();
    if (command[0] == 'set_guild') {
      guild = client.guilds.get(command[1]);
      if (guild == undefined) {
        console.log(`The guild ID you provided (${command[1]}) is not valid.`);
        guild = null;
      } else {
        console.log(`Guild set to ${guild}.`);
      }
    } else if (command[0] == 'create_catagory') {
      if (guild != null) {
        await guild.createChannel(command[1], {
          type: 'category',
        }).then(result => {
          console.log(`Catagory "${result.name}" was created.`);
        }).catch(err => {
          console.log('There was an error.');
        });
      } else {
        console.log('Please select a server using set_guild <id>.');
      }
    } else if (command[0] == 'create_channel') {
      if (guild != null) {
        var channel;
        if (command[2] != undefined) {
          try {
            var catagory = client.channels.get(command[2]);
            channel = await guild.createChannel(command[1], {
              type: 'text',
            });
            await channel.setParent(command[2]);
            console.log(`Channel "${channel.name}" was created in the catagory "${catagory.name}".`);  
          } catch (err) {
            console.log(`No catagory could be found with the id ${command[2]}.`);
          }
        } else {
          channel = await guild.createChannel(command[1], {
            type: 'text',
          });
          console.log(`Channel "${channel.name}" was created.`);
        }
      } else {
        console.log('Please select a server using set_guild <id>.');
      }
    } else if (command[0] == 'move_channel') {
      if (guild != null) {
        try {
          await client.channels.get(command[1]).setParent(command[2]);
          console.log(`Channel "${client.channels.get(command[1]).name}" moved to catagory "${client.channels.get(command[2]).name}".`);
        } catch (err) {
          console.log(`Channel or catagory id is invalid.`);
        }
      } else {
        console.log('Please select a server using set_guild <id>.');
      }
    } else if (command[0] == 'send_webhook') {
      var data;
        if (readlineSync.keyInYNStrict('Do you want to send an embed?')) {
          var title = readlineSync.question('Embed Title: ');
          var color = readlineSync.question('Embed Color (Decimal Value): ');
          var description = readlineSync.question('Embed Description: ');
          var fields = [];
          var i = true;
          while (i == true) {
            if (readlineSync.keyInYNStrict('Do you want to add a field?')) {
              var fname = readlineSync.question('Field Name: ');
              var fvalue = readlineSync.question('Field Value: ');
              fields.push({"name": fname, "value": fvalue});
            } else {
              i = false;
            }
          }
          data = {
            "embeds": [{
              "title": title,
              "color": color,
              "description": description,
              "fields": fields
            }]};
        } else {
          var content = readlineSync.question('WebHook Content: ');
          data = {"content": content};
        }
        await fetch(command[1], {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
      } else if (command[0] == 'help') {
        console.log('Command Help:');
        console.log('set_guild: <id> - Sets server ID.');
        console.log('create_catagory: <name> - Creates catagory.');
        console.log('create_channel: <name> <optional: catagory id> - Creates channel in optional catagory.');
        console.log('move_channel: <channel id> <new catagory id> - Moves channel to a catagory.');
        console.log('send_webhook: <webhook url> - Sends webhook to URL.');
        console.log('quit - Quits app and shuts down bot.');
      } else if (command[0] == 'quit') {
        client.destroy();
        return;
      } else {
        console.log('Command Invalid: Enter help to view a list of valid commands.');
      }
      main();
    } 
  main();
});

client.login(config.TOKEN);