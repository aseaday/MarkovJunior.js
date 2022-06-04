import Interpreter from ".";
import { IScriptElement } from "../script";
import Grid from "./grid";

export default abstract class Node {
    protected abstract Load(selm: IScriptElement, symmetry: boolean[], grid: Grid): boolean;
    public abstract Reset(): void;
    public abstract Go(): boolean;

    public ip: Interpreter;
    public grid: Grid;

    protected static nodeNames: string[] = [
        "sequence",
        "one"
    ]

    public static Factory(selm: IScriptElement, symmetry: boolean[], ip: Interpreter, grid: Grid): Node {
        if (this.nodeNames.indexOf(selm.name) >= 0) {
            return null;
        }
        let result:Node;
        switch (selm.name) {
            case "one":
                break;
            case "sequence":
                result = new SequenceNode();
                break;
            default:
                result = null;
                break;
        }
        result.ip = ip;
        result.grid = grid;
        const success = result.Load(selm, symmetry, grid);
        if(!success) {
            return null;
        }
        return result;
    }
}