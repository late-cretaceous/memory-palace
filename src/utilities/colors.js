class HSL {
  constructor(hue, sat, light) {
    this.hue = hue % 360;
    this.sat = sat % 100;
    this.light = light % 100;
  }

  static fromString(hslString) {
    const values = HSL.getHSLValues(hslString);

    return new HSL(values[0], values[1], values[2]);
  }

  static getHSLValues(colorString) {
    const hslRegex = /hsl\((\d+)%,\s*(\d+)%,\s*(\d+)%\)/;
    const matches = colorString.match(hslRegex);

    if (!matches) return null;

    return Array.from({ length: 3 }, (_, i) => parseInt(matches[i + 1], 10));
  }

  static random() {
    return new HSL(
      Math.random() * 360,
      Math.random() * 100,
      Math.random() * 100
    );
  }

  toString() {
    return `hsl(${this.hue}, ${this.sat}%, ${this.light}%)`;
  }

  hslRange(other, steps) {
    const ranges = new HSL([], [], []);

    for (const dimension in this) {
      ranges[dimension] = divideRange(this[dimension], other[dimension], steps);
    }

    return Array.from(ranges.zipArrays(), (hsl) => hsl.toString());
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
    { length: numDivisions + 1 },
    (_, i) => start + 1 + i * divisionSize
  );
}

export default HSL;
