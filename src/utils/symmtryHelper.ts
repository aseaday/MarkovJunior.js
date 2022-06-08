export default class SymmetryHelper {
    public static squareSubgroups: Map<string, boolean[]> = new Map<string, boolean[]>(
        Object.entries(
            {
                "()": [true, false, false, false, false, false, false, false],
                "(x)": [true, true, false, false, false, false, false, false],
                "(y)": [true, false, false, false, false, true, false, false],
                "(x)(y)": [true, true, false, false, true, true, false, false],
                "(xy+)": [true, false, true, false, true, false, true, false],
                "(xy)": [true, true, true, true, true, true, true, true],
            }
        )
    );
    public static SquareSymmetries<T>(thing: T, rotation: (arg:T) => T, reflection: (arg:T) => T, same: (arg0: T, arg1:T) => boolean, subgroup: boolean[] = null): Iterable<T> {
        const things: T[] = new Array<T>(8);
        things[0] = thing;                  // e
        things[1] = reflection(things[0]);  // b
        things[2] = rotation(things[0]);    // a
        things[3] = reflection(things[2]);  // ba
        things[4] = rotation(things[2]);    // a2
        things[5] = reflection(things[4]);  // ba2
        things[6] = rotation(things[4]);    // a3
        things[7] = reflection(things[6]);  // ba3
        const result: T[] = new Array<T>();
        for (let i = 0; i < 8; i++) {
            if (subgroup == null || subgroup[i]) {
                if (result.filter(t => same(t, things[i])).length == 0) {
                    result.push(things[i]);
                }
            }
        }
        return result;
    }
    public static GetSymmetry(isDimTwo: boolean, symmetryString: string, defaultGroup: boolean[]): boolean[] {
        if (symmetryString == null) {
            return defaultGroup;
        }
    }
}