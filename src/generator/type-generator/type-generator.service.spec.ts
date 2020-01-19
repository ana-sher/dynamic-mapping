import { TypeGeneratorService } from './type-generator.service';
import { TypeDefinition } from './../../mapping/dto/type-definition';
import { TypeHelperService } from './../../helpers/type-helper/type-helper.service';
import { FieldOfType } from './../../mapping/dto/field-of-type';
import { FieldDefinitionBase } from './../../mapping/dto/field-definition';

describe('TypeGeneratorService', () => {
  let service: TypeGeneratorService;
  let typeHelper: TypeHelperService;
  let basicTypes: TypeDefinition[];

  beforeEach(() => {
    typeHelper = new TypeHelperService();
    service = new TypeGeneratorService(typeHelper);
    const t1 = new TypeDefinition();
    t1.name = 'string';

    const t2 = new TypeDefinition();
    t2.name = 'number';

    const t3 = new TypeDefinition();
    t3.name = 'boolean';

    basicTypes = new Array<TypeDefinition>(t1, t2, t3);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTypes', () => {
    it('should generate types', () => {
      const objFrom = {
        F1: 'F1',
        F2: 'F2',
        F3: [{ F4: 'F4' }],
      };

      const T1 = new TypeDefinition();
      Object.assign<TypeDefinition, object>(T1, {
        name: 'T1',
        fields: [
          {
            field: {
              name: 'F1',
              isBasicType: true,
              typeOfFieldId: 1,
            } as FieldDefinitionBase,
          },
          {
            field: {
              name: 'F2',
              isBasicType: true,
              typeOfFieldId: 1,
            } as FieldDefinitionBase,
          },
          {
            field: {
              name: 'F3',
              isArray: true,
            } as FieldDefinitionBase,
          },
        ] as FieldOfType[],
      });

      const T3 = new TypeDefinition();
      Object.assign<TypeDefinition, object>(T3, {
        name: 'F3',
        fields: [
          {
            field: {
              name: 'F4',
              isBasicType: true,
              typeOfFieldId: 1,
            },
          },
        ] as FieldOfType[],
      });

      const actual = service.generateTypes(objFrom, 'T1');

      actual.forEach(el => {
        el.fields = el.fields?.map(k => ( {field:
          {typeOfFieldId: k.field.typeOfFieldId < 4 ? k.field.typeOfFieldId : undefined,
            name: k.field.name, isBasicType: k.field.isBasicType, isArray: k.field.isArray} } as FieldOfType));
      });

      actual.forEach(el => {
        delete(el.id);
      });
      expect(actual).toEqual(new Array<TypeDefinition>(...basicTypes, T1, T3));
    });
  });
});
