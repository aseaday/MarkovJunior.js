export default class Random {
    private seed: number;
    constructor(seed:number) {
        this.seed = seed;
    }
    public Next(min: number, max?: number): number {
        let imax = max;
        let imin = min;
        if (!max) {
            imax = min;
            imin = 0;
        }
        return Math.floor(Math.random() * (imax - imin)) + imin;
    }
}