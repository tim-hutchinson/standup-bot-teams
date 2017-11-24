import { IDialogWaterfallStep } from 'botbuilder';

export interface IBotDialogRegistration {
  readonly DIALOG_NAME: string;
  readonly steps: IDialogWaterfallStep[];
}
