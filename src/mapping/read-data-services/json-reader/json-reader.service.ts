import { Injectable } from '@nestjs/common';
import { IReader } from '../reader';

@Injectable()
export class JsonReaderService implements IReader {

    public read(data: any) {
        if (typeof data === 'string') {
            return JSON.parse(data);
        }
        return data;
    }
}
