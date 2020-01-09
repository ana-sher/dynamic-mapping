import { Injectable } from '@nestjs/common';
import { FieldConnection } from 'src/mapping/dto/field-connection';
import { FieldOfType } from 'src/mapping/dto/field-of-type';
import { TypeDefinition } from 'src/mapping/dto/type-definition';
import { TypesDict } from 'src/mapping/dto/types-dict';
import { FieldDefinitionBase } from 'src/mapping/dto/field-definition';

@Injectable()
export class MapDataService {
  private readonly basicTypes: string[];
  private readonly basicTypeConvertions: {
    [key: string]: (val: string) => any;
  };

  constructor() {
    this.basicTypes = ['string', 'number', 'boolean'];
    this.basicTypeConvertions = {
      string: val => val,
      number: val => Number(val),
      boolean: val => Boolean(val),
    };
  }

  public map(fromObj: any, connections: FieldConnection[], fromTypeId: number, toTypeId: number, neededTypes: TypeDefinition[]): object {
    const typesDict: TypesDict = this.normalizeArray(
      neededTypes,
      'id',
    );

    const obj = this.createTargetObject(fromObj, typesDict[fromTypeId], typesDict[toTypeId], connections, typesDict);

    return obj;
  }

  private createTargetObject(sourceObj: any, typeFrom: TypeDefinition, targetType: TypeDefinition,
                             connections: FieldConnection[], typesDict: TypesDict): any {
    let targetObj: any = {};
    const fieldsFromWithArrayInPath = this.searchArrayFieldForType(targetType, typeFrom, connections, typesDict);
    const fieldsToWithArrayInPath = this.searchArrayFieldForType(typeFrom, targetType, connections, typesDict);
    if (fieldsFromWithArrayInPath.length !== fieldsToWithArrayInPath.length) {
      const field = this.findNotConnectedToArray(fieldsFromWithArrayInPath, fieldsToWithArrayInPath, connections);
      const path = this.getPath(field, typeFrom, typesDict);
      const arrayFields = path.filter(el => el.field.isArray);
      const arrayField = arrayFields[0];
      const neededPath = path.slice(0, path.indexOf(arrayField));
      const objectsToIterate = this.getValue(sourceObj, neededPath);
      targetObj = [];
      for (let i = 0; i < objectsToIterate.length; i++) {
        const ind = [];
        ind.push(i);
        for (const fieldFrom of typesDict[arrayField.field.typeOfFieldId].fields) {
          const conn = connections.find(el => el.firstFieldId === fieldFrom.id || el.secondFieldId === fieldFrom.id);
          const fieldTo = conn.firstFieldId === fieldFrom.id ? conn.secondField : conn.firstField;
          if (field.field.isArray || !this.isBasicType(typesDict[field.field.typeOfFieldId].name)) {
            targetObj.push(this.mapTypes(fieldTo, typeFrom, sourceObj, connections, typesDict, ind));
          } else {
            targetObj.push(this.mapFields(typeFrom, field, fieldTo.field, sourceObj, typesDict));
          }
        }
      }
    }
    for (const field of targetType.fields) {
      if (field.field.isArray || !this.isBasicType(typesDict[field.field.typeOfFieldId].name)) {
        targetObj[field.field.name] = this.mapTypes(field, typeFrom, sourceObj, connections, typesDict);
      } else {
        const connection = connections.find(el => el.firstFieldId === field.id || el.secondFieldId === field.id);
        const fieldFrom = connection.firstFieldId === field.id ? connection.secondField : connection.firstField;
        targetObj[field.field.name] = this.mapFields(typeFrom, fieldFrom, field.field, sourceObj, typesDict);
      }
    }

    return targetObj;
  }

  private findNotConnectedToArray(fieldsFrom: FieldOfType[], fieldsTo: FieldOfType[], connections: FieldConnection[]): FieldOfType {
    return fieldsFrom.find(
      el => fieldsTo.findIndex(f => {
        const connection = connections.find(c => c.firstFieldId === el.id || c.secondFieldId === el.id);
        const toField = connection.firstFieldId === el.id ? connection.secondField : connection.firstField;
        return f.id === toField.id;
      }) === -1);
  }

  private getValue(obj: any, pathFields: FieldOfType[], indexes: number[] = []): any {
    let value = JSON.parse(JSON.stringify(obj));
    let indOfIndexes = 0;
    for (const field of pathFields) {
      if (field.field.isArray && indexes.length > indOfIndexes) {
        value = value[field.field.name][indexes[indOfIndexes]];
        indOfIndexes++;
      } else {
        value = value[field.field.name];
      }
    }
    return value;
  }

