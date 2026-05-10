import { sortDescending } from "./sorting";

export function getTopEntries(
  map: Record<string, number>,
  limit = 5
) {
  return sortDescending(
    Object.entries(map)
  ).slice(0, limit);
}

export function buildCountMap(
  values: string[]
) {
  const map: Record<string, number> = {};

  values.forEach((value) => {
    map[value] = (map[value] || 0) + 1;
  });

  return map;
}

export function sumValues(
  map: Record<string, number>
) {
  return Object.values(map).reduce(
    (a, b) => a + b,
    0
  );
}