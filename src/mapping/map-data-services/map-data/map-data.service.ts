import { Injectable } from '@nestjs/common';

@Injectable()
export class MapDataService {
  public map(fromObj: any, fromTypeId: string, toMapId: string): object {
    // get fields connected to types from db (FieldDefBase)
    // get FieldConnections connected to  FieldDefBase (only if both ids are in previous list)
    // construct object using reflection from fromObj and existed fields from db
    return {};
  }
}
