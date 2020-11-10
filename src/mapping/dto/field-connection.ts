import { FieldDefinition } from './field-definition';

export class FieldConnection {
  id: number;
  firstFieldId?: number;
  secondFieldId?: number;
  firstField?: FieldDefinition;
  secondField?: FieldDefinition;
  firstFieldFilterFunction?: string;
  secondFieldFilterFunction?: string;
}
