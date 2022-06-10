import { IScriptElement } from "../script";
import RuleNode from "./ruleNode";
import Grid from "./grid";
import ArrayHelper from "../utils/arrayHelper";
import Rule from "./rule";
import Random from "../utils/random";

export default class OneNode extends RuleNode {
    public override Load(selem: IScriptElement, parentSymmetry: boolean[], grid: Grid): boolean {
        if (!super.Load(selem, parentSymmetry, grid)) {
            return false;
        }
        this.matches = new Array<[number, number, number, number]>();
        this.matchMask = ArrayHelper.Array2D<boolean>(this.rules.length, grid.state.length, false)
        return true;
    }

    public override Reset(): void {
        super.Reset();
        if (this.matchCount !== 0) {
            for (let x = 0; x < this.matchMask.length; x++) {
                this.matchMask[x].fill(false);
            }
            this.matchCount = 0;
        }
    }
    public Apply(rule: Rule, x: number, y: number, z: number) {
        const MX = this.grid.MX;
        const MY = this.grid.MY
        const changes = this.ip.changes;
        for (let dz = 0; dz < rule.OMZ; dz++) {
            for (let dy = 0; dy < rule.OMY; dy++) {
                for (let dx = 0; dx < rule.OMX; dx++) {
                    const newValue = rule.output[dx + dy * rule.OMX + dz * rule.OMX * rule.OMY];
                    if (newValue !== 0xff) {
                        const sx = x + dx;
                        const sy = y + dy;
                        const sz = z + dz;
                        const si = sx + sy * MX + sz * MX * MY;
                        const oldValue = this.grid.state[si];
                        if (newValue !== oldValue) {
                            this.grid.state[si] = newValue;
                            changes.push([sx, sy, sz]);
                        }
                    }
                }
            }
        }
    }
    public override Go(): boolean {
        if (!super.Go()) {
            return false;
        }
        const lastMatchedTurn = this.ip.counter;
        const [R, X, Y, Z] = this.RandomMatch(this.ip.random);
        if (R < 0) return false;
        else {
            this.last[R] = true;
            this.Apply(this.rules[R], X, Y, Z);
            this.counter++;
            return true;
        }
    }
    public RandomMatch(random: Random) {
        while (this.matchCount > 0) {
            const matchIndex = random.Next(this.matchCount);
            const [r, x, y, z] = this.matches[matchIndex];
            const i = x + y * this.grid.MX + z * this.grid.MX * this.grid.MY;

            this.matchMask[r][i] = false;
            this.matches[matchIndex] = this.matches[this.matchCount - 1];
            this.matchCount--;

            if (this.grid.Matches(this.rules[r], x, y, z)) return [r, x, y, z];
        }
        return [-1, -1, -1, -1];
    }
}