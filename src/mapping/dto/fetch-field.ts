import { FetchType } from './fetch-type';
import { FieldDefinitionBase } from './field-definition';

export class FetchField {
  id: string;
  fetchTypeId: string;
  fetchType: FetchType;
  field: FieldDefinitionBase;
  fieldId: string;
  value: string;
  valueFetchPath: string;
}
