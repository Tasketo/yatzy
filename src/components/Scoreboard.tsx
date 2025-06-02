import React from 'react';
import { getRoundWinners } from '../utils/getRoundWinners';

interface ScoreboardProps {
  players: string[];
  rounds: Array<Record<string, number>>;
  playerColors: Record<string, string>;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ players, rounds, playerColors }) => {
  // Calculate total per player
  const totals: Record<string, number> = {};
  players.forEach((player) => {
    totals[player] = rounds.reduce((sum, round) => sum + (round[player] || 0), 0);
  });

  // Find winner for each round
  const roundWinners = rounds.map((round) => getRoundWinners(players, round));

  // Count round wins for each player
  const roundWins: Record<string, number> = {};
  players.forEach((player) => {
    roundWins[player] = roundWinners.filter((winners) => winners.includes(player)).length;
  });

  // Find player(s) with the most round wins
  const maxWins = Math.max(...Object.values(roundWins));
  const overallWinners = players.filter((player) => roundWins[player] === maxWins && maxWins > 0);

  return (
    <div className="scoreboard" data-testid="scoreboard">
      <h2>Scoreboard</h2>
      <table>
        <thead>
          <tr>
            <th>Round</th>
            {players.map((player) => (
              <th key={player} style={{ color: playerColors[player] }}>
                {player}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rounds.map((round, idx) => (
            <tr key={idx} data-testid={`scoreboard-row-${idx}`}>
              <td>{idx + 1}</td>
              {players.map((player) => (
                <td
                  key={player}
                  className={roundWinners[idx].includes(player) ? 'scoreboard-winner-cell' : ''}
                  style={roundWinners[idx].includes(player) ? { fontWeight: 700, background: '#eaf7ea' } : {}}
                >
                  {round[player] ?? '-'}
                  {roundWinners[idx].includes(player) ? (
                    <span role="img" aria-label="Winner" className="trophy-animate">
                      🏆
                    </span>
                  ) : (
                    ''
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr className="scoreboard-total-row" data-testid="scoreboard-total-row">
            <td>Total</td>
            {players.map((player) => (
              <td key={player}>
                {totals[player]}
                {overallWinners.includes(player) ? (
                  <span role="img" aria-label="Winner">
                    {' '}
                    🏆
                  </span>
                ) : (
                  ''
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      {overallWinners.length === 1 ? (
        <div
          style={{
            marginTop: 16,
            fontWeight: 700,
            color: playerColors[overallWinners[0]],
          }}
          data-testid="overall-winner"
        >
          Winner: {overallWinners[0]}
        </div>
      ) : (
        <div style={{ marginTop: 16, fontWeight: 700 }} data-testid="overall-winner">
          Winners: {overallWinners.join(', ')}
        </div>
      )}
    </div>
  );
};
