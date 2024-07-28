import { TypeDefinition } from './type-definition.dto';
import { ConnectionFieldDefinition } from './connection-field-definition.dto';

export class SystemBase {
  id: string;
  name: string;
  url: string;
  TransferType: TransferType;
  dataType: DataType;
  typeDefinitions: TypeDefinition[];
  connectionFields: ConnectionFieldDefinition[];
}

export enum TransferType {
  FTP,
  API,
}

export enum DataType {
  Json,
  Xml,
}
