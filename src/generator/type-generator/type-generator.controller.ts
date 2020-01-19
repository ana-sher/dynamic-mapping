import { Controller, Post, Body } from '@nestjs/common';
import { TypeGeneratorService } from './type-generator.service';

@Controller('type-generator')
export class TypeGeneratorController {
    constructor(private readonly typeGenerator: TypeGeneratorService) {}

    @Post()
    generate(@Body() req: { data: any, name?: string, addDefaultValues?: boolean }) {
        return this.typeGenerator.generateTypes(req.data, req.name, req.addDefaultValues);
    }
}
