import { FieldDefinitionBase } from './field-definition';
import { TypeDefinition } from './type-definition';

export class FieldOfType {
    id: number;
    typeId: number;
    fieldId: number;
    field: FieldDefinitionBase;
    type: TypeDefinition;
}
