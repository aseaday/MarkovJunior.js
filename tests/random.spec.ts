import Random from "../src/utils/random";
describe("test Random", () => {
    test("if random.next works", () => {
        const rnd = new Random(1);
        expect(rnd.Next(100)).toBeLessThanOrEqual(100);
        expect(rnd.Next(100)).toBeLessThanOrEqual(100);
        expect(rnd.Next(100)).toBeLessThanOrEqual(100);
        expect(rnd.Next(100)).toBeGreaterThan(0);
        expect(rnd.Next(100)).toBeGreaterThan(0);
        expect(rnd.Next(100)).toBeGreaterThan(0);
    });
})