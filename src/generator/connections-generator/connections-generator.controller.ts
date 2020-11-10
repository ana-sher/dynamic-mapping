import { Controller, Post, Body } from '@nestjs/common';
import { ConnectionsGeneratorService } from './connections-generator.service';
import { TypeDefinition } from 'src/mapping/dto/type-definition';
import { TypeGeneratorService } from '../type-generator/type-generator.service';

@Controller('connections-generator')
export class ConnectionsGeneratorController {
    constructor(private readonly connectionsGenerator: ConnectionsGeneratorService,
                private readonly typeGenerator: TypeGeneratorService) { }

    @Post()
    generate(@Body() req: { objFrom: any, objTo: any, typeFromId?: number, typeToId?: number, types?: TypeDefinition[] }) {
        if (!req.typeFromId || !req.typeToId || !req.types) {
            const typesFrom = this.typeGenerator.generateTypes(req.objFrom, 'TypeFrom', true);
            const typesTo = this.typeGenerator.generateTypes(req.objTo, 'TypeTo', true);
            req.types = this.concatTypes(typesFrom, typesTo);
            req.typeFromId = typesFrom.find(el => el.name === 'TypeFrom').id;
            req.typeToId = typesTo.find(el => el.name === 'TypeTo').id;
        }
        return {
            types: req.types,
            typeFromId: req.typeFromId,
            typeToId: req.typeToId,
            connections: this.connectionsGenerator.generateConnections(req.objFrom, req.objTo, req.typeFromId, req.typeToId, req.types),
        };
    }

    private concatTypes(typesFrom: TypeDefinition[], typesTo: TypeDefinition[]): TypeDefinition[] {
        typesTo.splice(0, 3);
        const repeatedTypes = typesFrom.filter(el => typesTo.findIndex(c => c.id === el.id) !== -1);
        for (const repeatedType of repeatedTypes) {
            const oldId = repeatedType.id;
            repeatedType.id = Math.round(Math.random() * 10000000);
            repeatedType.fields.forEach(el => el.typeId = repeatedType.id);
            typesFrom.forEach(el => {
                el.fields.forEach(f => {
                    if (f.typeOfFieldId === oldId) {
                        f.typeOfFieldId = repeatedType.id;
                    }
                });
            });
        }
        const fromFields = JSON.parse(JSON.stringify(typesFrom.map(el => el.fields).filter(el => el))).reduce((prev, cur, ind) => {
            prev.push(...cur);
            return prev;
        });
        const toFields = JSON.parse(JSON.stringify(typesTo.map(el => el.fields).filter(el => el))).reduce((prev, cur, ind) => {
            prev.push(...cur);
            return prev;
        });
        const repeatedFields = fromFields.filter(el => toFields.findIndex(c => c.id === el.id) !== -1);
        for (const repeatedField of repeatedFields) {
            const actualField = typesFrom.map(el => el.fields).filter(el => el)
                .find(el => el.findIndex(f => f.id === repeatedField.id) !== -1).find(f => f.id === repeatedField.id);
            actualField.id = Math.round(Math.random() * 10000000);
            actualField.id = actualField.id;
        }
        typesFrom.push(...typesTo);
        return typesFrom;
    }
}
