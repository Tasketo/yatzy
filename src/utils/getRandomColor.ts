// Utility to generate a random, visually distinct color
export function getRandomColor(existing: string[]): string {
  const colors = [
    '#64b5f6', // blue
    '#81c784', // green
    '#ffd54f', // yellow
    '#ba68c8', // purple
    '#4db6ac', // teal
    '#ffb74d', // orange
    '#a1887f', // brown
    '#90a4ae', // blue gray
    '#f06292', // pink
    '#7986cb', // indigo
    '#aed581', // light green
    '#fff176', // light yellow
    '#9575cd', // violet
    '#4fc3f7', // light blue
    '#ff8a65', // light orange
    '#dce775', // lime
    '#b0bec5', // gray
    '#2196f3', // strong blue
  ];
  const available = colors.filter((c) => !existing.includes(c));
  return available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : colors[Math.floor(Math.random() * colors.length)];
}
