import { Injectable } from '@nestjs/common';
import { FieldConnection } from './../../dto/field-connection';
import { FieldOfType } from './../../dto/field-of-type';
import { TypeDefinition } from './../../dto/type-definition';
import { TypesDict } from './../../dto/types-dict';
import { FieldDefinitionBase } from './../../dto/field-definition';
import { TypeHelperService } from './../../../helpers/type-helper/type-helper.service';

@Injectable()
export class MapDataService {
  constructor(private readonly typeHelper: TypeHelperService) { }

  public map(fromObj: any, connections: FieldConnection[], fromTypeId: number, toTypeId: number, neededTypes: TypeDefinition[]): object {
    const typesDict: TypesDict = this.typeHelper.arrayToDictionary(
      neededTypes,
      'id',
    );
    return this.createTargetObject(fromObj, typesDict[fromTypeId], typesDict[toTypeId], connections, typesDict);
  }

  private createTargetObject(sourceObj: any, typeFrom: TypeDefinition, targetType: TypeDefinition,
                             connections: FieldConnection[], typesDict: TypesDict): any {
    let targetObj: any = {};
    const neededFields: Array<{ from: FieldOfType, to: FieldOfType, pathFrom: FieldOfType[] }> = [];

    // searching for fields, that are connected to root with arrays from source
    for (const fieldTo of targetType.fields) {
      const connection = this.findConnection(connections, fieldTo);;
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
      // TODO: implement creating multiple objects in case of connections in root with arrays from source

      const neededField = neededFields.sort((a, b) => a.pathFrom.length - b.pathFrom.length)[0];
      const arrays = neededField.pathFrom.filter(el => el.field.isArray);
      const arrayType = arrays[arrays.length - 1].typeId;
      for (const fields of neededFields) {
        const fieldArrays = fields.pathFrom.filter(el => el.field.isArray);
        if (fieldArrays[fieldArrays.length - 1].typeId !== arrayType
          && neededField.pathFrom.findIndex(el => el.typeId === fieldArrays[fieldArrays.length - 1].typeId) === -1) {
          throw new Error('Cannot identify type');
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

    // basic processing for most cases to return single object
    for (const field of targetType.fields) {
      if (field.field.isArray || !this.typeHelper.isBasicType(typesDict[field.field.typeOfFieldId].name)) {
        targetObj[field.field.name] = this.mapTypes(field, typeFrom, sourceObj, connections, typesDict);
      } else {
        const connection = this.findConnection(connections, field);
        if (!connection) {
          if (field.field.defaultValue) {
            targetObj[field.field.name] = field.field.defaultValue;
          }
          continue;
        }
        const fieldFrom = connection.firstFieldId === field.id ? connection.secondField : connection.firstField;
        targetObj[field.field.name] = this.mapFields(typeFrom, fieldFrom, field.field, sourceObj, typesDict);
        if ((targetObj[field.field.name] === undefined || targetObj[field.field.name] === null) && field.field.defaultValue) {
          targetObj[field.field.name] = field.field.defaultValue;
        }
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

    // if target field is array
    if (fieldTo.field.isArray) {
      const fieldsFromWithArrayInPath = this.searchArrayFieldForType(typeTo, typeFrom, connections, typesDict);

      if (fieldsFromWithArrayInPath.length === 0) {
        // if source field path doesn't contain arrays then we add only one object

        const innerObj: any = {};
        for (const field of typeTo.fields) {
          if (field.field.isArray || !this.typeHelper.isBasicType(typesDict[field.field.typeOfFieldId].name)) {
            innerObj[field.field.name] = this.mapTypes(field, typeFrom, objFrom, connections, typesDict, indexes);
          } else {
            const connection = this.findConnection(connections, field);
            if (!connection) {
              if (field.field.defaultValue) {
                innerObj[field.field.name] = field.field.defaultValue;
              }
              continue;
            }
            const fieldFrom = connection.firstFieldId === field.id ? connection.secondField : connection.firstField;
            innerObj[field.field.name] = this.mapFields(typeFrom, fieldFrom, field.field, objFrom, typesDict);
            if ((innerObj[field.field.name] === undefined || innerObj[field.field.name] === null) && field.field.defaultValue) {
              innerObj[field.field.name] = field.field.defaultValue;
            }
          }
        }
        resultObj.push(innerObj);
      } else {
        // if source field path contains arrays we should iterate through all of this objects and add all the most inners
        // (they could have some field connections with upper, so we should pass indexes to paths)

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
              const connectionInner = this.findConnection(connections, field);
              if (!connectionInner) {
                if (field.field.defaultValue) {
                  innerObj[field.field.name] = field.field.defaultValue;
                }
                continue;
              }
              const fieldFromInner = connectionInner.firstFieldId === field.id ? connectionInner.secondField : connectionInner.firstField;
              innerObj[field.field.name] = this.mapFields(typeFrom, fieldFromInner, field.field, objFrom, typesDict, ind);
              if ((innerObj[field.field.name] === undefined || innerObj[field.field.name] === null) && field.field.defaultValue) {
                innerObj[field.field.name] = field.field.defaultValue;
              }
            }
          }
          resultObj.push(innerObj);
        }
      }
    } else {
      // if target field is not array

      for (const field of typeTo.fields) {
        if (field.field.isArray || !this.typeHelper.isBasicType(typesDict[field.field.typeOfFieldId].name)) {
          resultObj[field.field.name] = this.mapTypes(field, typeFrom, objFrom, connections, typesDict, indexes);
        } else {
          const connection = this.findConnection(connections, field);
          if (!connection) {
            if (field.field.defaultValue) {
              resultObj[field.field.name] = field.field.defaultValue;
            }
            continue;
          }
          const fieldFrom = connection.firstFieldId === field.id ? connection.secondField : connection.firstField;
          if (this.getPath(fieldFrom, typeFrom, typesDict).filter(el => el.field.isArray).length > indexes.length) {
            const ind = [...indexes];

            // filtering function in case of source field is array
            const neededFunction = connection.firstFieldId === fieldFrom.id ? connection.firstFieldFilterFunction : connection.secondFieldFilterFunction;
            if(neededFunction) {
              const objectsToIterate = this.getValue(objFrom, this.getPath(fieldFrom, typeFrom, typesDict), indexes);
              const neededObject = new Function('array', neededFunction)(objectsToIterate);
              ind.push(objectsToIterate.indexOf(neededObject));
            } else {
              ind.push(0);
            }

            resultObj[field.field.name] = this.mapTypes(field, typeFrom, objFrom, connections, typesDict, ind);
          } else {
            resultObj[field.field.name] = this.mapFields(typeFrom, fieldFrom, field.field, objFrom, typesDict);
            if ((resultObj[field.field.name] === undefined || resultObj[field.field.name] === null) && field.field.defaultValue) {
              resultObj[field.field.name] = field.field.defaultValue;
            }
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
      const connection = this.findConnection(connections, field);
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

    let parentType = types.find(el => el.id === field.typeId);
    while (parentType.id !== type.id) {
      const parentOfParentType = types.filter(el => el.fields).find(el => el.fields.findIndex(f => f.field.typeOfFieldId === parentType.id) !== -1);
      fields.push(parentOfParentType.fields.find(f => f.field.typeOfFieldId === parentType.id));
      parentType = parentOfParentType;
    }

    return fields.reverse();
  }

  private findConnection(connections: FieldConnection[], field: FieldOfType) {
    return connections.find(el => el.firstFieldId === field.id || el.secondFieldId === field.id);
  }

  private mapFields(
    typeFrom: TypeDefinition,
    fieldFrom: FieldOfType,
    fieldTo: FieldDefinitionBase,
    objFrom: any,
    typesDict: TypesDict,
    indexes: number[] = [],
  ): any {
    const type = typesDict[fieldTo.typeOfFieldId];
    if (this.typeHelper.isBasicType(type.name) && this.typeHelper.isBasicType(typesDict[fieldFrom.field.typeOfFieldId].name)) {
      return this.typeHelper.convertValue(type.name, this.getValue(objFrom, this.getPath(fieldFrom, typeFrom, typesDict), indexes));
    }

    return undefined;
  }
}
