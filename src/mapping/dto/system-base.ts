
import { TypeDefinition } from './type-definition';
import { ConnectionFieldDefinition } from './connection-field-definition';

export class SystemBase {
  id: string;
  name: string;
  url: string;
  transpherType: TranspherType;
  dataType: DataType;
  typeDefinitions: TypeDefinition[];
  connectionFields: ConnectionFieldDefinition[];
}

export enum TranspherType {
  FTP,
  API,
}

export enum DataType {
  Json,
  Xml,
}
