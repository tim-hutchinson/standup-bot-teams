import * as dynogels from 'dynogels';
import * as Joi from 'joi';

// tslint:disable-next-line variable-name
const StandupConfiguration = dynogels.define('StandupConfiguration', {
  hashKey: 'teamID',
  rangeKey: 'configID',
  timestamps: true,
  schema: {
    configID: dynogels.types.uuid(),
    teamID: Joi.string(),
    createdBy: Joi.string(),
    name: Joi.string(),
    reportChannel: Joi.string(),
    reportTime: Joi.string(), // Time of day only
    members: dynogels.types.stringSet(),
  },
});

export default StandupConfiguration;
