import {
  IDialogWaterfallStep,
  IPromptConfirmResult,
  IPromptTextResult,
  ListStyle,
  Prompts,
} from 'botbuilder';
import * as emoji from 'node-emoji';
import * as util from 'util';
import StandupConfiguration from '../models/StandupConfiguration';
import { default as StandupResponse, responseDateString } from '../models/StandupResponse';
import { IBotDialogRegistration } from '../types';

const standup: IBotDialogRegistration = {
  DIALOG_NAME: 'standup',

  steps: [
    (session, args, next) => {
      session.dialogData.args = args || {};
      const teamID = 'TODOFIXME'; // TODO: Replace with actual team ID
      session.dialogData.teamID = teamID;
      if (args && args.standupConfigID) {
        // Standup initiated for a specific config
        Prompts.confirm(session, "Are you ready to do today's standup?");
      } else {
        StandupConfiguration
        .query(teamID)
        .loadAll()
        .exec((err: Error, response) => {
          if (err) {
            console.log('Error retrieving existing configurations from DynamoDB: ', err);
            throw err;
          } else if (response.Count === 0) {
            session.endConversation("Sorry, you don't have any standups to perform!");
          } else {
            // Ask user to select a config to edit
            const configurations = response.Items;
            const configMap: any[] = configurations.reduce(
              (map, configuration) => {
                const configName = configuration.get('name');
                map[configName] = configuration;
                return map;
              },
              {});
            session.dialogData.configMap = configMap;
            Prompts.choice(session, 'Which standup would you like to perform?', configMap, {
              listStyle: ListStyle.list,
            });
          }
        });
      }
    },
    (session, result) => {
      if (!result.response) {
        session.endDialog(
          `${emoji.get('disappointed')}
          Bummer. If you change your mind before standup time, just message me **standup**`
        );
      } else {
        if (result.response.entity) {
          // Last prompt was to choose a standup
          session.dialogData.args.standupConfigID = result.response.entity.standupConfigID;
        }
        session.dialogData.standupResponse = {
          standupConfigID: session.dialogData.args.standupConfigID,
          userID: session.message.user.id,
          teamID: session.dialogData.teamID,
          answers: {},
        };
        Prompts.text(session, 'What did you accomplish yesterday?');
      }
    },
    (session, result: IPromptTextResult) => {
      session.dialogData.standupResponse.answers.didYesterday = result.response;
      Prompts.text(session, 'What are you going to accomplish today?');
    },
    (session, result: IPromptTextResult) => {
      session.dialogData.standupResponse.answers.doToday = result.response;
      Prompts.text(session, 'Are you blocked in any way?');
    },
    (session, result: IPromptTextResult) => {
      session.dialogData.standupResponse.answers.blockers = result.response;

      const standupResponse = session.dialogData.standupResponse;
      standupResponse.didRespond = true;

      standupResponse.responseDate = responseDateString();
      StandupResponse.create(standupResponse, (err, data) => {
        if (err) {
          console.log('Error saving standup response: ', err);
          console.log('Attempted to save: ', standupResponse);
          throw err;
        } else {
          session.endDialog(
            `${emoji.get('+1')} Thanks for responding! Carpe diem!`
          );
        }
      });
    },
  ],
};
export default standup;
