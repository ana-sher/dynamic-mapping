import { TypeDefinition } from "../type-definition.dto";

export class TypeGeneratorDto {
  data: any;
  name?: string;
  addDefaultValues?: boolean;
  types?: TypeDefinition[];
}
