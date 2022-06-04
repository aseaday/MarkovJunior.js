import { IScriptElement } from "../script";
import XmlElement from "../script/xmlElement";

export default class Grid {
    public state: char[];
    public mask: boolean[];
    public MX: number;
    public MY: number;
    public MZ: number;
    public C: byte;
    public characters: byte[];
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
        if (valueString == null) {
            return null;
        }

        g.C = <byte>valueString.length;
        g.values = new Map<char, byte>();
        g.waves = new Map<char, number>();

        g.characters = new Array<byte>(g.C);

        for (let i: uint8 = 0; i < g.C; i++) {
            const symbol = <uint8>valueString[i].charCodeAt(0);
            if (g.values.has(symbol)) {
                return null;
            }
            else {
                g.characters[i] = symbol;
                g.values[symbol] = i;
                g.waves[symbol] = i;
            }
        }

        const transparentString: string = script.Get<string>("transparent", null);
        if (transparentString != null) {
            g.transparent = g.Wave(transparentString);
        }
        const xunions: IScriptElement[] = new Array<IScriptElement>();
        for (const ele of script.MyDescendants(["markov", "sequence", "union"])) {
            if (ele.name == "union") {
                xunions.push(ele);
            }
        }
        g.waves["*"] = (1 << g.C) - 1;
        xunions.forEach(element => {
            const symbol:char = element.Get<char>("symbol", null);
            if (g.waves.has(symbol)) {
                return null;
            }
            else {
                const w = g.Wave(element.Get<string>("values", null));
                g.waves[symbol] = w;
            }
        });
        g.state = new Array<byte>(g.MX * g.MY * g.MZ);
        g.statebuffer = new Array<byte>(g.MX * g.MY * g.MZ);
        g.mask = new Array<boolean>(g.MX * g.MY * g.MZ);
        g.folder = script.Get<string>("folder", null);
        return g;
    }

    public Clear(origin: number):void
    {
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

}