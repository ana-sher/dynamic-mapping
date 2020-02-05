import { FieldDefinitionBase } from './field-definition';
import { FieldOfType } from './field-of-type';

export class FieldConnection {
  id: number;
  firstFieldId: number;
  secondFieldId: number;
  firstField: FieldOfType;
  secondField: FieldOfType;
  firstFieldFilterFunction: string;
  secondFieldFilterFunction: string;
}
