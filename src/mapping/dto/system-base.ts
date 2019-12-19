import { SystemConnection } from './system-connection';

export class SystemBase {
  name: string;
  transpherType: TranspherType;
  connections: SystemConnection[];
}

enum TranspherType {
  FTP,
  API,
}
