import { EntityRecognizer, IPromptConfirmResult, Prompts } from 'botbuilder';
import StandupConfiguration from '../models/StandupConfiguration';
import { IBotDialogRegistration } from '../types';

const configureDelete: IBotDialogRegistration = {
  DIALOG_NAME: 'configure.delete',

  steps: [
    (session, args) => {
      session.dialogData.standup = args.standup;
      session.dialogData.standupName = args.standup.name; // Keep refernce to name post-deletion
      Prompts.confirm(session, `Are you sure you want to delete **${args.standup.name}**?`);
    },
    (session, result: IPromptConfirmResult) => {
      if (result.response) {
        StandupConfiguration.destroy(session.dialogData.standup, (err, data) => {
          if (err) {
            console.log('Error deleting standup configuration: ', err);
            console.log('Attempted update record was: ', session.dialogData.standup);
            throw err;
          } else {
            session.endConversation(`Removed the ${session.dialogData.standupName} standup`);
          }
        });
      } else {
        session.endDialog();
      }
    },
  ],
};

export default configureDelete;
