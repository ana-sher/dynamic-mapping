import { FieldDefinition } from './field-definition.dto';

export class Setting {
  id: string;
  fieldId: string;
  field: FieldDefinition;
  isFiltered: boolean;
  possibleValues: any[];
  fetchValuesPath: string;
}
