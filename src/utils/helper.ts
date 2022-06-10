export default class Helper {
    public static FirstNonZeroPos(w: number): byte {
        for (let i = 0; i < 32; i++, w >>= 1) {
            if ((w & 1) === 1) {
                return i as byte;
            }
        }
        return 0xff;
    }

    public static Split(s: string, sep1: string, sep2: string) {
        const s1 = s.split(sep1);
        const result: string[][] = new Array<string[]>(s1.length);
        for (let i = 0; i < s1.length; i++) {
            result[i] = s1[i].split(sep2);
        }
        return result;
    }
}