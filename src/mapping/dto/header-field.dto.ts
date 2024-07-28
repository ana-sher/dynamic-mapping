import { FetchType } from './fetch-type.dto';

export class FetchSimpleField {
    id: string;
    fetchTypeId: string;
    fetchType: FetchType;
    name: string;
    value: string;
    valueFetchPath: string;
}
