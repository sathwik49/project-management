import bcrypt from "bcrypt"

export const hashValue = async (value:string ,saltNumber:number = 10) => {
    const hashedValue = await bcrypt.hash(value,saltNumber);
    return hashedValue;
}

export const compareValues = async (value:string,hashedValue:string) => {
    const isMatching = await bcrypt.compare(value,hashedValue);
    return isMatching;
}