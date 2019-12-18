# Discord CLI
This is a set of command line tools written in NodeJS to allow management of a Discord server through the terminal. Current commands allow for the creation of categories, channels, channels in specific categories, it allows the movement of channels between and to categories, and sending webhooks to URL's.
## Dependencies

 - [NodeJS](https://nodejs.org/)
 - [discord.js](https://discord.js.org/)
 - [readline-sync](https://www.npmjs.com/package/readline-sync)
 - [node-fetch](https://www.npmjs.com/package/node-fetch)

Note: All dependencies except NodeJS can be installed automatically through npm.

## Initialization
Download the code, navigate to the downloaded directory in the terminal. Make sure it is extracted.

To install all the dependencies except for NodeJs run `npm install`.

Make a new application and bot through the Discord development API. A tutorial can be found [here](https://discordpy.readthedocs.io/en/latest/discord.html).

Place the bot token in the `TOKEN` field within `config.js`.

To run the program enter `node app.js`. You are now running the tool.

## ID's
This readme will frequently reference the use of ID's. To find an ID, open your Discord settings, click appearance, and make sure developer mode is enabled. To find an ID right click on a channel, server, or message and click copy ID. The ID is now copied to your clipboard.

## Setting the Server
When running the tool, if you wish make any changes to a specific server you must first set the guild. To do this type `set_guild <id>` replacing ID with the ID of the server you wish to manage. This must be done every time you use the tool.

## Creating a Category
To create a category use the command `create_category <name>` replacing name with the name of the category you with to create.

## Creating a Channel
A channel can be created by using the command `create_channel <name>` replacing name with the name of the channel you wish to create.

To create a channel within a category use `create_channel <name> <id>` replacing name with the name of the channel you wish to create and ID with the ID of the category you wish for the channel to be placed in.

## Moving a Channel
To move a channel into a category or from one category to another, use the command `move_channel <channel id> <category id>` replacing channel ID with the ID of the channel you wish to move and category ID with the ID of the category you wish to move the channel into.

## Sending Webhooks
You can send a webhook using the command `send_webhook <url>` replacing URL with the URL of the webhook you are trying to send to. It will then ask if you wish to send the webhook as an embed. If you select yes you will be guided through a creation wizard that will make your embed. If you select no you will be given an option of what content you wish to put send to the webhook.

## Help
To review the commands, enter the command `help` and a brief explanation of all the commands and how to use them will appear.