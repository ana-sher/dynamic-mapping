import { FieldDefinition } from './field-definition';
import { ConnectionFieldDefinition } from './connection-field-definition';

export class ConnectionValue {
  id: number;
  value: string;
  connectionFieldId: number;
  connectionField: ConnectionFieldDefinition;
  integrationId: number;
}
