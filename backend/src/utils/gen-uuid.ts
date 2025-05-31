import { v4 as uuid } from "uuid"

export const genUUid = () => {
    const uuidValue = uuid().toString().substring(0,7);
    return uuidValue;
}