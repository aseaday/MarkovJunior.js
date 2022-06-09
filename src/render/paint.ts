// The painter only support 2D for the moment

function parseStringToRGB(str: string): [number, number, number] {
    const [r, g, b] = str.split(' ').map(x => parseInt(x, 10));
    return [r, g, b];
}

export default class Paint {
    private patinValue: [number, number, number][];
    private coloMap: Map<char, [number, number, number]>;
    private characters: char[];
    private state: uint8[];
    private MX: number;
    private MY: number;
    private MZ: number;

    constructor(height: number, width: number, Z: number = 1) {
        this.patinValue = new Array<[number, number, number]>(height * width * Z);
        this.coloMap = new Map<char, [number, number, number]>();
        const paletteData = require("./palette.json");
        for (const color of paletteData) {
            this.coloMap.set(color["symbol"], color["value"]);
        }
    }

    public setFrame(result:[uint8[], char[], number, number, number]) {
        const [state, characters, MX, MY, MZ] = result;
        this.state = state;
        this.characters = characters;
        this.MX = MX;
        this.MY = MY;
        this.MZ = MZ;
    }

    public getPixel(x: number, y: number, z:number = 0): [number, number, number] {
        return this.coloMap.get(this.characters[this.state[x + y * this.MX + z * this.MX * this.MY]]);
    }
}