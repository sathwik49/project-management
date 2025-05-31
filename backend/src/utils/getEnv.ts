
export const getEnv = (key:string,defaultValue:string = "") => {
    const value = process.env[key];

    if(value === undefined){
        if(defaultValue){
            return defaultValue
        }
        throw new Error(`Env value for key ${key} is not available`)
    }
    return value;
}