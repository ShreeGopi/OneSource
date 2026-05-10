export function incrementMap(
  map: Record<string, number>,
  key: string
): void {
  map[key] = (map[key] || 0) + 1;
}
