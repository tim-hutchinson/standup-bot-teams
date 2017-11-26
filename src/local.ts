import * as botbuilder from 'botbuilder';
import * as dynogels from 'dynogels';
import * as restify from 'restify';
import * as util from 'util';
import { dialogs, registerAllDialogs} from './dialogs';
import { IBotDialogRegistration } from './types';


// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log('%s listening to %s', server.name, server.url);
});

// Setup connection to DynamoDB
const AWS = dynogels.AWS;
AWS.config.update({ region: process.env.AWS_DYNAMODB_REGION });
// Run against local if set
if (process.env.AWS_DYNAMODB_ENDPOINT) {
  const opts = { endpoint: process.env.AWS_DYNAMODB_ENDPOINT };
  dynogels.dynamoDriver(new AWS.DynamoDB(opts));
}

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

// All main dialog options are specified here.
const mainMenuChoices: { [index: string]: IBotDialogRegistration } = {
  standup: dialogs.standup,
  configure: dialogs.configure,
};
const mainMenuChoicesString = Object.keys(mainMenuChoices).join('**, **'); // Don't bold the commas

// Root dialog for conversation menu
bot
  .dialog('/', [
    (session: botbuilder.Session) => {
      const simplifiedMessage = (session.message.text || '')
        .toLowerCase()
        .trim();
      const chosenDialog = mainMenuChoices[simplifiedMessage];
      if (chosenDialog === undefined) {
        // No known menu choice was given
        session.endDialog(
          `Sorry, I didn't understand that command. Valid options are: **${mainMenuChoicesString}**`
        );
      } else {
        session.beginDialog(chosenDialog.DIALOG_NAME);
      }
    },
  ])
  // Global 'cancel' registration to abort any command.
  // Resumes where the user was if they don't confirm.
  .cancelAction('CancelAddNumber', 'Operation cancelled', {
    matches: /^cancel$/i,
    confirmPrompt: 'Are you sure you wish to cancel?',
  });

// All dialogs have to be registered to be used
registerAllDialogs(bot);
