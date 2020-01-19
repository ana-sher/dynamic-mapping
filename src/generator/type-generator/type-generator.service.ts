import { Injectable } from '@nestjs/common';
import { TypeHelperService } from './../../helpers/type-helper/type-helper.service';
import { TypeDefinition } from './../../mapping/dto/type-definition';
import { FieldOfType } from './../../mapping/dto/field-of-type';
import { FieldDefinitionBase } from './../../mapping/dto/field-definition';

@Injectable()
export class TypeGeneratorService {
    constructor(private readonly typeHelper: TypeHelperService) {}

    public generateTypes(data: any, name?: string, addDefaultValues: boolean = false): TypeDefinition[] {
        return this.generateType(data, name, addDefaultValues).types;
    }

    public generateType(data: any, name?: string, addDefaultValues: boolean = false, types?: TypeDefinition[]) {
        if (!types) {
            types = this.createBasicTypes();
        }
        const rootType = new TypeDefinition();
        rootType.name = name || 'Root';
        rootType.fields = new Array<FieldOfType>();
        rootType.id = 3 + Math.round(Math.random() * 10000000);
        types.push(rootType);
        // tslint:disable-next-line: forin
        for (const field in data) {
            const newField = new FieldDefinitionBase();
            newField.name = field;
            if (data[field] === undefined || data[field] === null) {
                continue;
            }
            if (data[field].length && typeof data[field] !== 'string') {
                newField.isArray = true;
                if (data[field].length === 0) {
                    continue;
                }
                data[field] = data[field][0];
            }
            if (this.typeHelper.isBasicType(typeof data[field])) {
                newField.isBasicType = true;
                if (addDefaultValues) {
                    newField.defaultValue = data[field];
                }
                newField.typeOfFieldId = types.find(el => el.name === typeof data[field]).id;
            } else {
                if (!types.find(el => el.name === field)) {
                    const innerType = this.generateType(data[field], field, addDefaultValues, types).type;
                    newField.typeOfFieldId = innerType.id;
                } else {
                    newField.typeOfFieldId = types.find(el => el.name === field).id;
                    const generateResult = this.generateType(data[field], field, addDefaultValues, this.createBasicTypes());
                    types.find(el => el.name === field).fields = this.concatFieldsForType(types.find(el => el.name === field)
                    .fields, generateResult.type.fields, newField.typeOfFieldId);
                }
            }
            const newFieldOfType = new FieldOfType();
            newFieldOfType.id = Math.round(Math.random() * 10000000);
            newField.id = newFieldOfType.id;
            newFieldOfType.typeId = rootType.id;
            newFieldOfType.fieldId = newField.id;
            newFieldOfType.field = newField;
            rootType.fields.push(newFieldOfType);
        }

        return {type: rootType, types };
    }

    private concatFieldsForType(fields1: FieldOfType[], fields2: FieldOfType[], typeId: number): FieldOfType[] {
        fields2 = fields2.filter(el => fields1.findIndex(f => f.field.name === el.field.name) === -1);
        fields1.push(...fields2);

        fields1.forEach(el => {
            el.typeId = typeId;
        });
        return fields1;
    }

    private createBasicTypes(): TypeDefinition[] {
        const types = [];
        this.typeHelper.basicTypes.forEach((el, i) => {
            const newType = new TypeDefinition();
            newType.id = i + 1;
            newType.name = el;
            types.push(newType);
        });
        return types;
    }
}
