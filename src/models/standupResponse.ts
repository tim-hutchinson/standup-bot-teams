import * as dynogels from 'dynogels';
import * as Joi from 'joi';

// tslint:disable-next-line variable-name
const StandupResponse = dynogels.define('StandupResponse', {
  hashKey: 'userID',
  rangeKey: 'responseDate',
  timestamps: true,
  schema: {
    userID: Joi.string(),
    teamID: Joi.string(),
    standupConfigID: dynogels.types.uuid(),
    responseDate: Joi.string(),
    didRespond: Joi.boolean(),
    answers: {
      didYesterday: Joi.string(),
      doToday: Joi.string(),
      blockers: Joi.string(),
    },
  },
  indexes: [
    {
      hashKey: 'standupConfigID',
      rangeKey: 'responseDate',
      name: 'StandupByDayIndex',
      type: 'global',
    },
  ],
});

export function responseDateString(date = new Date()) {
  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`; // tslint:disable-line max-line-length
}

export interface IStandupResponse {
  userID: string;
  teamID: string;
  standupConfigID: string;
  responseDate: Date;
  didRespond: boolean;
  answers: IStandupAnswers;
}

export interface IStandupAnswers {
  didYesterday?: string;
  doToday?: string;
  blockers?: string;
}

export default StandupResponse;
