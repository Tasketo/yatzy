// Find winner(s) for a round
export function getRoundWinners(players: string[], round: Record<string, number>): string[] {
  let max = -Infinity;
  let winner: string[] = [];
  players.forEach((player) => {
    const score = round[player] ?? -Infinity;
    if (score > max) {
      max = score;
      winner = [player];
    } else if (score === max) {
      winner.push(player);
    }
  });
  return winner;
}
