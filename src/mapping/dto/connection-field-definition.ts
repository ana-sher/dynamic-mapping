import { SystemBase } from './system-base';
import { ConnectionValue } from './connection-value';

export interface ConnectionFieldDefinition {
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
