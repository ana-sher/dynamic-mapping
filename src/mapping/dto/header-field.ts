import { FetchType } from './fetch-type';

export class HeaderField {
    id: string;
    fetchTypeId: string;
    fetchType: FetchType;
    name: string;
    value: string;
    valueFetchPath: string;
}
