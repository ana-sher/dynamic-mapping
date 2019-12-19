import { FieldDefinitionBase } from './field-definition';

export class Setting {
  fieldId: string;
  field: FieldDefinitionBase;
  isFiltered: boolean;
  possibleValues: any[];
  fetchValuesPath: string;
}
