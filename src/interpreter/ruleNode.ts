import { IScriptElement } from "../script";
import SymmetryHelper from "../utils/symmtryHelper";
import Grid from "./grid";
import Node from "./node";
import Rule from "./rule";

export default abstract class RuleNode extends Node {
    public rules: Rule[];
    public counter: number;
    public steps: number;
    public last: boolean[];
    protected matches: [number, number, number, number][];
    protected matchCount: number;
    protected lastMatchedTurn: number;
    protected matchMask: boolean[][];

    protected override Load(selem: IScriptElement, parentSymmetry: boolean[], grid: Grid): boolean {
        const symmetrystring = selem.Get<string>("symmetry", null);
        const symmetry: boolean[] = SymmetryHelper.GetSymmetry(grid.MZ == 1, symmetrystring, parentSymmetry);
        if (symmetry == null) {
            console.log("unknown symmetry");
            return false;
        }

        const ruleList = new Array<Rule>();
        const srules: IScriptElement[] = selem.Elements(["rule"]);
        const ruleElements: IScriptElement[] = srules.length > 0 ? srules : [selem];
        for (const ruleElement of ruleElements) {
            const rule = Rule.Load(ruleElement, grid, grid);
            if (rule == null) {
                return false;
            }
            rule.original = true;
            const ruleSymmetryString = ruleElement.Get<string>("symmetry", null);
            const ruleSymmetry = SymmetryHelper.GetSymmetry(grid.MZ == 1, ruleSymmetryString, symmetry);
            if (ruleSymmetry == null) {
                return false;
            }
            for (const r of rule.Symmetries(ruleSymmetry, grid.MZ == 1)) {
                ruleList.push(r);
            }
        }
        this.rules = Array.from(ruleList);
        this.last = new Array<boolean>(this.rules.length);
        this.steps = selem.Get<number>("steps", 0);
        return true;
    }

    public override Reset(): void {
        this.lastMatchedTurn = -1;
        this.counter = 0;
        for (let r = 0; r < this.last.length; r++) {
            this.last[r] = false;
        }
    }

    protected Add(r: number, x: number, y: number, z: number, maskr: boolean[]): void {
        maskr[x + y * this.grid.MX + z * this.grid.MX * this.grid.MY] = true;
        const match: [number, number, number, number] = [r, x, y, z];
        if (this.matchCount < this.matches.length) {
            this.matches[this.matchCount] = match;
        } else {
            this.matches.push(match);
        }
        this.matchCount++;
    }

    public override Go(): boolean {
        for (let r = 0; r < this.last.length; r++) {
            this.last[r] = false;
        }
        if (this.steps > 0 && this.counter > this.steps) {
            return false;
        }
        const MX = this.grid.MX;
        const MY = this.grid.MY;
        const MZ = this.grid.MZ;
        if (this.lastMatchedTurn > 0) {
            for (let n = this.ip.first[this.lastMatchedTurn]; n < this.ip.changes.length; n++) {
                const [x, y, z] = this.ip.changes[n];
                const value = this.grid.state[x + y * MX + z * MX * MY];
                for (let r = 0; r < this.rules.length; r++) {
                    const rule: Rule = this.rules[r];
                    const maskr: boolean[] = this.matchMask[r];
                    const shifts: [number, number, number][] = rule.ishifts[value];
                    for (let l = 0; l < shifts.length; l++) {
                        const [shiftx, shifty, shiftz] = shifts[l];
                        const sx = x - shiftx;
                        const sy = y - shifty;
                        const sz = z - shiftz;
                        if (sx < 0 || sy < 0 || sz < 0 ||
                            sx + rule.IMX > MX || sy + rule.IMY > MY || sz + rule.IMZ > MZ) {
                            continue;
                        }
                        // const si = sx + sy * MX + sz * MX * MY;
                        if (!maskr[r] && this.grid.Matches(rule, sx, sy, sz)) {
                            this.Add(r, sx, sy, sz, maskr);
                        }
                    }
                }
            }
        } else {
            this.matchCount = 0;
            for (let r = 0; r < this.rules.length; r++) {
                const rule: Rule = this.rules[r];
                const maskr: boolean[] = this.matchMask ? this.matchMask[r] : null;
                for (let z = rule.IMZ - 1; z < MZ; z += rule.IMZ) {
                    for (let y = rule.IMY - 1; y < MY; y += rule.IMY) {
                        for (let x = rule.IMX - 1; x < MX; x += rule.IMX) {
                            const shifts = rule.ishifts[this.grid.state[x + y * MX + z * MX * MY]];
                            for (let l = 0; l < shifts.length; l++) {
                                const [shiftx, shifty, shiftz] = shifts[l];
                                const sx = x - shiftx;
                                const sy = y - shifty;
                                const sz = z - shiftz;
                                if (sx < 0 || sy < 0 || sz < 0 ||
                                    sx + rule.IMX > MX || sy + rule.IMY > MY || sz + rule.IMZ > MZ) {
                                    continue;
                                }
                                // const si = sx + sy * MX + sz * MX * MY;
                                if (!maskr[r] && this.grid.Matches(rule, sx, sy, sz)) {
                                    this.Add(r, sx, sy, sz, maskr);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}