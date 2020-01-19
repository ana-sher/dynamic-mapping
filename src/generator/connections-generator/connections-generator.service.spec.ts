import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionsGeneratorService } from './connections-generator.service';
import { TypeHelperService } from './../../helpers/type-helper/type-helper.service';
import { TypeDefinition } from './../../mapping/dto/type-definition';
import { FieldConnection } from './../../mapping/dto/field-connection';

describe('ConnectionsGeneratorService', () => {
  let service: ConnectionsGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectionsGeneratorService, TypeHelperService],
    }).compile();

    service = module.get<ConnectionsGeneratorService>(ConnectionsGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateConnections', () => {
    it('should process flat simple case', () => {
      const result = {
        F8: 'F1',
        F5: 'F2',
      };

      const objFrom = {
        F1: 'F1',
        F2: 'F2',
      };

      const T1: TypeDefinition = {
        id: 1,
        name: 'T1',
        fields: [
          {
            id: 1,
            typeId: 1,
            fieldId: 1,
            field: {
              id: 1,
              name: 'F1',
              typeOfFieldId: 10,
            },
          },
          {
            id: 2,
            typeId: 1,
            fieldId: 2,
            field: {
              id: 2,
              name: 'F2',
              typeOfFieldId: 10,
            },
          },
        ],
      } as TypeDefinition;

      const T2: TypeDefinition = {
        id: 2,
        name: 'T2',
        fields: [
          {
            id: 8,
            typeId: 2,
            fieldId: 8,
            field: {
              id: 8,
              name: 'F8',
              typeOfFieldId: 10,
            },
          },
          {
            id: 5,
            typeId: 2,
            fieldId: 5,
            field: {
              id: 5,
              name: 'F5',
              typeOfFieldId: 10,
            },
          },
        ],
      } as TypeDefinition;

      const T10: TypeDefinition = {
        id: 10,
        name: 'string',
      } as TypeDefinition;
      const connections: FieldConnection[] = [
        {
          firstFieldId: 8,
          firstField: T2.fields.find(el => el.fieldId === 8),
          secondField: T1.fields.find(el => el.fieldId === 1),
          secondFieldId: 1,
        } as FieldConnection,
        {
          firstFieldId: 5,
          firstField: T2.fields.find(el => el.fieldId === 5),
          secondField: T1.fields.find(el => el.fieldId === 2),
          secondFieldId: 2,
        } as FieldConnection,
      ];
      const types: TypeDefinition[] = [T1, T2, T10];
      let actual = service.generateConnections(objFrom, result, T1.id, T2.id, types);
      actual = actual.map(el => ({
        firstFieldId: el.firstFieldId,
        firstField: el.firstField,
        secondField: el.secondField,
        secondFieldId: el.secondFieldId,
      } as FieldConnection));
      expect(actual).toEqual(connections);
    });

    it('should process arrays simple case', () => {
      const result = {
        F9: [{ F5: 'F2' }, { F5: 'F22' }],
        F8: 'F1',
      };

      const objFrom = {
        F3: [{ F2: 'F2' }, { F2: 'F22' }],
        F1: 'F1',
      };

      const T1: TypeDefinition = {
        id: 1,
        name: 'T1',
        fields: [
          {
            id: 1,
            typeId: 1,
            fieldId: 1,
            field: {
              id: 1,
              name: 'F1',
              typeOfFieldId: 10,
            },
          },
          {
            id: 3,
            typeId: 1,
            fieldId: 3,
            field: {
              id: 3,
              name: 'F3',
              typeOfFieldId: 3,
              isArray: true,
            },
          },
        ],
      } as TypeDefinition;

      const T2: TypeDefinition = {
        id: 2,
        name: 'T2',
        fields: [
          {
            id: 8,
            typeId: 2,
            fieldId: 8,
            field: {
              id: 8,
              name: 'F8',
              typeOfFieldId: 10,
            },
          },
          {
            id: 9,
            typeId: 2,
            fieldId: 9,
            field: {
              id: 9,
              name: 'F9',
              typeOfFieldId: 4,
              isArray: true,
            },
          },
        ],
      } as TypeDefinition;

      const T3: TypeDefinition = {
        id: 3,
        name: 'T3',
        fields: [
          {
            id: 2,
            typeId: 3,
            fieldId: 2,
            field: {
              id: 2,
              name: 'F2',
              typeOfFieldId: 10,
            },
          }],
      } as TypeDefinition;

      const T4: TypeDefinition = {
        id: 4,
        name: 'T4',
        fields: [
          {
            id: 5,
            typeId: 4,
            fieldId: 5,
            field: {
              id: 5,
              name: 'F5',
              typeOfFieldId: 10,
            },
          }],
      } as TypeDefinition;

      const T10: TypeDefinition = {
        id: 10,
        name: 'string',
      } as TypeDefinition;

      const types: TypeDefinition[] = [T1, T2, T3, T4, T10];
      const connections: FieldConnection[] = [
        {
          firstFieldId: 8,
          firstField: T2.fields.find(el => el.fieldId === 8),
          secondField: T1.fields.find(el => el.fieldId === 1),
          secondFieldId: 1,
        } as FieldConnection,
        {
          firstFieldId: 5,
          firstField: T4.fields.find(el => el.fieldId === 5),
          secondField: T3.fields.find(el => el.fieldId === 2),
          secondFieldId: 2,
        } as FieldConnection,
      ];

      let actual = service.generateConnections(objFrom, result, T1.id, T2.id, types);
      actual = actual.map(el => ({
        firstFieldId: el.firstFieldId,
        firstField: el.firstField,
        secondField: el.secondField,
        secondFieldId: el.secondFieldId,
      } as FieldConnection));
      expect(actual).toEqual(connections);
    });
  });
});
