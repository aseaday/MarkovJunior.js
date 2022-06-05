export default class Helper {
    public static FirstNonZeroPos(w: number): byte {
        for (let i = 0; i < 32; i++, w >>= 1) {
            if ((w & 1) == 1) {
                return i as byte;
            }
        }
        return 0xff;
    }
}