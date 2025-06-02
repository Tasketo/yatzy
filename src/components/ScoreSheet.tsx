import React, { useRef, useEffect } from 'react';
import { LOWER_CATEGORIES, UPPER_CATEGORIES, type YatzyCategory } from '../utils/yatzyCategories';

interface ScoreSheetProps {
  players: string[];
  scores: Record<string, Record<YatzyCategory, string>>;
  onScoreChange: (player: string, category: YatzyCategory, value: string) => void;
  playerColors: Record<string, string>;
  onPlayerColorChange?: (player: string) => void;
}

export const ScoreSheet: React.FC<ScoreSheetProps> = ({
  players,
  scores,
  onScoreChange,
  playerColors,
  onPlayerColorChange,
}) => {
  // Track previous values for animation
  const prevScores = useRef<Record<string, Record<YatzyCategory, string>>>({});

  useEffect(() => {
    prevScores.current = scores;
  }, [scores]);

  return (
    <div className="score-sheet-modern" data-testid="score-sheet">
      <table>
        <thead>
          <tr>
            <th>Name:</th>
            {players.map((player) => (
              <th
                key={player}
                style={{
                  color: playerColors[player],
                  fontWeight: 700,
                  cursor: onPlayerColorChange ? 'pointer' : 'default',
                }}
                onClick={onPlayerColorChange ? () => onPlayerColorChange(player) : undefined}
                title={onPlayerColorChange ? 'Click to change color' : undefined}
                tabIndex={onPlayerColorChange ? 0 : undefined}
                onKeyDown={
                  onPlayerColorChange
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') onPlayerColorChange(player);
                      }
                    : undefined
                }
                aria-label={onPlayerColorChange ? `Change color for ${player}` : undefined}
                data-testid={`player-color-${player}`}
              >
                {player}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Upper section */}
          {UPPER_CATEGORIES.map((category, idx) => (
            <tr key={category}>
              <td className="category-label">{category}</td>
              {players.map((player) => {
                const prev = prevScores.current?.[player]?.[category];
                const curr = scores[player]?.[category];
                const changed = prev !== undefined && prev !== curr;
                return (
                  <td key={player} style={{ color: playerColors[player] }}>
                    <input
                      type="number"
                      min="0"
                      max="999"
                      value={curr ?? ''}
                      onChange={(e) => onScoreChange(player, category, e.target.value)}
                      inputMode="numeric"
                      className={`score-input${changed ? ' score-input-animate' : ''}`}
                      style={{ color: playerColors[player] }}
                      data-testid={`score-input-row-${idx + 1}-${player}`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
          {/* Sum row */}
          <tr className="sum-row">
            <td className="category-label">Sum</td>
            {players.map((player) => {
              const sum = UPPER_CATEGORIES.map((cat) => parseInt(scores[player]?.[cat] || '0', 10)).reduce(
                (a, b) => a + b,
                0,
              );
              return (
                <td
                  key={player}
                  className="sum-cell"
                  style={{ color: playerColors[player] }}
                  data-testid={`sum-cell-${player}`}
                >
                  {sum}
                </td>
              );
            })}
          </tr>
          {/* Bonus row */}
          <tr className="bonus-row">
            <td className="category-label">Bonus</td>
            {players.map((player) => {
              const upperSum = UPPER_CATEGORIES.map((cat) => parseInt(scores[player]?.[cat] || '0', 10)).reduce(
                (a, b) => a + b,
                0,
              );
              const hasBonus = upperSum > 62;
              return (
                <td key={player} style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={hasBonus}
                    readOnly
                    style={{
                      accentColor: playerColors[player],
                      width: '1.2em',
                      height: '1.2em',
                      cursor: 'default',
                    }}
                    aria-label={hasBonus ? 'Bonus reached' : 'No bonus'}
                    data-testid={`bonus-checkbox-${player}`}
                  />
                </td>
              );
            })}
          </tr>
          <tr>
            <td colSpan={players.length + 1} className="section-divider"></td>
          </tr>
          {/* Lower section */}
          {LOWER_CATEGORIES.map((category, idx) => {
            let tooltip = '';
            switch (category) {
              case 'One Pair':
                tooltip = 'Sum of the two highest matching dice.';
                break;
              case 'Two Pairs':
                tooltip = 'Sum of two different pairs (4 dice). Example: 2-2-5-5-6 scores 2+2+5+5=14.';
                break;
              case 'Three of a Kind':
                tooltip = 'Sum of three matching dice.';
                break;
              case 'Four of a Kind':
                tooltip = 'Sum of four matching dice.';
                break;
              case 'Small Straight':
                tooltip = '1-2-3-4-5 (any order). Scores 15 points.';
                break;
              case 'Large Straight':
                tooltip = '2-3-4-5-6 (any order). Scores 20 points.';
                break;
              case 'Full House':
                tooltip = 'A pair and three of a kind (e.g., 2-2-3-3-3). Scores the sum of all dice.';
                break;
              case 'Chance':
                tooltip = 'Sum of all dice (any combination).';
                break;
              case 'Yatzy':
                tooltip = 'All five dice the same. Scores 50 points.';
                break;
              default:
                tooltip = '';
            }
            return (
              <tr key={category}>
                <td className="category-label" title={tooltip}>
                  {category}
                </td>
                {players.map((player) => {
                  const prev = prevScores.current?.[player]?.[category];
                  const curr = scores[player]?.[category];
                  const changed = prev !== undefined && prev !== curr;
                  return (
                    <td key={player} style={{ color: playerColors[player] }}>
                      <input
                        type="number"
                        min="0"
                        max="999"
                        value={curr ?? ''}
                        onChange={(e) => onScoreChange(player, category, e.target.value)}
                        inputMode="numeric"
                        className={`score-input${changed ? ' score-input-animate' : ''}`}
                        style={{ color: playerColors[player] }}
                        data-testid={`score-input-row-${idx + 1 + UPPER_CATEGORIES.length}-${player}`}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {/* Total row */}
          <tr className="sum-row">
            <td className="category-label">Total</td>
            {players.map((player) => {
              // Upper section sum
              const upperSum = UPPER_CATEGORIES.map((cat) => parseInt(scores[player]?.[cat] || '0', 10)).reduce(
                (a, b) => a + b,
                0,
              );
              // Bonus
              const bonus = upperSum > 62 ? 50 : 0;
              // Lower section sum
              const lowerSum = LOWER_CATEGORIES.map((cat) => parseInt(scores[player]?.[cat] || '0', 10)).reduce(
                (a, b) => a + b,
                0,
              );
              // Total
              const total = upperSum + bonus + lowerSum;
              return (
                <td
                  key={player}
                  className="sum-cell"
                  style={{ color: playerColors[player] }}
                  data-testid={`endsum-cell-${player}`}
                >
                  {total}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
