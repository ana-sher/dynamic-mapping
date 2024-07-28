import { Controller, Post, Body } from '@nestjs/common';
import { TypeGeneratorService } from './type-generator.service';
import { TypeDefinition } from '../../mapping/dto/type-definition.dto';
import { TypeGeneratorDto } from 'src/mapping/dto/controller-dto/type-generator.dto';

@Controller('type-generator')
export class TypeGeneratorController {
    constructor(private readonly typeGenerator: TypeGeneratorService) {}

    @Post()
    generate(@Body() req: TypeGeneratorDto) {
        return this.typeGenerator.generateTypes(req.data, req.name, req.addDefaultValues, req.types);
    }
}
