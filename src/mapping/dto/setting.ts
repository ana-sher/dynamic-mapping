import { FieldDefinitionBase } from './field-definition';

export class Setting {
  id: string;
  fieldId: string;
  field: FieldDefinitionBase;
  isFiltered: boolean;
  possibleValues: any[];
  fetchValuesPath: string;
}
