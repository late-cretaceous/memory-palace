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
      Math.round(Math.random() * 360),
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 100)
    );
  }

  toString() {
    return `hsl(${this.hue}, ${this.sat}%, ${this.light}%)`;
  }

  negative() {
    return new HSL(this.hue + 180, this.sat + 50, this.light + 50);
  }

  adjustedHSL(hue, sat, light) {
    return new HSL(this.hue + hue, this.sat + sat, this.light + light);
  }

  boundedAdd(addend, property) {
    const rawAdjustment = this[property] + addend;

    return rawAdjustment < 0 ? 0 : rawAdjustment > 99 ? 99 : rawAdjustment;
  }

  adjustedHSLBounded(hue, sat, light) {
    return new HSL(
      this.hue + hue,
      this.boundedAdd(sat, "sat"),
      this.boundedAdd(light, "light")
    );
  }

  shades(other, steps) {
    const ranges = new HSL([], [], []);

    for (const dimension in this) {
      ranges[dimension] = divideRange(this[dimension], other[dimension], steps);
    }

    return ranges.zipArrays();
  }

  zipArrays() {
    if (typeof this.hsl === "number") return this;

    return Array.from(
      { length: this.hue.length },
      (_, i) => new HSL(this.hue[i], this.sat[i], this.light[i])
    );
  }

  randomSignWithinBounds(magnitude, dimension = "hue") {
    const range = dimension === "hue" ? 360 : 100;

    return randomDirectionWithinBounds(this[dimension], magnitude, range);
  }
}

function divideRange(start, end, numDivisions) {
  const divisionSize = (end - start) / numDivisions;

  return Array.from(
    { length: numDivisions + 1 },
    (_, i) => start + i * divisionSize
  );
}

const coinToss = () => Math.round(Math.random());

const isOutOfRange = (a, b, range) => a + b >= range || a + b < 0;

export const randomDirectionWithinBounds = (original, adjustment, range) => {
  adjustment = coinToss() ? adjustment : -adjustment;

  return isOutOfRange(original, adjustment, range) ? -adjustment : adjustment;
};

export default HSL;
