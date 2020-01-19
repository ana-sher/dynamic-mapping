import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeHelperService {
    public readonly basicTypes: string[];
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

    public isBasicType(type: string): boolean {
        return this.basicTypes.includes(type);
    }

    public convertValue(type: string, value: any) {
        return this.basicTypeConvertions[type](value);
    }

    public arrayToDictionary<T>(array: T[], indexKey: keyof T) {
        const normalizedObject: any = {};
        for (const el of array) {
            const key = el[indexKey];
            normalizedObject[key] = el;
        }
        return normalizedObject as { [key: string]: T };
    }
}
