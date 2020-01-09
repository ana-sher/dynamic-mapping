import { FetchField } from './fetch-field';
import { TypeDefinition } from './type-definition';
import { HeaderField } from './header-field';

export class FetchType {
  id: string;
  typeId: string;
  type: TypeDefinition;
  path: string;
  pathEndingPath: string;
  action: Action;
  queryParams: FetchField[];
  headerParams: HeaderField[];
}

export enum Action {
  Get,
  GetByIdentifier,
  Create,
  Remove,
  Update,
}
