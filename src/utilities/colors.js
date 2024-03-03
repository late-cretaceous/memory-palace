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
    const hslRegex = /hsl\((\d+(?:\.\d*)?),\s*(\d+(?:\.\d*)?)%,\s*(\d+(?:\.\d*)?)%\)/;
    const matches = colorString.match(hslRegex);

    if (!matches) return null;

    return Array.from({ length: 3 }, (_, i) => parseFloat(matches[i + 1], 10));
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

  isSameColor(other) {
    return (
      this.hue === other.hue &&
      this.sat === other.sat &&
      this.light === other.light
    );
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

  faded(divergence = 1) {
    const lightAdjustment = this.light < 50 ? divergence * 10 : -divergence * 10;
    const satAdjustment = divergence * 10;
    return new HSL(this.hue, this.sat - satAdjustment, this.light + lightAdjustment);
  }
}

function divideRange(start, end, sections) {
  const divisionSize = (end - start) / (sections - 1);

  return Array.from({ length: sections }, (_, i) => start + i * divisionSize);
}

const coinToss = () => Math.round(Math.random());

const isOutOfRange = (a, b, range) => a + b >= range || a + b < 0;

export const randomDirectionWithinBounds = (original, adjustment, range) => {
  adjustment = coinToss() ? adjustment : -adjustment;

  return isOutOfRange(original, adjustment, range) ? -adjustment : adjustment;
};

export default HSL;
