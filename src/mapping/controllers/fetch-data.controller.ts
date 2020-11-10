import { Controller, Post, Body, Header } from '@nestjs/common';
import { TranspherType } from '../dto/system-base';
import { IFetcher } from '../fetch-data-services/fetcher';
import { ApiService } from '../fetch-data-services/api/api.service';
import { FtpService } from '../fetch-data-services/ftp/ftp.service';
import { FetchType } from '../dto/fetch-type';

@Controller('fetch-data')
export class FetchDataController {
    private fetchers: {[key: number]: IFetcher} = {};
    constructor(private readonly api: ApiService,
                private readonly ftp: FtpService) {
            this.fetchers[TranspherType.FTP] = this.ftp;
            this.fetchers[TranspherType.API] = this.api;
        }

    @Post()
    @Header('content-type', 'application/json')
    fetch(@Body() req: { fetchType: FetchType, type?: TranspherType, data: any }) {
        if (req.type == null) {
            req.type = TranspherType.API;
        }
        return this.fetchers[req.type].doRequest(req.fetchType, req.data);
    }
}
