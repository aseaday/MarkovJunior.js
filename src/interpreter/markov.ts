import Interpreter from ".";
import Node from "./node";
import Branch from "./branch";

export default class MarkovNode extends Branch {
    constructor(child?: Node, ip?: Interpreter) {
        super()
        if (child && ip) {
            this.nodes = [child];
            this.ip = ip;
            this.grid = ip.grid;
        }
    }
    public override Go(): boolean {
        this.n = 0;
        return super.Go()
    }
}