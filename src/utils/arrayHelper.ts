export default class ArrayHelper {
    public static Array1D (length: number, value: ((arg: number) => T) | boolean): T[] {
        const result: T[] = [];
        for (let i = 0; i < length; i++) {
            if (typeof value !== "function") {
                result.push(value);
            } else if (typeof value === "function") {
                result.push(value(i));
            }
        }
        return result;
    }
}