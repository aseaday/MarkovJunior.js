import { IScriptElement } from "../script";
import ArrayHelper from "../utils/arrayHelper";
import SymmetryHelper from "../utils/symmtryHelper";
import Branch from "./branch";
import Grid from "./grid";
import MarkovNode from "./markov";
import Node from "./node";
import Random from "../utils/random";
import Factory from "./factory";

export default class Interpreter {
    public root: Branch;
    public current: Branch;
    origin: originType;
    grid: Grid;
    startGrid: Grid;
    public changes: [number, number, number][];
    public first: number[];
    public counter: number;
    public gif: boolean;
    public random:Random;

    public static Load(selm: IScriptElement, MX: number, MY: number, MZ: number) {
        const ip = new Interpreter();
        const originName: originType = <originType>selm.Get<string>("origin", null);
        ip.origin = originName;
        ip.grid = Grid.Load(selm, MX, MY, MZ);
        ip.startGrid = ip.grid;
        const symmetryString: string = selm.Get<string>("symmetry", null);
        const symmetry: boolean[] = SymmetryHelper.GetSymmetry(MZ === 1, symmetryString, ArrayHelper.Array1D(MZ === 1 ? 8 : 48, true));
        if (symmetry === null) {
            return null;
        }
        const topNode = Factory(selm, symmetry, ip, ip.grid);
        if (topNode === null) {
            return null;
        }
        if ((topNode as Branch).isBranched) {
            ip.root = topNode as Branch;
        } else {
            ip.root = new MarkovNode(topNode, ip);
        }
        ip.changes = new Array<[number, number, number]>();
        ip.first = new Array<number>();
        return ip;
    }

    public *Run(seed: number, steps: number, gif: boolean): IterableIterator<[byte[], char[], number, number, number]> {
        this.random = new Random(seed);
        this.grid = this.startGrid;
        const originIndex = this.origin === "Center" ? (this.grid.MX / 2 + (this.grid.MY / 2) * this.grid.MX + (this.grid.MZ / 2) * this.grid.MX * this.grid.MY) : this.random.Next(this.grid.MX * this.grid.MY * this.grid.MZ);
        this.grid.Clear(originIndex);
        this.changes.splice(0);
        this.first.splice(0);
        this.first.push(0);
        this.root.Reset();
        this.gif = gif;
        this.counter = 0;
        this.current = this.root;
        while (this.current !== null && (steps <= 0 || this.counter < steps)) {
            if (gif) {
                yield [this.grid.state, this.grid.characters, this.grid.MX, this.grid.MY, this.grid.MZ]
            }

            this.current.Go()
            this.counter++;
            this.first.push(this.changes.length)
        }
        yield [this.grid.state, this.grid.characters, this.grid.MX, this.grid.MY, this.grid.MZ]
    }
}