import * as botbuilder from 'botbuilder';
import * as restify from 'restify';
import * as util from 'util';
import standup from './dialogs/standup';
import { IBotDialogRegistration } from './types';

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
const connector = new botbuilder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD,
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Create the bot
const bot = new botbuilder.UniversalBot(connector);
const memoryStorage = new botbuilder.MemoryBotStorage();
bot.set('storage', memoryStorage);

// All main dialog options are specified here
const mainMenuChoices: { [index: string]: IBotDialogRegistration } = {
  standup,
};
const mainMenuChoicesString = Object.keys(mainMenuChoices).join('**, **'); // Don't bold the commas

// Root dialog for conversation menu
bot.dialog('/', [
  (session: botbuilder.Session) => {
    const simplifiedMessage = (session.message.text || '').toLowerCase().trim();
    const chosenDialog = mainMenuChoices[simplifiedMessage];
    if (chosenDialog === undefined) {
      // No known menu choice was given
      session.endDialog(
        `Sorry, I didn't understand that command. Valid options are: **${mainMenuChoicesString}**`,
      );
    } else {
      session.beginDialog(chosenDialog.DIALOG_NAME);
    }
  },
]);

// Register all dialogs
bot.dialog(standup.DIALOG_NAME, standup.steps);
