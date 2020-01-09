import { SystemConnection } from './system-connection';

export class SystemBase {
  id: string;
  name: string;
  transpherType: TranspherType;
  dataType: DataType;
  connections: SystemConnection[];
}

enum TranspherType {
  FTP,
  API,
}

enum DataType {
  Json,
  Xml,
}
