export { cn } from "cn"

export function truncateWords(text: string, count = 4) {
  const words = text.trim().split(/\s+/);
  if (words.length <= count) return text;
  return words.slice(0, count).join(" ") + "...";
}
