import {
  IDialogWaterfallStep,
  IPromptConfirmResult,
  IPromptTextResult,
  Prompts,
} from 'botbuilder';
import * as emoji from 'node-emoji';
import * as util from 'util';
import { IBotDialogRegistration } from '../types';

const standup: IBotDialogRegistration = {
  DIALOG_NAME: 'standup',

  steps: [
    (session, args: IArguments) => {
      Prompts.confirm(session, "Are you ready to do today's standup?");
    },
    (session, result: IPromptConfirmResult) => {
      if (!result.response) {
        session.endDialog(
          `${emoji.get('disappointed')}
          Bummer. If you change your mind before standup time, just message me **standup**`
        );
      } else {
        session.dialogData.standupResponse = {};
        Prompts.text(session, 'What did you accomplish yesterday?');
      }
    },
    (session, result: IPromptTextResult) => {
      session.dialogData.standupResponse.yesterday = result.response;
      Prompts.text(session, 'What are you going to accomplish today?');
    },
    (session, result: IPromptTextResult) => {
      session.dialogData.standupResponse.today = result.response;
      Prompts.text(session, 'Are you blocked in any way?');
    },
    (session, result: IPromptTextResult) => {
      session.dialogData.standupResponse.blockers = result.response;
      session.endDialog(
        `${emoji.get('+1')} Thanks for responding! Carpe diem!`
      );
    },
  ],
};
export default standup;
