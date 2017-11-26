import { IPromptTextResult, Prompts } from 'botbuilder';
import { IBotDialogRegistration } from '../types';

const configureName: IBotDialogRegistration = {
  DIALOG_NAME: 'configure.name',

  steps: [
    (session, args: IArguments) => {
      Prompts.text(session, 'Give your standup a name to identify it?');
    },
    (session, result: IPromptTextResult) => {
      session.conversationData.name = result.response;
      session.endDialog();
    },
  ],
};

export default configureName;
