import { FieldDefinitionBase } from './field-definition';

export class ConnectionValue {
  id: string;
  fieldId: string;
  field: FieldDefinitionBase;
  value: any;
}
