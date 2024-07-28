/* eslint-disable */
export default async () => {
    const t = {
        ["./mapping/dto/connection-field-definition.dto"]: await import("./mapping/dto/connection-field-definition.dto"),
        ["./mapping/dto/system-base.dto"]: await import("./mapping/dto/system-base.dto"),
        ["./mapping/dto/connection-value.dto"]: await import("./mapping/dto/connection-value.dto"),
        ["./mapping/dto/type-definition.dto"]: await import("./mapping/dto/type-definition.dto"),
        ["./mapping/dto/field-definition.dto"]: await import("./mapping/dto/field-definition.dto"),
        ["./mapping/dto/field-connection.dto"]: await import("./mapping/dto/field-connection.dto"),
        ["./mapping/dto/fetch-type.dto"]: await import("./mapping/dto/fetch-type.dto"),
        ["./mapping/dto/header-field.dto"]: await import("./mapping/dto/header-field.dto")
    };
    return { "@nestjs/swagger": { "models": [[import("./mapping/dto/connection-value.dto"), { "ConnectionValue": { id: { required: true, type: () => Number }, value: { required: true, type: () => String }, connectionFieldId: { required: true, type: () => Number }, connectionField: { required: true, type: () => t["./mapping/dto/connection-field-definition.dto"].ConnectionFieldDefinition }, integrationId: { required: true, type: () => Number } } }], [import("./mapping/dto/connection-field-definition.dto"), { "ConnectionFieldDefinition": { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, role: { required: true, enum: t["./mapping/dto/connection-field-definition.dto"].FieldTransferRole }, systemId: { required: true, type: () => Number }, systemDefinition: { required: true, type: () => t["./mapping/dto/system-base.dto"].SystemBase }, connectionFieldValues: { required: true, type: () => [t["./mapping/dto/connection-value.dto"].ConnectionValue] } } }], [import("./mapping/dto/system-base.dto"), { "SystemBase": { id: { required: true, type: () => String }, name: { required: true, type: () => String }, url: { required: true, type: () => String }, TransferType: { required: true, enum: t["./mapping/dto/system-base.dto"].TransferType }, dataType: { required: true, enum: t["./mapping/dto/system-base.dto"].DataType }, typeDefinitions: { required: true, type: () => [t["./mapping/dto/type-definition.dto"].TypeDefinition] }, connectionFields: { required: true, type: () => [t["./mapping/dto/connection-field-definition.dto"].ConnectionFieldDefinition] } } }], [import("./mapping/dto/field-definition.dto"), { "FieldDefinition": { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, typeOfFieldId: { required: false, type: () => Number }, isArray: { required: false, type: () => Boolean }, isBasicType: { required: false, type: () => Boolean }, required: { required: false, type: () => Boolean }, defaultValue: { required: false, type: () => Object }, typeId: { required: false, type: () => Number }, type: { required: false, type: () => t["./mapping/dto/type-definition.dto"].TypeDefinition } } }], [import("./mapping/dto/type-definition.dto"), { "TypeDefinition": { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, fields: { required: true, type: () => [t["./mapping/dto/field-definition.dto"].FieldDefinition] }, systemId: { required: false, type: () => Number }, system: { required: false, type: () => t["./mapping/dto/system-base.dto"].SystemBase } } }], [import("./mapping/dto/controller-dto/type-generator.dto"), { "TypeGeneratorDto": { data: { required: true, type: () => Object }, name: { required: false, type: () => String }, addDefaultValues: { required: false, type: () => Boolean }, types: { required: false, type: () => [t["./mapping/dto/type-definition.dto"].TypeDefinition] } } }], [import("./mapping/dto/field-connection.dto"), { "FieldConnection": { id: { required: true, type: () => Number }, firstFieldId: { required: false, type: () => Number }, secondFieldId: { required: false, type: () => Number }, firstField: { required: false, type: () => t["./mapping/dto/field-definition.dto"].FieldDefinition }, secondField: { required: false, type: () => t["./mapping/dto/field-definition.dto"].FieldDefinition }, firstFieldFilterFunction: { required: false, type: () => String }, secondFieldFilterFunction: { required: false, type: () => String } } }], [import("./mapping/dto/types-dict.dto"), { "TypesDict": {} }], [import("./mapping/dto/controller-dto/connections-generator.dto"), { "ConnectionsGeneratorDto": { objFrom: { required: true, type: () => Object }, objTo: { required: true, type: () => Object }, typeFromId: { required: false, type: () => Number }, typeToId: { required: false, type: () => Number }, types: { required: false, type: () => [t["./mapping/dto/type-definition.dto"].TypeDefinition] } } }], [import("./mapping/dto/controller-dto/parse-data.dto"), { "ParseDataDto": { data: { required: true, type: () => Object }, type: { required: false, enum: t["./mapping/dto/system-base.dto"].DataType } } }], [import("./mapping/dto/controller-dto/write-data.dto"), { "WriteDataDto": { data: { required: true, type: () => Object }, type: { required: false, enum: t["./mapping/dto/system-base.dto"].DataType } } }], [import("./mapping/dto/controller-dto/map-data.dto"), { "MapDataDto": { objFrom: { required: true, type: () => Object }, connections: { required: true, type: () => [t["./mapping/dto/field-connection.dto"].FieldConnection] }, typeFromId: { required: true, type: () => Number }, typeToId: { required: true, type: () => Number }, types: { required: true, type: () => [t["./mapping/dto/type-definition.dto"].TypeDefinition] } } }], [import("./mapping/dto/header-field.dto"), { "FetchSimpleField": { id: { required: true, type: () => String }, fetchTypeId: { required: true, type: () => String }, fetchType: { required: true, type: () => t["./mapping/dto/fetch-type.dto"].FetchType }, name: { required: true, type: () => String }, value: { required: true, type: () => String }, valueFetchPath: { required: true, type: () => String } } }], [import("./mapping/dto/fetch-type.dto"), { "FetchType": { id: { required: true, type: () => String }, typeId: { required: true, type: () => String }, type: { required: true, type: () => t["./mapping/dto/type-definition.dto"].TypeDefinition }, path: { required: true, type: () => String }, pathEndingPath: { required: true, type: () => String }, action: { required: true, enum: t["./mapping/dto/fetch-type.dto"].Action }, queryParams: { required: true, type: () => [t["./mapping/dto/header-field.dto"].FetchSimpleField] }, headerParams: { required: true, type: () => [t["./mapping/dto/header-field.dto"].FetchSimpleField] } } }], [import("./mapping/dto/controller-dto/fetch-data.dto"), { "FetchDataDto": { fetchType: { required: true, type: () => t["./mapping/dto/fetch-type.dto"].FetchType }, type: { required: false, enum: t["./mapping/dto/system-base.dto"].TransferType }, data: { required: true, type: () => Object } } }], [import("./mapping/dto/fetch-field.dto"), { "FetchField": { id: { required: true, type: () => String }, fetchTypeId: { required: true, type: () => String }, fetchType: { required: true, type: () => t["./mapping/dto/fetch-type.dto"].FetchType }, field: { required: true, type: () => t["./mapping/dto/field-definition.dto"].FieldDefinition }, fieldId: { required: true, type: () => String }, value: { required: true, type: () => String }, valueFetchPath: { required: true, type: () => String } } }], [import("./mapping/dto/setting.dto"), { "Setting": { id: { required: true, type: () => String }, fieldId: { required: true, type: () => String }, field: { required: true, type: () => t["./mapping/dto/field-definition.dto"].FieldDefinition }, isFiltered: { required: true, type: () => Boolean }, possibleValues: { required: true, type: () => [Object] }, fetchValuesPath: { required: true, type: () => String } } }]], "controllers": [[import("./generator/type-generator/type-generator.controller"), { "TypeGeneratorController": { "generate": { type: [t["./mapping/dto/type-definition.dto"].TypeDefinition] } } }], [import("./generator/connections-generator/connections-generator.controller"), { "ConnectionsGeneratorController": { "generate": {} } }], [import("./mapping/controllers/parse-data.controller"), { "ParseDataController": { "parse": {} } }], [import("./mapping/controllers/write-data.controller"), { "WriteDataController": { "write": {} } }], [import("./mapping/controllers/map-data.controller"), { "MapDataController": { "map": { type: Object } } }], [import("./mapping/controllers/fetch-data.controller"), { "FetchDataController": { "fetch": { type: Object } } }]] } };
};