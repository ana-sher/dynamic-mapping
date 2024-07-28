import { Controller, Post, Body, Header } from '@nestjs/common';
import { TransferType } from '../dto/system-base.dto';
import { IFetcher } from '../fetch-data-services/fetcher';
import { ApiService } from '../fetch-data-services/api/api.service';
import { FtpService } from '../fetch-data-services/ftp/ftp.service';
import { FetchDataDto } from '../dto/controller-dto/fetch-data.dto';

@Controller('fetch-data')
export class FetchDataController {
  private fetchers: { [key: number]: IFetcher } = {};
  constructor(
    private readonly api: ApiService,
    private readonly ftp: FtpService,
  ) {
    this.fetchers[TransferType.FTP] = this.ftp;
    this.fetchers[TransferType.API] = this.api;
  }

  @Post()
  @Header('content-type', 'application/json')
  fetch(@Body() req: FetchDataDto) {
    if (req.type == null) {
      req.type = TransferType.API;
    }
    return this.fetchers[req.type].doRequest(req.fetchType, req.data);
  }
}
