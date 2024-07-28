import { FetchType } from './fetch-type.dto';
import { FieldDefinition } from './field-definition.dto';

export class FetchField {
  id: string;
  fetchTypeId: string;
  fetchType: FetchType;
  field: FieldDefinition;
  fieldId: string;
  value: string;
  valueFetchPath: string;
}
