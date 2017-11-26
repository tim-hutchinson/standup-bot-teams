import {
  IDialogWaterfallStep,
  IPromptChoiceResult,
  IPromptConfirmResult,
  IPromptTextResult,
  ListStyle,
  Prompts,
} from 'botbuilder';
import * as emoji from 'node-emoji';
import * as util from 'util';
import { IBotDialogRegistration } from '../types';
import configureNew from './configureNew';
import configureEdit from './configureEdit';

const configureChoices: { [index: string]: IBotDialogRegistration } = {
  'Create a new standup': configureNew,
  'Edit an existing standup': configureEdit, // FIXME: placeholder
};

const configure: IBotDialogRegistration = {
  DIALOG_NAME: 'configure',

  steps: [
    (session, args: IArguments) => {
      const choices = ['Create a new standup', 'Edit an existing standup'];
      Prompts.choice(session, 'What would you like to do?', choices, {
        listStyle: ListStyle.button,
      });
    },
    (session, result: IPromptChoiceResult) => {
      session.send(util.inspect(result.response));
      if (result.response) {
        const chosenDialog = configureChoices[result.response.entity];
        session.beginDialog(chosenDialog.DIALOG_NAME);
      }
    },
  ],
};
export default configure;
