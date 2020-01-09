import { Injectable } from '@nestjs/common';
import { IFetcher } from '../fetcher';
import { FetchType, Action } from 'src/mapping/dto/fetch-type';
import { Observable, from } from 'rxjs';
import { Client, AccessOptions } from 'basic-ftp';
import { HeaderField } from 'src/mapping/dto/header-field';
import { Writable, Transform, Readable } from 'stream';

@Injectable()
export class FtpService implements IFetcher {
    private readonly actionsDictionary: {
        [key: string]: (client: Client, name: string, directory?: string, data?: any) => Promise<any>,
    } = {
            [Action.Get]: this.get,
            [Action.GetByIdentifier]: this.getByName,
            [Action.Create]: this.uploadFile,
            [Action.Update]: this.updateFile,
            [Action.Remove]: this.removeFile,
        };

    public doRequest(fetchType: FetchType, fethData: any = {}): Observable<any> {
        return from(this.processRequest(fetchType, fethData));
    }

    private async processRequest(fetchType: FetchType, fethData: any = {}): Promise<any> {
        const client = await this.connect(fetchType.headerParams);
        const name = fetchType.queryParams.find(el => el.field.name === 'name').value;
        await this.actionsDictionary[fetchType.action](client, name, fetchType.path, fethData);
        client.close();
    }

    private async get(client: Client, name: string, directory?: string, data?: any): Promise<string[]> {
        if (directory) {
            await client.cd(directory);
        }
        const files = await client.list();
        const fileContents = [];
        for (const file of files) {
            if (file.isFile) {
                fileContents.push(await this.getFile(client, file.name));
            }
        }
        return fileContents;
    }

    private async getByName(client: Client, name: string, directory?: string, data?: any): Promise<string> {
        if (directory) {
            await client.cd(directory);
        }
        return this.getFile(client, name);
    }

    private async removeFile(client: Client, name: string, directory?: string, data?: any): Promise<any> {
        if (directory) {
            await client.cd(directory);
        }
        return client.remove(name);
    }

    private async uploadFile(client: Client, name: string, directory?: string, data?: any): Promise<any> {
        const fileStream = new Readable();
        fileStream.push(data);
        fileStream.push(null);
        let path = directory || '';
        path += name;
        return client.uploadFrom(name, path);
    }

    private async updateFile(client: Client, name: string, directory?: string, data?: any): Promise<any> {
        await this.removeFile(client, name, directory, data);
        directory = '';
        return this.uploadFile(client, name, directory, data);
    }

    private async getFile(client: Client, name: string): Promise<string> {
        const inoutStream = new Transform({
            transform(chunk, encoding, callback) {
                this.push(chunk);
                callback();
            },
        });
        await client.downloadTo(inoutStream, name);
        return this.readStream(inoutStream);
    }

    private readStream(stream: Readable): Promise<string> {
        let str = '';
        return new Promise((resolve, reject) => {
            stream.on('data', (data) => {
                str += data.toString();
            });
            stream.on('end', () => {
                resolve(str);
            });
            stream.on('error', (err) => {
                reject(err);
            });
        });
    }

    private async connect(headers: HeaderField[]): Promise<Client> {
        const client = new Client();
        await client.access(this.getOptions(headers));
        return client;
    }

    private getOptions(headers: HeaderField[]): AccessOptions {

        return headers.reduce((prev, curr, i) => {
            prev[curr.name] = curr.value;
            if (curr.name === 'port') {
                prev[curr.name] = parseInt(curr.value);
            }
            return prev;
        }, {});
    }
}
