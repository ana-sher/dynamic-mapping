import { SystemBase } from './system-base';
import { FieldDefinition } from './field-definition';

export class TypeDefinition {
  id: number;
  name: string;
  fields: FieldDefinition[];
  systemId?: number;
  system?: SystemBase;
}
