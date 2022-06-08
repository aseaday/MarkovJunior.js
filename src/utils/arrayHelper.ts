declare type AnyFunction = (...args: unknown[]) => unknown

function isFunction<T extends AnyFunction>(value: unknown): value is T {
    return typeof value === 'function'
}
export default class ArrayHelper {
    public static Array1D<T>(length: number, value: ((arg: number) => T) | T): T[] {
        const result = new Array<T>(length);
        if (isFunction(value)) {
            for (let i = 0; i < length; i++) {
                result[i] = value(i);
            }
        } else {
            for (let i = 0; i < length; i++) {
                result[i] = value;
            }
        }
        return result;
    }
    public static Array2D<T>(MX: number, MY: number, value: ((arg1: number, arg2: number) => T) | T): T[][] {
        const result = new Array<T[]>(MX);
        const isFuncFlag = isFunction(value);
        for (let x = 0; x < MX; x++) {
            result[x] = new Array<T>(MY);
            for (let y = 0; y < MY; y++) {
                if (isFuncFlag) {
                    result[x][y] = value(x, y);
                } else {
                    result[x][y] = value;
                }
            }
        }
        return result;
    }
}