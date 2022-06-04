
// The interface will be used to define the interface of ScriptableObject for support different vendor such as:
// - JSON
// - YAML

export interface IScriptElement {
    name: string;
    Elements(): IScriptElement[];
    Elements(filterTags: string[]): IScriptElement[];
    MyDescendants(tags: string[]): Generator<IScriptElement, void, void>;
    Get<T>(fieldName:string, defaultValue:T):T;
}