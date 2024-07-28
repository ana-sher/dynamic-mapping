import { TypeDefinition } from './type-definition.dto';
import { FetchSimpleField } from './header-field.dto';

export class FetchType {
  id: string;
  typeId: string;
  type: TypeDefinition;
  path: string;
  pathEndingPath: string;
  action: Action;
  queryParams: FetchSimpleField[];
  headerParams: FetchSimpleField[];
}

export enum Action {
  Get,
  GetByIdentifier,
  Create,
  Remove,
  Update,
}
