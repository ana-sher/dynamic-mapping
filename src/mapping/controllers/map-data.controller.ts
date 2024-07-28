import { Controller, Post, Body } from '@nestjs/common';
import { MapDataService } from '../map-data-services/map-data/map-data.service';
import { FieldConnection } from '../dto/field-connection.dto';
import { TypeDefinition } from '../dto/type-definition.dto';
import { MapDataDto } from '../dto/controller-dto/map-data.dto';

@Controller('map-data')
export class MapDataController {
    constructor(private readonly mapService: MapDataService) {}

    @Post()
    map(@Body() req: MapDataDto) {
        return this.mapService.map(req.objFrom, req.connections, req.typeFromId, req.typeToId, req.types);
    }
}