  private mapTypes(
    fieldTo: FieldOfType,
    typeFrom: TypeDefinition,
    objFrom: any,
    connections: FieldConnection[],
    typesDict: TypesDict,
    indexes: number[] = [],
  ): any {
    const resultObj: any = fieldTo.field.isArray ? [] : {};
    const typeTo = typesDict[fieldTo.typeId];
    console.log(fieldTo.field.name);
    if (fieldTo.field.isArray) {
      const fieldsFromWithArrayInPath = this.searchArrayFieldForType(typeTo, typeFrom, connections, typesDict);
      if (fieldsFromWithArrayInPath.length === 0) {
        for (const field of typeTo.fields) {
          if (field.field.isArray || !this.isBasicType(typesDict[field.field.typeOfFieldId].name)) {
            resultObj.push(this.mapTypes(field, typeFrom, objFrom, connections, typesDict, indexes));
          } else {
            const connection = connections.find(el => el.firstFieldId === field.id || el.secondFieldId === field.id);
            const fieldFrom = connection.firstFieldId === field.id ? connection.secondField : connection.firstField;
            resultObj.push(this.mapFields(typeFrom, fieldFrom, field.field, objFrom, typesDict));
          }
        }
      } else {
        const pathFields = this.getPath(fieldsFromWithArrayInPath[0], typeFrom, typesDict);
        const arrayFields = pathFields.filter(el => el.field.isArray);
        const arrayField = arrayFields[indexes.length];

        const neededPath = pathFields.slice(0, pathFields.indexOf(arrayField));
        const objectsToIterate = this.getValue(objFrom, neededPath, indexes);
        for (let i = 0; i < objectsToIterate.length; i++) {
          const ind = [...indexes];
          ind.push(i);
          for (const field of typesDict[arrayField.field.typeOfFieldId].fields) {
            if (field.field.isArray || !this.isBasicType(typesDict[field.field.typeOfFieldId].name)) {
              resultObj.push(this.mapTypes(fieldTo, typeFrom, objFrom, connections, typesDict, ind));
            } else {
              resultObj.push(this.mapFields(typeFrom, field, fieldTo.field, objFrom, typesDict));
            }
          }
        }
      }
    } else {
      for (const field of typeTo.fields) {
        if (field.field.isArray || !this.isBasicType(typesDict[field.field.typeOfFieldId].name)) {
          resultObj[field.field.name] = this.mapTypes(field, typeFrom, objFrom, connections, typesDict, indexes);
        } else {
          const connection = connections.find(el => el.firstFieldId === field.id || el.secondFieldId === field.id);
          const fieldFrom = connection.firstFieldId === field.id ? connection.secondField : connection.firstField;
          if (this.getPath(fieldFrom, typeFrom, typesDict).filter(el => el.field.isArray).length > indexes.length) {
            const ind = [...indexes];
            ind.push(0);
            resultObj[field.field.name] = this.mapTypes(field, typeFrom, objFrom, connections, typesDict, ind);
          } else {
            resultObj[field.field.name] = this.mapFields(typeFrom, fieldFrom, field.field, objFrom, typesDict);
          }
        }
      }
    }
    return resultObj;
  }

  private searchArrayFieldForType(typeTo: TypeDefinition,
                                  typeFrom: TypeDefinition,
                                  connections: FieldConnection[],
                                  typesDict: TypesDict): FieldOfType[] {
    const fieldsFrom = typeTo.fields.map(field => {
      const connection = connections.find(el => el.firstFieldId === field.id || el.secondFieldId === field.id);
      const fieldFrom = connection.firstFieldId === field.id ? connection.secondField : connection.firstField;
      return fieldFrom;
    });

    return fieldsFrom.filter(el => this.getPath(el, typeFrom, typesDict).filter(f => f.field.isArray).length !== 0);
  }

  private getPath(field: FieldOfType, type: TypeDefinition, typesDict: TypesDict): FieldOfType[] {
    const fields = [field];
    const types: TypeDefinition[] = [];

    // tslint:disable-next-line: forin
    for (const key in typesDict) {
      types.push(typesDict[key]);
    }

    let parentType = types.find(el => el.fields.includes(field));
    while (parentType.id !== type.id) {
      const parentOfParentType = types.find(el => el.fields.findIndex(f => f.field.typeOfFieldId === parentType.id) !== -1);
      fields.push(parentOfParentType.fields.find(f => f.field.typeOfFieldId === parentType.id));
      parentType = parentOfParentType;
    }

    return fields.reverse();
  }

  private mapFields(
    typeFrom: TypeDefinition,
    fieldFrom: FieldOfType,
    fieldTo: FieldDefinitionBase,
    objFrom: any,
    typesDict: TypesDict,
    indexes: number[] = [],
  ): any {
    console.log(fieldFrom.field.name + ' => ' + fieldTo.name);
    const type = typesDict[fieldTo.typeOfFieldId];
    if (this.isBasicType(type.name) && this.isBasicType(typesDict[fieldFrom.field.typeOfFieldId].name)) {
      return this.basicTypeConvertions[type.name](this.getValue(objFrom, this.getPath(fieldFrom, typeFrom, typesDict), indexes));
    }

    return undefined;
  }

  private isBasicType(type: string): boolean {
    return this.basicTypes.includes(type);
  }

  private normalizeArray<T>(array: T[], indexKey: keyof T) {
    const normalizedObject: any = {};
    for (const el of array) {
      const key = el[indexKey];
      normalizedObject[key] = el;
    }
    return normalizedObject as { [key: string]: T };
  }
}
