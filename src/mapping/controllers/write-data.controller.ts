import { Controller, Post, Body } from '@nestjs/common';
import { IWriter } from '../write-data-services/writer';
import { DataType } from '../dto/system-base.dto';
import { JsonWriterService } from '../write-data-services/json-writer/json-writer.service';
import { XmlWriterService } from '../write-data-services/xml-writer/xml-writer.service';
import { WriteDataDto } from '../dto/controller-dto/write-data.dto';

@Controller('write-data')
export class WriteDataController {
    private writers: {[key: number]: IWriter} = {};
    constructor(private readonly jsonWriter: JsonWriterService,
                private readonly xmlWriter: XmlWriterService) {
            this.writers[DataType.Json] = this.jsonWriter;
            this.writers[DataType.Xml] = this.xmlWriter;
        }

    @Post()
    write(@Body() req: WriteDataDto) {
        if (!req.type) {
            req.type = DataType.Json;
        }
        return this.writers[req.type].write(req.data);
    }
}
