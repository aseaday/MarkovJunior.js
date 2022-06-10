import { IScriptElement } from "../script";
import Helper from "../utils/helper";
import SymmetryHelper from "../utils/symmtryHelper";
import Grid from "./grid";

export default class Rule {
    IMX: number; IMY: number; IMZ: number;
    OMX: number; OMY: number; OMZ: number;
    input: number[];
    output: byte[];
    binput: byte[];
    p: number;
    ishifts: [number, number, number][][];
    oshifts: [number, number, number][][];

    original: boolean;
    constructor(input: number[], IMX: number, IMY: number, IMZ: number,
        output: byte[], OMX: number, OMY: number, OMZ: number, C: number, p: number) {
        this.input = input;
        this.output = output;
        this.IMX = IMX;
        this.IMY = IMY;
        this.IMZ = IMZ;
        this.OMX = OMX;
        this.OMY = OMY;
        this.OMZ = OMZ;
        this.p = p;

        const lists = new Array<[number, number, number][]>(C);
        for (let i = 0; i < C; i++) {
            lists[i] = [];
        }
        for (let z = 0; z < IMZ; z++) {
            for (let y = 0; y < IMY; y++) {
                for (let x = 0; x < IMX; x++) {
                    let w = this.input[z * IMX * IMY + y * IMX + x];
                    for (let c = 0; c < C; c++, w >>= 1) {
                        if ((w & 1) === 1) {
                            lists[c].push([x, y, z]);
                        }
                    }

                }
            }
        }
        this.ishifts = new Array<[number, number, number][]>(C);
        for (let c = 0; c < C; c++) {
            this.ishifts[c] = Array.from(lists[c]);
        }
        if (OMX === IMX && OMY === IMY && OMZ === IMZ) {
            for (let c = 0; c < C; c++) {
                lists[c].splice(0);
            }
            for (let z = 0; z < IMZ; z++) {
                for (let y = 0; y < IMY; y++) {
                    for (let x = 0; x < IMX; x++) {
                        const o = output[z * OMX * OMY + y * OMX + x];
                        if (o !== 0xff) {
                            lists[o].push([x, y, z])
                        } else {
                            for (let c = 0; c < C; c++) {
                                lists[c].push([x, y, z]);
                            }
                        }
                    }
                }
            }
            this.oshifts = new Array<[number, number, number][]>(C);
            for (let c = 0; c < C; c++) {
                this.oshifts[c] = Array.from(lists[c]);
            }
        }

        const wildcard = (1 << C) - 1;
        this.binput = new Array<byte>(this.input.length);
        for (let i = 0; i < input.length; i++) {
            const w = input[i];
            this.binput[i] = w === wildcard ? 0xff : Helper.FirstNonZeroPos(w) as byte;
        }
    }

    public Symmetries(symmetry: boolean[], d2: boolean): Iterable<Rule> {
        if (d2) {
            return SymmetryHelper.SquareSymmetries(this, (r) => r.ZRotated(), (r) => r.Reflected(), Rule.Same, symmetry);
        }
    }

    public ZRotated(): Rule {
        const newinput = new Array<number>(this.input.length);
        for (let z = 0; z < this.IMZ; z++) {
            for (let y = 0; y < this.IMY; y++) {
                for (let x = 0; x < this.IMX; x++) {
                    newinput[x + y * this.IMX + z * this.IMX * this.IMY] = this.input[this.IMX - 1 - y + x * this.IMX + z * this.IMX * this.IMY];
                }
            }
        }
        const newoutput = new Array<byte>(this.output.length);
        for (let z = 0; z < this.IMZ; z++) {
            for (let y = 0; y < this.IMY; y++) {
                for (let x = 0; x < this.IMX; x++) {
                    newoutput[x + y * this.OMX + z * this.OMX * this.OMY] = this.output[this.OMX - 1 - y + x * this.OMX + z * this.OMX * this.OMY];
                }
            }
        }
        return new Rule(newinput, this.IMY, this.IMX, this.IMZ, newoutput, this.OMY, this.OMX, this.OMZ, this.ishifts.length, this.p);
    }

