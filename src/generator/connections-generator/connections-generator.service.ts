import { Injectable } from '@nestjs/common';
import { TypeDefinition } from './../../mapping/dto/type-definition';
import { FieldConnection } from './../../mapping/dto/field-connection';
import { FieldOfType } from './../../mapping/dto/field-of-type';
import { TypeHelperService } from './../../helpers/type-helper/type-helper.service';

@Injectable()
export class ConnectionsGeneratorService {
    constructor(private readonly typeHelper: TypeHelperService) {}

    public generateConnections(objFrom: any, objTo: any, typeFromId: number, typeToId: number, types: TypeDefinition[]): FieldConnection[] {
        return this.iterateThroughFields(objFrom, objTo, typeFromId, typeToId, types);
    }

    private iterateThroughFields(objFrom: any, objTo: any, typeFromId: number, typeToId: number, types: TypeDefinition[]): FieldConnection[] {
        const typeTo = types.find(el => el.id === typeToId);
        let connections = [];
        for (const field of typeTo.fields) {
            let fieldValue = objTo[field.field.name];
            if (fieldValue === undefined || fieldValue === null) {
                continue;
            }
            if (field.field.isArray && fieldValue.length > 0) {
                fieldValue = fieldValue[0];
            }
            if (this.typeHelper.isBasicType(types.find(el => el.id === field.field.typeOfFieldId).name)) {
                const connectionField = this.findConnection(fieldValue, objFrom, typeFromId, types);
                if (connectionField) {
                    const connection = new FieldConnection();
                    connection.id = Math.round(Math.random() * 10000);
                    connection.firstFieldId = field.id;
                    connection.firstField = field;
                    connection.secondFieldId = connectionField.id;
                    connection.secondField = connectionField;
                    connections.push(connection);
                }
            } else {
                const innerConnections = this.iterateThroughFields(objFrom, fieldValue, typeFromId, field.field.typeOfFieldId, types);
                if (innerConnections) {
                    connections.push(...innerConnections);
                }
            }
        }

        return connections;
    }

    private findConnection(valueToFind: any, objFrom: any, typeFromId: number, types: TypeDefinition[]): FieldOfType {
        const typeFrom = types.find(el => el.id === typeFromId);
        for (const field of typeFrom.fields) {
            let fieldValue = objFrom[field.field.name];
            if (fieldValue === undefined || fieldValue === null) {
                continue;
            }
            if (field.field.isArray && fieldValue.length > 0) {
                fieldValue = fieldValue[0];
            }
            if (this.typeHelper.isBasicType(types.find(el => el.id === field.field.typeOfFieldId).name)) {
                // tslint:disable-next-line: triple-equals
                if (fieldValue == valueToFind) {
                    return field;
                }
            } else {
                const connField = this.findConnection(valueToFind, fieldValue, field.field.typeOfFieldId, types);
                if (connField) {
                    return connField;
                }
            }
        }

        return;
    }
}
