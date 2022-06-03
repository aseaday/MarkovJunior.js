
class Grid
{
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

    public Load(script: IScript, MX: number, MY: number, MZ: number)
    {
        this.MX = MX;
        this.MY = MY;
        this.MZ = MZ;
        let valueString: string = script.get<string>("values", null)?.replace(" ", "");
        if (valueString == null)
        {
            return null;
        }

        this.C = <byte>valueString.length;
        this.values = new Map<char, byte>();
        this.waves = new Map<char, number>();

        this.characters = new Array<byte>(this.C);

        for (let i:uint8 = 0; i < this.C; i++)
        {
            let symbol = <uint8>valueString[i].charCodeAt(0);
            if (this.values.has(symbol))
            {
                return null;
            }
            else
            {
                this.characters[i] = symbol;
                this.values[symbol] = i;
                this.waves[symbol] = i;
            }
        }

        let transparentString: string = script.get<string>("transparent", null);
        if (transparentString != null) {
            this.transparent = this.Wave(transparentString);
        }
    }

    public Wave(values: string): number {
        let sum: number = 0;
        for (let index = 0; index < values.length; index++) {
            sum += 1 << this.values[values[index]];
        }
        return sum;
    }

}