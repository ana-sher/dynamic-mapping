import { TypeDefinition } from './type-definition.dto';

export class FieldDefinition {
  id: number;
  name: string;
  typeOfFieldId?: number;
  isArray?: boolean;
  isBasicType?: boolean;
  required?: boolean;
  defaultValue?: any;
  typeId?: number;
  type?: TypeDefinition;
}
