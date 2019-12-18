const Discord = require('discord.js');
const client = new Discord.Client();
var readlineSync = require('readline-sync');
const fetch = require('node-fetch');

const config = require('./config');
var guild = null;

client.on('ready', () => {
  async function main () {
    var command = await readlineSync.promptCL();
    if (command[0] == 'set_guild') {
      guild = client.guilds.get(command[1]);
      if (guild == undefined) {
        console.log(`The guild ID you provided (${command[1]}) is not valid.`);
        guild = null;
      } else {
        console.log(`Guild set to ${guild}.`);
      }
    } else if (command[0] == 'create_category') {
      if (guild != null) {
        var categoryName;
        if (command[1].includes('_')) {
          categoryName = command[1].replace(/_/g, ' ');
        } else {
          categoryName = command[1];
        }
        await guild.createChannel(categoryName, {
          type: 'category',
        }).then(result => {
          console.log(`Category "${result.name}" was created with the id "${result.id}".`);
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
            var category = client.channels.get(command[2]);
            channel = await guild.createChannel(command[1], {
              type: 'text',
            });
            await channel.setParent(command[2]);
            console.log(`Channel "${channel.name}" was created in the category "${category.name}" with the id "${channel.id}".`);  
          } catch (err) {
            console.log(`No category could be found with the id ${command[2]}.`);
          }
        } else {
          channel = await guild.createChannel(command[1], {
            type: 'text',
          });
          console.log(`Channel "${channel.name}" was created with the id "${channel.id}".`);
        }
      } else {
        console.log('Please select a server using set_guild <id>.');
      }
    } else if (command[0] == 'move_channel') {
      if (guild != null) {
        try {
          await client.channels.get(command[1]).setParent(command[2]);
          console.log(`Channel "${client.channels.get(command[1]).name}" moved to category "${client.channels.get(command[2]).name}".`);
        } catch (err) {
          console.log(`Channel or category id is invalid.`);
        }
      } else {
        console.log('Please select a server using set_guild <id>.');
      }
    } else if (command[0] == 'create_webhook') {
      try {
        var webhookChannel = client.channels.get(command[1]);
        var webhookName;
        if (command[2].includes('_')) {
          webhookName = command[2].replace(/_/g, ' ');
        } else {
          webhookName = command[2];
        }
        wb = await webhookChannel.createWebhook(webhookName, command[3]).then(wb => {
          console.log(`Webhook created with the name "${wb.name}" in channel "${webhookChannel.name}.`);
          console.log(`Webhook URL: https://discordapp.com/api/webhooks/${wb.id}/${wb.token}`);
        });
      } catch (err) {
        console.log('Inputs invalid.');
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
          var footer = null;
          var footerIcon = null;
          if (readlineSync.keyInYNStrict('Do you want to add a footer?')) {
            if (readlineSync.keyInYNStrict('Do you want to add an icon to the footer?')) {
              footerIcon = readlineSync.question('Footer Icon: ');
            }
            footer = readlineSync.question('Footer Content: ');
          }
          data = {
            "embeds": [{
              "title": title,
              "color": color,
              "description": description,
              "fields": fields,
              "footer": {text: footer, icon_url: footerIcon}
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
      console.log('create_category: <name> - Creates category.');
      console.log('create_channel: <name> <optional: category id> - Creates channel in optional category.');
      console.log('move_channel: <channel id> <new category id> - Moves channel to a category.');
      console.log('create_webhook: <channel id> <webhook name> <webhook image> - Creates webhook in specified channel.');
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