    public Reflected(): Rule {
        const newinput = new Array<number>(this.input.length);
        for (let z = 0; z < this.IMZ; z++) {
            for (let y = 0; y < this.IMY; y++) {
                for (let x = 0; x < this.IMX; x++) {
                    newinput[x + y * this.IMX + z * this.IMX * this.IMY] = this.input[this.IMX - 1 - x + y * this.IMX + z * this.IMX * this.IMY];
                }
            }
        }
        const newoutput = new Array<byte>(this.output.length);
        for (let z = 0; z < this.IMZ; z++) {
            for (let y = 0; y < this.IMY; y++) {
                for (let x = 0; x < this.IMX; x++) {
                    newoutput[x + y * this.OMX + z * this.OMX * this.OMY] = this.output[this.OMX - 1 - x + y * this.OMX + z * this.OMX * this.OMY];
                }
            }
        }
        return new Rule(newinput, this.IMY, this.IMX, this.IMZ, newoutput, this.OMY, this.OMX, this.OMZ, this.ishifts.length, this.p);
    }

    public static Same(a1: Rule, a2: Rule): boolean {
        if (a1.IMX !== a2.IMX || a1.IMY !== a2.IMY || a1.IMZ !== a2.IMZ || a1.OMX !== a2.OMX || a1.OMY !== a2.OMY || a1.OMZ !== a2.OMZ) {
            return false;
        }
         for (let i = 0; i < a1.IMX * a1.IMY * a1.IMZ; i++) {
             if (a1.input[i] !== a2.input[i]) {
                 return false;
             }
         }
        for (let i = 0; i < a1.OMX * a1.OMY * a1.OMZ; i++) {
            if (a1.output[i] !== a2.output[i]) {
                return false;
            }
        }
        return true;
    }

    public static Parse(s: string): [char[], number, number, number] {
        const lines = Helper.Split(s, " ", "/");
        const MX = lines[0][0].length;
        const MY = lines[0].length;
        const MZ = lines.length;
        const result = new Array<char>(MX * MY * MZ);
        for (let z = 0; z < MZ; z++) {
            const linesz = lines[MZ - 1 - z];
            if (linesz.length !== MY) {
                return [null, -1, -1, -1];
            }
            for (let y = 0; y < MY; y++) {
                const lineszy = linesz[y];
                if (lineszy.length !== MX) {
                    return [null, -1, -1, -1];
                }
                for (let x = 0; x < MX; x++) {
                    result[x + y * MX + z * MX * MY] = lineszy[x] as char;
                }
            }
        }
        return [result, MX, MY, MZ];
    }

    public static Load(selem: IScriptElement, gin: Grid, gout: Grid): Rule {
        const inString: string | null = selem.Get<string>("in", null);
        const outString: string | null = selem.Get<string>("out", null);

        let inRect: char[], outRect: char[];
        let IMX = -1, IMY = -1, IMZ = -1;
        let OMX = -1, OMY = -1, OMZ = -1;

        if (inString === null || outString === null) {
            return null;
        }
        // eslint-disable-next-line prefer-const
        [inRect, IMX, IMY, IMZ] = Rule.Parse(inString);
        // eslint-disable-next-line prefer-const
        [outRect, OMX, OMY, OMZ] = Rule.Parse(outString);
        if (inRect === null || outRect === null) {
            console.error("no in string or no out string")
            return null;
        }
        const input: number[] = new Array<number>(inRect.length);
        for (let i = 0; i < inRect.length; i++) {
            const c: char = inRect[i];
            if (gin.waves.has(c)) {
                input[i] = gin.waves.get(c);
            } else {
                console.error("the input string has a char not in the grid");
                return null;
            }
        }
        const output: byte[] = new Array<byte>(outRect.length);
        for (let o = 0; o < outRect.length; o++) {
            const c: char = outRect[o];
            if (c === "*") {
                output[o] = 0xff;
            } else {
                if (gout.values.has(c)) {
                    output[o] = gout.values.get(c);
                } else {
                    console.error("the output string has a char not in the grid");
                    return null;
                }
            }
        }
        const p: number = selem.Get<number>("p", 1.0);
        return new Rule(input, IMX, IMY, IMZ, output, OMX, OMY, OMZ, gin.C, p);
    }
}