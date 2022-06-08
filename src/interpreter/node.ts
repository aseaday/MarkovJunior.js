import Interpreter from ".";
import { IScriptElement } from "../script";
import Grid from "./grid";

export default abstract class Node {
    public abstract Load(selm: IScriptElement, symmetry: boolean[], grid: Grid): boolean;
    public abstract Reset(): void;
    public abstract Go(): boolean;

    public ip: Interpreter;
    public grid: Grid;

    public static nodeNames: string[] = [
        "sequence",
        "one"
    ]
}