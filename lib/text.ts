export function initials(name: string): string {
  const words = name
    .replace(/\[[^\]]*\]/g, "")
    .split(/\s+/)
    .filter((word) => /\p{L}/u.test(word));
  return words
    .slice(0, 2)
    .map((word) => word.match(/\p{L}/u)![0].toUpperCase())
    .join("");
}
