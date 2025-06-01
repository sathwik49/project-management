import { v4 as uuid } from "uuid"

export const genUUid = (length:number = 7) => {
    const uuidValue = uuid().replace(/-/g, "").substring(0,length);
    return uuidValue;
}