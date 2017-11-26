import {  IPromptTextResult, Prompts } from 'botbuilder';
import { IBotDialogRegistration } from '../types';

const configureChannel: IBotDialogRegistration = {
  DIALOG_NAME: 'configure.channel',

  steps: [
    (session, args) => {
      // TODO: Bind this to MS Teams channels list
      Prompts.text(
        session,
        'What channel should I post the standup report to?'
      );
    },
    (session, result: IPromptTextResult) => {
      if (result.response) {
        // TODO: Channel verification. Ensure ID not name.
        session.conversationData.channel = result.response;
        session.endDialog();
      }
    },
  ],
};

export default configureChannel;
