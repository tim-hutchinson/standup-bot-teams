import { UniversalBot } from 'botbuilder';
import { IBotDialogRegistration } from '../types';
import configure from './configure';
import configureChannel from './configureChannel';
import configureEdit from './configureEdit';
import configureMembers from './configureMembers';
import configureName from './configureName';
import configureNew from './configureNew';
import configureTime from './configureTime';
import standup from './standup';

const dialogs: { [index: string]: IBotDialogRegistration } = {
  configure,
  configureChannel,
  configureEdit,
  configureMembers,
  configureName,
  configureNew,
  configureTime,
  standup,
};

function registerAllDialogs(bot: UniversalBot) {
  Object.values(dialogs).forEach(dialog => {
    bot.dialog(dialog.DIALOG_NAME, dialog.steps);
  });
}

export { dialogs, registerAllDialogs };
