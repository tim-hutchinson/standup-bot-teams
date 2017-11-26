import { IPromptTextResult, Prompts } from 'botbuilder';
import { IBotDialogRegistration } from '../types';

const configureMembers: IBotDialogRegistration = {
  DIALOG_NAME: 'configure.members',

  steps: [
    (session, args) => {
      const isFirstMember = !(args && args.reprompt);
      if (isFirstMember) {
        // Will store members on conversationData to persist through loops
        session.conversationData.members = [];
      }
      const whoText = isFirstMember ? 'Who' : 'Who else';
      // TODO: Make this use @mentions
      Prompts.text(
        session,
        `${whoText} should be included in the standup?
        Type **done** to stop adding members`
      );
    },
    (session, result: IPromptTextResult) => {
      const doneRegex = /^done$/i;
      const isDone = doneRegex.test(result.response || '');
      if (isDone) {
        session.endDialog();
      }
      else {
        session.conversationData.members.push(result.response);
        session.replaceDialog(configureMembers.DIALOG_NAME, { reprompt: true });
      }
    },
  ],
};

export default configureMembers;
