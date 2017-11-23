import {
  IDialogWaterfallStep,
  IPromptConfirmResult,
  Prompts,
} from 'botbuilder';
import * as emoji from 'node-emoji';
import * as util from 'util';

const DIALOG_NAME = 'standup';

const steps: IDialogWaterfallStep[] = [
  (session, args: IArguments) => {
    Prompts.confirm(session, "Are you ready to do today's standup?");
  },
  (session, result: IPromptConfirmResult) => {
    if (!result.response) {
      session.endDialog(
        `${emoji.get('disappointed')}
        Bummer. If you change your mind before standup time, just message me **standup**`,
      );
    }
    session.endDialog(`Aww yiss. You said ${util.inspect(result)}`);
  },
];

export { DIALOG_NAME, steps };
