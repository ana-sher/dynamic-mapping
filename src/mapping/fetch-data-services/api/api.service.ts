import { Injectable, HttpService } from '@nestjs/common';
import { FetchType, Action } from '../../dto/fetch-type';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { Observable } from 'rxjs';
import { FetchSimpleField } from '../../dto/header-field';
import { map } from 'rxjs/operators';
import { IFetcher } from '../fetcher';

@Injectable()
export class ApiService implements IFetcher {
    private readonly actionsDictionary: {
        [key: string]: (config: AxiosRequestConfig) => Observable<AxiosResponse<any>>,
    } = {
            [Action.Get]: (config) => this.get(config),
            [Action.GetByIdentifier]: (config) => this.get(config),
            [Action.Create]: (config) => this.post(config),
            [Action.Update]: (config) => this.put(config),
            [Action.Remove]: (config) => this.delete(config),
        };

    constructor(private readonly httpService: HttpService) { }

    public doRequest(fetchType: FetchType, fethData: any = {}): Observable<any> {
        return this.actionsDictionary[fetchType.action]
            (this.getConfig(fetchType.path, fetchType.queryParams, fetchType.headerParams, fethData))
            .pipe(map(el => el.data));
    }

    private get(reqConfig: AxiosRequestConfig): Observable<AxiosResponse<any>> {
        return this.httpService.get(reqConfig.url, reqConfig);
    }

    private post(reqConfig: AxiosRequestConfig): Observable<AxiosResponse<any>> {
        return this.httpService.post(reqConfig.url, reqConfig.data, reqConfig);
    }

    private put(reqConfig: AxiosRequestConfig): Observable<AxiosResponse<any>> {
        return this.httpService.put(reqConfig.url, reqConfig.data, reqConfig);
    }

    private delete(reqConfig: AxiosRequestConfig): Observable<AxiosResponse<any>> {
        return this.httpService.delete(reqConfig.url, reqConfig);
    }

    private getConfig(path: string, queryParams: FetchSimpleField[], headers: FetchSimpleField[], body: any): AxiosRequestConfig {
        return {
            url: path,
            headers: headers.reduce((prev, curr, i) => {
                prev[curr.name] = curr.value;
                return prev;
            }, {}),
            params: queryParams.reduce((prev, curr, i) => {
                prev[curr.name] = curr.value;
                return prev;
            }, {}),
            data: body,
        };
    }
}
