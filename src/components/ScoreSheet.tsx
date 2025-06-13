import React, { useRef, useEffect } from 'react';
import { LOWER_CATEGORIES, UPPER_CATEGORIES, type YatzyCategory } from '../utils/yatzyCategories';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Input as ChakraInput, Checkbox } from '@chakra-ui/react';

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
    <Box
      className="score-sheet-modern"
      data-testid="score-sheet"
      borderRadius="lg"
      boxShadow="md"
      p={4}
      bg="whiteAlpha.900"
      _dark={{ bg: 'gray.700' }}
    >
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Name:</Th>
            {players.map((player) => (
              <Th
                key={player}
                color={playerColors[player]}
                textAlign="center"
                fontWeight={700}
                cursor={onPlayerColorChange ? 'pointer' : 'default'}
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
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {/* Upper section */}
          {UPPER_CATEGORIES.map((category, idx) => (
            <Tr key={category}>
              <Td className="category-label">{category}</Td>
              {players.map((player) => {
                const prev = prevScores.current?.[player]?.[category];
                const curr = scores[player]?.[category];
                const changed = prev !== undefined && prev !== curr;
                return (
                  <Td key={player} color={playerColors[player]}>
                    <ChakraInput
                      type="number"
                      textAlign="center"
                      min={0}
                      max={999}
                      value={curr ?? ''}
                      onChange={(e) => onScoreChange(player, category, e.target.value)}
                      inputMode="numeric"
                      className={`score-input${changed ? ' score-input-animate' : ''}`}
                      color={playerColors[player]}
                      data-testid={`score-input-row-${idx + 1}-${player}`}
                      size="sm"
                    />
                  </Td>
                );
              })}
            </Tr>
          ))}
          {/* Sum row */}
          <Tr className="sum-row">
            <Td className="category-label">Sum</Td>
            {players.map((player) => {
              const sum = UPPER_CATEGORIES.map((cat) => parseInt(scores[player]?.[cat] || '0', 10)).reduce(
                (a, b) => a + b,
                0,
              );
              return (
                <Td
                  textAlign="center"
                  key={player}
                  color={playerColors[player]}
                  data-testid={`sum-cell-${player}`}
                  fontWeight={700}
                >
                  {sum}
                </Td>
              );
            })}
          </Tr>
          {/* Bonus row */}
          <Tr className="bonus-row">
            <Td className="category-label">Bonus</Td>
            {players.map((player) => {
              const upperSum = UPPER_CATEGORIES.map((cat) => parseInt(scores[player]?.[cat] || '0', 10)).reduce(
                (a, b) => a + b,
                0,
              );
              const hasBonus = upperSum > 62;
              return (
                <Td key={player} textAlign="center">
                  <Checkbox
                    isChecked={hasBonus}
                    isReadOnly
                    colorScheme="green"
                    iconColor={playerColors[player]}
                    aria-label={hasBonus ? 'Bonus reached' : 'No bonus'}
                    data-testid={`bonus-checkbox-${player}`}
                    sx={{
                      accentColor: playerColors[player],
                      width: '1.2em',
                      height: '1.2em',
                      cursor: 'default',
                    }}
                  />
                </Td>
              );
            })}
          </Tr>
          <Tr>
            <Td colSpan={players.length + 1} className="section-divider"></Td>
          </Tr>
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
                tooltip = 'For dices in a row (e.g. 1-2-3-4). Score 30 points.';
                break;
              case 'Large Straight':
                tooltip = 'For dices in a row (e.g. 1-2-3-4-5). Scores 40 points.';
                break;
              case 'Full House':
                tooltip = 'A pair and three of a kind (e.g., 2-2-3-3-3). Scores 25 points.';
                break;
              case 'Chance':
                tooltip = 'Sum of all dice (any combination).';
                break;
              case 'Yatzy':
                tooltip = 'All five dice the same. Scores 35 points.';
                break;
              default:
                tooltip = '';
            }
            return (
              <Tr key={category}>
                <Td className="category-label" title={tooltip}>
                  {category}
                </Td>
                {players.map((player) => {
                  const prev = prevScores.current?.[player]?.[category as YatzyCategory];
                  const curr = scores[player]?.[category as YatzyCategory];
                  const changed = prev !== undefined && prev !== curr;
                  return (
                    <Td key={player} color={playerColors[player]}>
                      <ChakraInput
                        type="number"
                        textAlign="center"
                        min={0}
                        max={999}
                        value={curr ?? ''}
                        onChange={(e) => onScoreChange(player, category as YatzyCategory, e.target.value)}
                        inputMode="numeric"
                        className={`score-input${changed ? ' score-input-animate' : ''}`}
                        color={playerColors[player]}
                        data-testid={`score-input-row-${idx + 1 + UPPER_CATEGORIES.length}-${player}`}
                        size="sm"
                      />
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
          {/* Total row */}
          <Tr className="sum-row">
            <Td className="category-label">Total</Td>
            {players.map((player) => {
              // Upper section sum
              const upperSum = UPPER_CATEGORIES.map((cat) => parseInt(scores[player]?.[cat] || '0', 10)).reduce(
                (a, b) => a + b,
                0,
              );
              // Bonus
              const bonus = upperSum > 62 ? 35 : 0;
              // Lower section sum
              const lowerSum = LOWER_CATEGORIES.map((cat) => parseInt(scores[player]?.[cat] || '0', 10)).reduce(
                (a, b) => a + b,
                0,
              );
              // Total
              const total = upperSum + bonus + lowerSum;
              return (
                <Td
                  textAlign="center"
                  key={player}
                  className="sum-cell"
                  color={playerColors[player]}
                  data-testid={`endsum-cell-${player}`}
                  fontWeight={700}
                >
                  {total}
                </Td>
              );
            })}
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};
