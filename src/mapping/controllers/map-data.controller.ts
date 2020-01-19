import { Controller, Post, Body } from '@nestjs/common';
import { MapDataService } from '../map-data-services/map-data/map-data.service';
import { FieldConnection } from '../dto/field-connection';
import { TypeDefinition } from '../dto/type-definition';

@Controller('map-data')
export class MapDataController {
    constructor(private readonly mapService: MapDataService) {}

    @Post()
    map(@Body() req: { objFrom: any, connections: FieldConnection[], typeFromId: number, typeToId: number, types: TypeDefinition[] }) {
        return this.mapService.map(req.objFrom, req.connections, req.typeFromId, req.typeToId, req.types);
    }
}
