import { TypeGeneratorService } from './type-generator.service';
import { TypeDefinition } from './../../mapping/dto/type-definition';
import { TypeHelperService } from './../../helpers/type-helper/type-helper.service';
import { FieldDefinition } from './../../mapping/dto/field-definition';

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
              name: 'F1',
              isBasicType: true,
              typeOfFieldId: 1,
          },
          {
              name: 'F2',
              isBasicType: true,
              typeOfFieldId: 1,
          },
          {
              name: 'F3',
              isArray: true,
          },
        ] as FieldDefinition[],
      });

      const T3 = new TypeDefinition();
      Object.assign<TypeDefinition, object>(T3, {
        name: 'F3',
        fields: [
          {
              name: 'F4',
              isBasicType: true,
              typeOfFieldId: 1,
          },
        ] as FieldDefinition[],
      });

      const actual = service.generateTypes(objFrom, 'T1');

      actual.forEach(el => {
        el.fields = el.fields?.map(k => (
          {typeOfFieldId: k.typeOfFieldId < 4 ? k.typeOfFieldId : undefined,
            name: k.name, isBasicType: k.isBasicType, isArray: k.isArray} as FieldDefinition));
      });

      actual.forEach(el => {
        delete(el.id);
      });
      expect(actual).toEqual(new Array<TypeDefinition>(...basicTypes, T1, T3));
    });
  });
});
