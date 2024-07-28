import { SystemBase } from './system-base.dto';
import { FieldDefinition } from './field-definition.dto';

export class TypeDefinition {
  id: number;
  name: string;
  fields: FieldDefinition[];
  systemId?: number;
  system?: SystemBase;
}
