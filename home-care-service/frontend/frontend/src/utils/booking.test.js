import { buildPricing, calculateEndTimeText, sortByNewest } from "./booking";

describe("booking utils", () => {
  test("calculateEndTimeText returns '--:--' when missing inputs", () => {
    expect(calculateEndTimeText("", 120)).toBe("--:--");
    expect(calculateEndTimeText("08:00", 0)).toBe("--:--");
  });

  test("calculateEndTimeText calculates end time correctly", () => {
    const result = calculateEndTimeText("08:30", 90);
    expect(result).toMatch(/10:00/);
  });

  test("buildPricing creates pricing object from basePrice", () => {
    expect(buildPricing(180000)).toEqual({
      base: 180000,
      surge: 0,
      discount: 0,
      total: 180000,
      currency: "VND"
    });
  });

  test("sortByNewest sorts by createdAt/updatedAt/startTime descending", () => {
    const items = [
      { id: "1", createdAt: "2026-03-01T10:00:00Z" },
      { id: "2", updatedAt: "2026-03-02T10:00:00Z" },
      { id: "3", startTime: "2026-03-03T10:00:00Z" }
    ];

    const sorted = sortByNewest(items);
    expect(sorted.map((x) => x.id)).toEqual(["3", "2", "1"]);
  });
});
