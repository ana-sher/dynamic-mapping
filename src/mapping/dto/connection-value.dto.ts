import { ConnectionFieldDefinition } from './connection-field-definition.dto';

export class ConnectionValue {
  id: number;
  value: string;
  connectionFieldId: number;
  connectionField: ConnectionFieldDefinition;
  integrationId: number;
}
