
// The interface will be used to define the interface of ScriptableObject for support different vendor such as:
// - JSON
// - YAML

export interface IScript {
    get<T>(fieldName:string, defaultValue:T):T;
}