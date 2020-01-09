import { TypeDefinition } from './type-definition';

export class FieldDefinitionBase {
  id: number;
  name: string;
  typeOfFieldId: number;
  isArray: boolean;
  isBasicType: boolean;
}
