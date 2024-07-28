import { TypeDefinition } from '../type-definition.dto';

export class ConnectionsGeneratorDto {
  objFrom: any;
  objTo: any;
  typeFromId?: number;
  typeToId?: number;
  types?: TypeDefinition[];
}
