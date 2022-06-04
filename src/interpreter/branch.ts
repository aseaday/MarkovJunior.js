import SymmetryHelper from "../utils/symmtryHelper";
import Node from "./node";
import { IScriptElement } from "../script";
import Grid from "./grid";
export default abstract class Branch extends Node {
    public parent: Branch;
    public nodes: Node[];
    public n: number;

    public isBranched = true;
    protected override Load(selm: IScriptElement, parentSymmetry: boolean[], grid: Grid): boolean {
        const symmetryString = selm.Get<string>("symmetry", null);
        const symmetry = SymmetryHelper.GetSymmetry(this.ip.grid.MZ == 1, symmetryString, parentSymmetry);
        if (symmetry == null) {
            return false;
        }
        const schildren: IScriptElement[] = selm.Elements(Branch.nodeNames);
        this.nodes = new Array<Node>();
        for (let i = 0; i < this.nodes.length; i++) {
            const child = Node.Factory(schildren[i], symmetry, this.ip, grid);
            if (child == null) {
                return false;
            }
            if ((child as Branch).isBranched) {
                const branch = child as Branch;
                branch.parent = this;
            }
            this.nodes[i] = child;
        }
        return true;
    }
    public override Go(): boolean {
        for (; this.n < this.nodes.length; this.n++) {
            const node = this.nodes[this.n];
            if ((node as Branch).isBranched) {
                this.ip.current = node as Branch;
            }
            if (node.Go()) {
                return true;
            }
        }
        this.ip.current = this.ip.current.parent;
        this.Reset();
        return false;
    }
    public override Reset(): void {
        this.nodes.forEach(node => {
            node.Reset();
        });
        this.n = 0;
    }
}