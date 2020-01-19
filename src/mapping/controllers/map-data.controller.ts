import { Controller, Post, Body } from '@nestjs/common';
import { MapDataService } from '../map-data-services/map-data/map-data.service';
import { FieldConnection } from '../dto/field-connection';
import { TypeDefinition } from '../dto/type-definition';

@Controller('map-data')
export class MapDataController {
    constructor(private readonly mapService: MapDataService) {}

    @Post()
    map(@Body() req: { fromObj: any, connections: FieldConnection[], fromTypeId: number, toTypeId: number, types: TypeDefinition[] }) {
        return this.mapService.map(req.fromObj, req.connections, req.fromTypeId, req.toTypeId, req.types);
    }
}
