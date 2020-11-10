import { FetchType } from './fetch-type';
import { FieldDefinition } from './field-definition';

export class FetchField {
  id: string;
  fetchTypeId: string;
  fetchType: FetchType;
  field: FieldDefinition;
  fieldId: string;
  value: string;
  valueFetchPath: string;
}
