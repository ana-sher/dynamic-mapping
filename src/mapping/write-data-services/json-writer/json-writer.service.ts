import { Injectable } from '@nestjs/common';
import { IWriter } from '../writer';

@Injectable()
export class JsonWriterService implements IWriter {

    public write(data: any) {
        if (typeof data === 'string') {
            return JSON.parse(data);
        }
        return data;
    }
}
