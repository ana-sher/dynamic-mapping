import { FieldConnection } from '../field-connection.dto';
import { TypeDefinition } from '../type-definition.dto';

export class MapDataDto {
  objFrom: any;
  connections: FieldConnection[];
  typeFromId: number;
  typeToId: number;
  types: TypeDefinition[];
}
