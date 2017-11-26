import { EntityRecognizer, IPromptTimeResult, Prompts } from 'botbuilder';
import { IBotDialogRegistration } from '../types';

const configureTime: IBotDialogRegistration = {
  DIALOG_NAME: 'configure.time',

  steps: [
    (session, args) => {
      Prompts.time(
        session,
        'What time would you like the standup report to run? (to the nearest 15 minutes)'
      );
    },
    (session, result: IPromptTimeResult) => {
      if (result.response) {
        const parsedDateTime = EntityRecognizer.resolveTime([result.response]);
        const mins = parsedDateTime.getUTCMinutes();
        const roundedMins = (Math.round(mins / 15) * 15) % 60; // Round to the nearest 15 minutes
        const reportTime = {
          hour: parsedDateTime.getUTCHours(),
          min: roundedMins,
        };
        session.conversationData._rawReportTime = reportTime;
        session.conversationData.reportTime = `${reportTime.hour}:${reportTime.min}`;
        // TODO: Response with a user-local response of the report time
        session.endDialog();
      }
    },
  ],
};

export default configureTime;
