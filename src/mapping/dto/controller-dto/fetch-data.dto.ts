import { FetchType } from '../fetch-type.dto';
import { DataType, TransferType } from '../system-base.dto';

export class FetchDataDto {
  fetchType: FetchType;
  type?: TransferType; 
  data: any;
}
