export class HSL {
  constructor(hue, sat, light) {
    this.hue = hue;
    this.sat = sat;
    this.light = light;
  }

  hslRange(other, steps) {
    const ranges = new HSL([], [], []);

    for (const dimension in this) {
      ranges[dimension] = divideRange(this[dimension], other[dimension], steps);
    }

    return Array.from(ranges.zipArrays(), (hsl) => hsl.toString());
  }

  toString() {
    return `hsl(${this.hue}, ${this.sat}%, ${this.light}%)`;
  }

  zipArrays() {
    if (typeof this.hsl === "number") return this;

    return Array.from(
      { length: this.hue.length },
      (_, i) => new HSL(this.hue[i], this.sat[i], this.light[i])
    );
  }
}

function divideRange(start, end, numDivisions) {
  const divisionSize = (end - start) / numDivisions;

  return Array.from(
    { length: numDivisions + 1},
    (_, i) => start + 1 + i * divisionSize
  );
}