import { FetchType } from '../dto/fetch-type.dto';
import { Observable } from 'rxjs';

export interface IFetcher {
    doRequest: (fetchType: FetchType, fethData?: any) => Observable<any>;
}
