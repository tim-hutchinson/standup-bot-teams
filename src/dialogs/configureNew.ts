import {
  EntityRecognizer,
  IPromptConfirmResult,
  IPromptTextResult,
  IPromptTimeResult,
  Prompts,
} from 'botbuilder';
import * as teams from 'botbuilder-teams';
import * as util from 'util';
import { dialogs } from '.';
import StandupConfiguration from '../models/StandupConfiguration';
import { IBotDialogRegistration } from '../types';

const configureNew: IBotDialogRegistration = {
  DIALOG_NAME: 'configure.new',

  // All configuration data should go on session.conversationData
  steps: [
    (session, args: IArguments) => {
      session.beginDialog(dialogs.configureName.DIALOG_NAME);
    },
    (session, result: IPromptTextResult) => {
      session.dialogData.name = result.response;
      session.beginDialog(dialogs.configureTime.DIALOG_NAME);
    },
    (session, result: IPromptTimeResult) => {
      session.beginDialog(dialogs.configureChannel.DIALOG_NAME);
    },
    (session, result: IPromptTextResult) => {
      session.beginDialog(dialogs.configureMembers.DIALOG_NAME);
    },
    (session, result) => {
      // Create the config object and store to DB
      const reportTime = session.conversationData.reportTime;
      const newConfig = {
        createdBy: session.message.user.id,
        members: session.conversationData.members,
        name: session.conversationData.name,
        reportChannel: session.conversationData.reportChannel,
        reportTime: reportTime.string,
        teamID: 'TODOFIXME', // TODO: Get this from botbuilkder-teams
      };
      StandupConfiguration.create(newConfig, (err, data) => {
        if (err) {
          console.log('Error creating StandupConfiguration:', err);
          throw err; // Bot Framework will localize an error back to the user.
        } else {
          session.endConversation('Created your standup! See you soon!');
        }
      });
    },
  ],
};

export default configureNew;
