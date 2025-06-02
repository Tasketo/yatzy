// Calculate total per player for a round
export function getRoundTotals(players: string[], scores: Record<string, number>): Record<string, number> {
  const totals: Record<string, number> = {};
  players.forEach((player) => {
    totals[player] = scores[player] || 0;
  });
  return totals;
}
