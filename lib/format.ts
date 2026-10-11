export function formatDate(date: string): string {
  const [y, m, d] = date.split("-");
  return `${y}. ${Number(m)}. ${Number(d)}.`;
}
