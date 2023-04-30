export const getShadesOfColor = ([hue, sat = 0, light = 0], steps) => {
  const shades = [];
  const satStep = (100 - sat) / steps;
  const lightStep = (100 - light) / steps;

  for (let i = 1; i <= steps; i++) {
    shades.push(`hsl(${hue}, ${i * satStep + sat}%, ${i * lightStep + light}%`);
  }

  return shades;
};