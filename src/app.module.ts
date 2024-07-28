import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { TypeGeneratorController } from './generator/type-generator/type-generator.controller';
import { TypeGeneratorService } from './generator/type-generator/type-generator.service';
import { TypeHelperService } from './helpers/type-helper/type-helper.service';
import { MapDataService } from './mapping/map-data-services/map-data/map-data.service';
import { ConnectionsGeneratorService } from './generator/connections-generator/connections-generator.service';
import { ConnectionsGeneratorController } from './generator/connections-generator/connections-generator.controller';
import { JsonWriterService } from './mapping/write-data-services/json-writer/json-writer.service';
import { JsonReaderService } from './mapping/read-data-services/json-reader/json-reader.service';
import { XmlWriterService } from './mapping/write-data-services/xml-writer/xml-writer.service';
import { XmlReaderService } from './mapping/read-data-services/xml-reader/xml-reader.service';
import { ParseDataController } from './mapping/controllers/parse-data.controller';
import { WriteDataController } from './mapping/controllers/write-data.controller';
import { MapDataController } from './mapping/controllers/map-data.controller';
import { FetchDataController } from './mapping/controllers/fetch-data.controller';
import { ApiService } from './mapping/fetch-data-services/api/api.service';
import { FtpService } from './mapping/fetch-data-services/ftp/ftp.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule,
  ],
  controllers: [
    TypeGeneratorController,
    ConnectionsGeneratorController,
    FetchDataController,
    ParseDataController,
    WriteDataController,
    MapDataController,
  ],
  providers: [
    AppService,
    TypeGeneratorService,
    TypeHelperService,
    MapDataService,
    ConnectionsGeneratorService,
    JsonWriterService,
    JsonReaderService,
    XmlWriterService,
    XmlReaderService,
    ApiService,
    FtpService,
  ],
})
export class AppModule {}
