import { Controller, Post, Body, Header } from '@nestjs/common';
import { JsonReaderService } from '../read-data-services/json-reader/json-reader.service';
import { XmlReaderService } from '../read-data-services/xml-reader/xml-reader.service';
import { IReader } from '../read-data-services/reader';
import { DataType } from '../dto/system-base.dto';
import { ParseDataDto } from '../dto/controller-dto/parse-data.dto';

@Controller('parse-data')
export class ParseDataController {
    private readers: {[key: number]: IReader} = {};
    constructor(private readonly jsonReader: JsonReaderService,
                private readonly xmlReader: XmlReaderService) {
            this.readers[DataType.Json] = this.jsonReader;
            this.readers[DataType.Xml] = this.xmlReader;
        }

    @Post()
    @Header('content-type', 'application/json')
    parse(@Body() req: ParseDataDto) {
        if (!req.type) {
            req.type = DataType.Json;
        }
        return this.readers[req.type].read(req.data);
    }
}
