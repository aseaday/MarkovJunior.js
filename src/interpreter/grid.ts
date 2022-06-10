import { IScriptElement } from "../script";
import Rule from "./rule";

export default class Grid {
    public state: byte[];
    public mask: boolean[];
    public MX: number;
    public MY: number;
    public MZ: number;
    public C: byte;
    public characters: char[];
    public values: Map<char, byte>;
    public waves: Map<char, number>;
    public folder: string;

    transparent: number;
    statebuffer: byte[];

    public static Load(script: IScriptElement, MX: number, MY: number, MZ: number): Grid {
        const g = new Grid();
        g.MX = MX;
        g.MY = MY;
        g.MZ = MZ;
        const valueString: string = script.Get<string>("values", null)?.replace(" ", "");
        if (valueString === null) {
            return null;
        }

        g.C = <byte>valueString.length;
        g.values = new Map<char, byte>();
        g.waves = new Map<char, number>();

        g.characters = new Array<char>();

        for (let i: uint8 = 0; i < g.C; i++) {
            const symbol = <char>valueString[i]
            if (g.values.has(symbol)) {
                return null;
            }
            else {
                g.characters.push(symbol);
                g.values.set(symbol, i as uint8);
                g.waves.set(symbol, 1 << i);
            }
        }
        const transparentString: string = script.Get<string>("transparent", null);
        if (transparentString != null) {
            g.transparent = g.Wave(transparentString);
        }
        const xunions: IScriptElement[] = new Array<IScriptElement>();
        for (const ele of script.MyDescendants(["markov", "sequence", "union"])) {
            if (ele.name === "union") {
                xunions.push(ele);
            }
        }
        g.waves.set("*", (1 << g.C) - 1);
        xunions.forEach(element => {
            const symbol: char = element.Get<char>("symbol", null);
            if (g.waves.has(symbol)) {
                return null;
            }
            else {
                const w = g.Wave(element.Get<string>("values", null));
                g.waves.set(symbol, w);
            }
        });
        g.state = new Array<byte>(g.MX * g.MY * g.MZ);
        g.statebuffer = new Array<byte>(g.MX * g.MY * g.MZ);
        g.mask = new Array<boolean>(g.MX * g.MY * g.MZ);
        g.folder = script.Get<string>("folder", null);
        return g;
    }

    public Clear(origin: number): void {
        for (let i = 0; i < this.state.length; i++) {
            this.state[i] = 0;
        }
        if (origin >= 0) {
            this.state[origin] = 1;
        }
    }

    public Wave(values: string): number {
        let sum = 0;
        for (let index = 0; index < values.length; index++) {
            sum += 1 << this.values[values[index]];
        }
        return sum;
    }

    public Matches(rule: Rule, x: number, y: number, z: number): boolean {
        let dz = 0;
        let dy = 0;
        let dx = 0;
        for (let di = 0; di < rule.input.length; di++) {
            const cvalue = this.state[x + dx + (y + dy) * this.MX + (z + dz) * this.MX * this.MY] as number
            if (((rule.input[di]) & (1 << cvalue)) === 0) {
                return false;
            }
            dx++;
            if (dx === rule.IMX) {
                dx = 0;
                dy++;
                if (dy === rule.IMY) {
                    dy = 0;
                    dz++;
                }
            }
        }
        return true;
    }
}