import {
  IDialogWaterfallStep,
  IPromptChoiceResult,
  ListStyle,
  Prompts,
} from 'botbuilder';
import StandupConfiguration from '../models/StandupConfiguration';
import { DialogModes, IBotDialogRegistration, } from '../types';
import configureChannel from './configureChannel';
import configureMembers from './configureMembers';
import configureName from './configureName';
import configureTime from './configureTime';


/* tslint:disable object-literal-key-quotes */
const configureChoices = {
  'Name': { dialog: configureName, property: 'name' },
  'Channel': { dialog: configureChannel, property: 'reportChannel' },
  'Time': { dialog: configureTime, property: 'reportTime' },
  'Members': { dialog: configureMembers, property: 'members' },
  'Finish Editing': undefined,
};
/* tslint:enable */

const configureEdit: IBotDialogRegistration = {
  DIALOG_NAME: 'configure.edit',

  steps: [
    (session, args, next) => {
      // Get list of existing configurations for this team
      const teamID = 'TODOFIXME'; // TODO: Replace with real team ID
      if (args && args.reprompt) {
        session.dialogData.configToEdit = args.configToEdit;
        if (next) { next(args); } // Not sure why next can be undefined
      }
      else {
        StandupConfiguration
        .query(teamID)
        .loadAll()
        .exec((err: Error, response) => {
          if (err) {
            console.log('Error retrieving existing configurations from DynamoDB: ', err);
            throw err;
          } else if (response.Count === 0) {
            session.endConversation("Sorry, you don't have any existing configurations to edit!");
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
            Prompts.choice(session, 'Which standup would you like to edit?', configMap, {
              listStyle: ListStyle.list,
            });
          }
        });
      }
    },
    (session, result: IPromptChoiceResult) => {
      if (result.response) {
        const chosenConfigName = result.response.entity;
        const configToEdit = session.dialogData.configMap[chosenConfigName];
        session.dialogData.configToEdit = configToEdit;
      }
      // Ask user to select a property to edit
      Prompts.choice(session, 'What would you like to edit?', configureChoices, {
        listStyle: ListStyle.button,
      });
    },
    (session, result: IPromptChoiceResult) => {
      if (result.response) {
        if (result.response.entity === 'Finish Editing') {
          session.endConversation();
        } else {
          const editChoice = configureChoices[result.response.entity];
          const chosenDialog = editChoice.dialog;
          session.dialogData.editChoice = editChoice;
          session.beginDialog(chosenDialog.DIALOG_NAME, { mode: DialogModes.Edit });
        }
      }
    },
    (session, result) => {
      // TODO: Update Dynamo, replace dialog
      const updatedRecord = {
        teamID: session.dialogData.configToEdit.teamID,
        configID: session.dialogData.configToEdit.configID,
      };
      const updatedProperty = session.dialogData.editChoice.property;
      updatedRecord[updatedProperty] = session.conversationData[updatedProperty];
      StandupConfiguration.update(updatedRecord, (err, configuration) => {
        if (err) {
          console.log('Error saving updates to standup configuration: ', err);
          console.log('Attempted update record was: ', updatedRecord);
          throw err;
        } else {
          const args = { reprompt: true, configToEdit: session.dialogData.configToEdit };
          session.replaceDialog(configureEdit.DIALOG_NAME, args);
        }
      });
    },
  ],
};

export default configureEdit;
