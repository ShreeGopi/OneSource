export function sortDescending(
  entries: [string, number][]
) {
  return entries.sort(
    (a, b) => b[1] - a[1]
  );
}

export function getTopEntry(
  obj: Record<string, number>
) {
  return Object.entries(obj).sort(
    (a, b) => b[1] - a[1]
  )[0];
}