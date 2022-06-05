import Helper from "../utils/helper";

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
                        if ((w & 1) == 1) {
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
        if (OMX == IMX && OMY == IMY && OMZ == IMZ) {
            for (let c = 0; c < C; c++) {
                lists[c].splice(0);
            }
            for (let z = 0; z < IMZ; z++) {
                for (let y = 0; y < IMY; y++) {
                    for (let x = 0; x < IMX; x++) {
                        const o = output[z * OMX * OMY + y * OMX + x];
                        if (o != 0xff) {
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
            this.binput = w == wildcard ? 0xff : Helper.FirstNonZeroPos(w);
        }
    }

}