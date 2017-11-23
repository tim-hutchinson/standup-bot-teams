import * as botbuilder from 'botbuilder';
import * as restify from 'restify';
import * as util from 'util';
import * as standup from './dialogs/standup';

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

// Receive messages from the user and respond by echoing each message back
const bot = new botbuilder.UniversalBot(
  connector,
  (session: botbuilder.Session) => {
    console.log(util.inspect(session));
    session.send('You said: %s', session.message.text);
    switch ((session.message.text || '').toLowerCase()) {
      case 'standup':
        session.beginDialog(standup.DIALOG_NAME);
        break;

      default:
        break;
    }
  },
);

const memoryStorage = new botbuilder.MemoryBotStorage();
bot.set('storage', memoryStorage);

bot.dialog(standup.DIALOG_NAME, standup.steps);
