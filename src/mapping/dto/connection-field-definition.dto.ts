import { SystemBase } from './system-base.dto';
import { ConnectionValue } from './connection-value.dto';

export class ConnectionFieldDefinition {
  id: number;
  name: string;
  role: FieldTransferRole;
  systemId: number;
  systemDefinition: SystemBase;
  connectionFieldValues: ConnectionValue[];
}

export enum FieldTransferRole {
  Header,
  JsonBody,
  Query,
}
