import { MapDataService } from './map-data.service';
import { TypeDefinition } from 'src/mapping/dto/type-definition';
import { FieldOfType } from 'src/mapping/dto/field-of-type';
import { FieldDefinitionBase } from 'src/mapping/dto/field-definition';
import { FieldConnection } from 'src/mapping/dto/field-connection';

describe('MapDataService', () => {
    let mapDataService: MapDataService;

    beforeEach(() => {
        mapDataService = new MapDataService();
    });

    describe('map', () => {
        it('should return mapped object', async () => {
            const result = [{
                F8: 'F4',
                F5: [{ F6: 'F1', F7: 'F2' }],
            }];

            const objFrom = {
                F1: 'F1',
                F2: 'F2',
                F3: [{ F4: 'F4' }],
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
                        id: 5,
                        typeId: 2,
                        fieldId: 5,
                        field: {
                            id: 5,
                            name: 'F5',
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
                        id: 4,
                        typeId: 3,
                        fieldId: 4,
                        field: {
                            id: 4,
                            name: 'F4',
                            typeOfFieldId: 10,
                        },
                    },
                ],
            } as TypeDefinition;

            const T10: TypeDefinition = {
                id: 10,
                name: 'string',
            } as TypeDefinition;

            const T4: TypeDefinition = {
                id: 4,
                name: 'T4',
                fields: [
                    {
                        id: 6,
                        typeId: 4,
                        fieldId: 6,
                        field: {
                            id: 6,
                            name: 'F6',
                            typeOfFieldId: 10,
                        },
                    },
                    {
                        id: 7,
                        typeId: 4,
                        fieldId: 7,
                        field: {
                            id: 7,
                            name: 'F7',
                            typeOfFieldId: 10,
                        },
                    },
                ],
            } as TypeDefinition;

            const types: TypeDefinition[] = [T1, T2, T3, T4, T10];
            const connections: FieldConnection[] = [
                {
                    id: 1,
                    firstFieldId: 1,
                    firstField: T1.fields.find(el => el.fieldId === 1),
                    secondField: T4.fields.find(el => el.fieldId === 6),
                    secondFieldId: 6,
                } as FieldConnection,
                {
                    id: 2,
                    firstFieldId: 2,
                    firstField: T1.fields.find(el => el.fieldId === 2),
                    secondField: T4.fields.find(el => el.fieldId === 7),
                    secondFieldId: 7,
                } as FieldConnection,
                {
                    id: 3,
                    firstFieldId: 4,
                    firstField: T3.fields.find(el => el.fieldId === 4),
                    secondField: T2.fields.find(el => el.fieldId === 8),
                    secondFieldId: 8,
                } as FieldConnection,
            ];
            const actual = mapDataService.map(objFrom, connections, T1.id, T2.id, types);
            expect(actual).toEqual(result);
        });
        it('should process simple flat case', async () => {
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

            const types: TypeDefinition[] = [T1, T2, T10];
            const connections: FieldConnection[] = [
                {
                    id: 1,
                    firstFieldId: 1,
                    firstField: T1.fields.find(el => el.fieldId === 1),
                    secondField: T2.fields.find(el => el.fieldId === 8),
                    secondFieldId: 8,
                } as FieldConnection,
                {
                    id: 2,
                    firstFieldId: 2,
                    firstField: T1.fields.find(el => el.fieldId === 2),
                    secondField: T2.fields.find(el => el.fieldId === 5),
                    secondFieldId: 5,
                } as FieldConnection,
            ];
            const actual = mapDataService.map(objFrom, connections, T1.id, T2.id, types);
            expect(actual).toEqual(result);
        });
        it('should process simple case with arrays', async () => {
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
                    id: 1,
                    firstFieldId: 1,
                    firstField: T1.fields.find(el => el.fieldId === 1),
                    secondField: T2.fields.find(el => el.fieldId === 8),
                    secondFieldId: 8,
                } as FieldConnection,
                {
                    id: 2,
                    firstFieldId: 2,
                    firstField: T3.fields.find(el => el.fieldId === 2),
                    secondField: T4.fields.find(el => el.fieldId === 5),
                    secondFieldId: 5,
                } as FieldConnection,
            ];
            const actual = mapDataService.map(objFrom, connections, T1.id, T2.id, types);
            expect(actual).toEqual(result);
        });

        it('should process simple case with one array', async () => {
            const result = {
                F9: [{ F5: 'F1' }],
            };

            const objFrom = {
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
                ],
            } as TypeDefinition;

            const T2: TypeDefinition = {
                id: 2,
                name: 'T2',
                fields: [
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

            const types: TypeDefinition[] = [T1, T2, T4, T10];
            const connections: FieldConnection[] = [
                {
                    id: 1,
                    firstFieldId: 1,
                    firstField: T1.fields.find(el => el.fieldId === 1),
                    secondField: T4.fields.find(el => el.fieldId === 5),
                    secondFieldId: 5,
                } as FieldConnection,
            ];
            const actual = mapDataService.map(objFrom, connections, T1.id, T2.id, types);
            expect(actual).toEqual(result);
        });

        it('should process simple case with nested types', async () => {
            const result = {
                F9: { F5: 'F2' },
            };

            const objFrom = {
                F1: { F2: 'F2' },
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
                            typeOfFieldId: 3,
                        },
                    },
                ],
            } as TypeDefinition;

            const T2: TypeDefinition = {
                id: 2,
                name: 'T2',
                fields: [
                    {
                        id: 9,
                        typeId: 2,
                        fieldId: 9,
                        field: {
                            id: 9,
                            name: 'F9',
                            typeOfFieldId: 4,
                        },
                    },
                ],
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

            const T10: TypeDefinition = {
                id: 10,
                name: 'string',
            } as TypeDefinition;

            const types: TypeDefinition[] = [T1, T2, T3, T4, T10];
            const connections: FieldConnection[] = [
                {
                    id: 1,
                    firstFieldId: 2,
                    firstField: T3.fields.find(el => el.fieldId === 2),
                    secondField: T4.fields.find(el => el.fieldId === 5),
                    secondFieldId: 5,
                } as FieldConnection,
            ];
            const actual = mapDataService.map(objFrom, connections, T1.id, T2.id, types);
            expect(actual).toEqual(result);
        });

        it('should process simple case with nested types', async () => {
            const result = {
                F5: 'F2',
            };

            const objFrom = {
                F1: { F2: 'F2' },
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
                            typeOfFieldId: 3,
                        },
                    },
                ],
            } as TypeDefinition;

            const T2: TypeDefinition = {
                id: 2,
                name: 'T2',
                fields: [
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

            const T10: TypeDefinition = {
                id: 10,
                name: 'string',
            } as TypeDefinition;

            const types: TypeDefinition[] = [T1, T2, T3, T10];
            const connections: FieldConnection[] = [
                {
                    id: 1,
                    firstFieldId: 2,
                    firstField: T3.fields.find(el => el.fieldId === 2),
                    secondField: T2.fields.find(el => el.fieldId === 5),
                    secondFieldId: 5,
                } as FieldConnection,
            ];
            const actual = mapDataService.map(objFrom, connections, T1.id, T2.id, types);
            expect(actual).toEqual(result);
        });
    });
});
