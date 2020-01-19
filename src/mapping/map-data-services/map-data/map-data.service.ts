import { Injectable } from '@nestjs/common';
import { FieldConnection } from './../../dto/field-connection';
import { FieldOfType } from './../../dto/field-of-type';
import { TypeDefinition } from './../../dto/type-definition';
import { TypesDict } from './../../dto/types-dict';
import { FieldDefinitionBase } from './../../dto/field-definition';
import { TypeHelperService } from './../../../helpers/type-helper/type-helper.service';

@Injectable()
export class MapDataService {
  constructor(private readonly typeHelper: TypeHelperService) {}

  public map(fromObj: any, connections: FieldConnection[], fromTypeId: number, toTypeId: number, neededTypes: TypeDefinition[]): object {
    const typesDict: TypesDict = this.typeHelper.arrayToDictionary(
      neededTypes,
      'id',
    );

    const obj = this.createTargetObject(fromObj, typesDict[fromTypeId], typesDict[toTypeId], connections, typesDict);

    return obj;
  }

  private createTargetObject(sourceObj: any, typeFrom: TypeDefinition, targetType: TypeDefinition,
    connections: FieldConnection[], typesDict: TypesDict): any {
    let targetObj: any = {};
    let neededFields: Array<{ from: FieldOfType, to: FieldOfType, pathFrom: FieldOfType[] }> = [];
    for (const fieldTo of targetType.fields) {
      const connection = connections.find(el => el.firstFieldId === fieldTo.id || el.secondFieldId === fieldTo.id);
      if (!connection) {
        continue;
      }

      const fieldFrom = connection.firstFieldId === fieldTo.id ? connection.secondField : connection.firstField;
      const pathFrom = this.getPath(fieldFrom, typeFrom, typesDict);
      const fromWithArray = pathFrom.findIndex(el => el.field.isArray) !== -1;
      const toWithArray = this.getPath(fieldTo, targetType, typesDict).findIndex(el => el.field.isArray) !== -1;
      if (fromWithArray && !toWithArray) {
        neededFields.push({ from: fieldFrom, to: fieldTo, pathFrom });
      }
    }
    if (neededFields.length > 0) {
      const neededField = neededFields.sort((a, b) => a.pathFrom.length - b.pathFrom.length)[0];
      const arrays = neededField.pathFrom.filter(el => el.field.isArray);
      let arrayType = arrays[arrays.length - 1].typeId;
      for (const fields of neededFields) {
        const fieldArrays = fields.pathFrom.filter(el => el.field.isArray);
        if (fieldArrays[fieldArrays.length - 1].typeId !== arrayType
          && neededField.pathFrom.findIndex(el => el.typeId === fieldArrays[fieldArrays.length - 1].typeId) === -1) {
          throw 'Cannot identify type';
        }
      }

      targetObj = [];
      const chains = [];
      const countsOfCounts = [[[]]];
      for (let i = 0; i < arrays.length; i++) {
        for (let j = 0; (i === 0 && j === 0) || (countsOfCounts[i - 1] && j < countsOfCounts[i - 1].length); j++) {
          for (let k = 0; (i === 0 && j === 0 && k === 0) || (countsOfCounts[i - 1] &&
            countsOfCounts[i - 1][j] && k < countsOfCounts[i - 1][j].length); k++) {
            const arrayField = arrays[i];
            const neededPath = this.getPath(arrayField, typeFrom, typesDict);
            countsOfCounts[i][j][k] = this.getValue(sourceObj, neededPath, [j, k]).length;
          }
        }
      }
    }
    for (const field of targetType.fields) {
      if (field.field.isArray || !this.typeHelper.isBasicType(typesDict[field.field.typeOfFieldId].name)) {
        targetObj[field.field.name] = this.mapTypes(field, typeFrom, sourceObj, connections, typesDict);
      } else {
        const connection = connections.find(el => el.firstFieldId === field.id || el.secondFieldId === field.id);
        const fieldFrom = connection.firstFieldId === field.id ? connection.secondField : connection.firstField;
        targetObj[field.field.name] = this.mapFields(typeFrom, fieldFrom, field.field, sourceObj, typesDict);
      }
    }

    return targetObj;
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
    const typeTo = typesDict[fieldTo.field.typeOfFieldId];
    if (fieldTo.field.isArray) {
      const fieldsFromWithArrayInPath = this.searchArrayFieldForType(typeTo, typeFrom, connections, typesDict);
      if (fieldsFromWithArrayInPath.length === 0) {
        const innerObj: any = {};
        for (const field of typeTo.fields) {
          if (field.field.isArray || !this.typeHelper.isBasicType(typesDict[field.field.typeOfFieldId].name)) {
            innerObj[field.field.name] = this.mapTypes(field, typeFrom, objFrom, connections, typesDict, indexes);
          } else {
            const connection = connections.find(el => el.firstFieldId === field.id || el.secondFieldId === field.id);
            const fieldFrom = connection.firstFieldId === field.id ? connection.secondField : connection.firstField;
            innerObj[field.field.name] = this.mapFields(typeFrom, fieldFrom, field.field, objFrom, typesDict);
          }
        }
        resultObj.push(innerObj);
      } else {
        const pathFields = this.getPath(fieldsFromWithArrayInPath[0], typeFrom, typesDict);
        const arrayFields = pathFields.filter(el => el.field.isArray);
        const arrayField = arrayFields[indexes.length];

        const neededPath = pathFields.slice(0, pathFields.indexOf(arrayField) + 1);
        const objectsToIterate = this.getValue(objFrom, neededPath, indexes);
        for (let i = 0; i < objectsToIterate.length; i++) {
          const ind = [...indexes];
          ind.push(i);
          const innerObj: any = {};
          for (const field of typesDict[fieldTo.field.typeOfFieldId].fields) {
            if (field.field.isArray || !this.typeHelper.isBasicType(typesDict[field.field.typeOfFieldId].name)) {
              innerObj[field.field.name] = this.mapTypes(fieldTo, typeFrom, objFrom, connections, typesDict, ind);
            } else {
              const connectionInner = connections.find(el => el.firstFieldId === field.id || el.secondFieldId === field.id);
              const fieldFromInner = connectionInner.firstFieldId === field.id ? connectionInner.secondField : connectionInner.firstField;
              innerObj[field.field.name] = this.mapFields(typeFrom, fieldFromInner, field.field, objFrom, typesDict, ind);
            }
          }
          resultObj.push(innerObj);
        }
      }
    } else {
      for (const field of typeTo.fields) {
        if (field.field.isArray || !this.typeHelper.isBasicType(typesDict[field.field.typeOfFieldId].name)) {
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
      if (!connection) {
        return;
      }
      const fieldFrom = connection.firstFieldId === field.id ? connection.secondField : connection.firstField;
      return fieldFrom;
    });

    return fieldsFrom.filter(el => el && this.getPath(el, typeFrom, typesDict).filter(f => f.field.isArray).length !== 0);
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
    if (this.typeHelper.isBasicType(type.name) && this.typeHelper.isBasicType(typesDict[fieldFrom.field.typeOfFieldId].name)) {
      return this.typeHelper.convertValue(type.name, this.getValue(objFrom, this.getPath(fieldFrom, typeFrom, typesDict), indexes));
    }

    return undefined;
  }
}
