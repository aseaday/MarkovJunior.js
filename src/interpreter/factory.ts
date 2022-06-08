import Interpreter from ".";
import { IScriptElement } from "../script";
import Branch, {SequenceNode} from "./branch";
import Grid from "./grid";
import Node from "./node";
import OneNode from "./oneNode";
export default function Factory(selm: IScriptElement, symmetry: boolean[], ip: Interpreter, grid: Grid): Node {
    if (Node.nodeNames.indexOf(selm.name) < 0) {
        return null;
    }
    let result:Node;
    switch (selm.name) {
        case "one":
            result = new OneNode();
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