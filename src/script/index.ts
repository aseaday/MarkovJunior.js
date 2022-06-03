interface IScript {
    get<T>(fieldName:string, defaultValue:T):T;
}