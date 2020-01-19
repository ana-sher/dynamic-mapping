import { Injectable } from '@nestjs/common';
import { IWriter } from '../writer';
import { xml2json, json2xml } from 'xml-js';

@Injectable()
export class XmlWriterService implements IWriter {

    public write(data: any) {
        return json2xml(data, { compact: true });
    }
}
