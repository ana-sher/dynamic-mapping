import { FieldDefinitionBase } from './field-definition';
import { SystemBase } from './system-base';
import { FieldOfType } from './field-of-type';

export class TypeDefinition {
  id: number;
  name: string;
  fields: FieldOfType[];
  systemId: number;
  system: SystemBase;
}
