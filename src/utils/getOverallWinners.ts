// Find overall winner(s)
export function getOverallWinners(players: string[], totals: Record<string, number>): string[] {
  const maxTotal = Math.max(...players.map((p) => totals[p]));
  return players.filter((p) => totals[p] === maxTotal);
}
