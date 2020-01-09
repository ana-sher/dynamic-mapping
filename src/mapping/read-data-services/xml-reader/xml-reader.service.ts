import { Injectable } from '@nestjs/common';
import { IReader } from '../reader';
import { xml2json } from 'xml-js';

@Injectable()
export class XmlReaderService implements IReader {

    public read(data: any) {
        return xml2json(data, { compact: true });
    }
}
