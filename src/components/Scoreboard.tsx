import React from 'react';
import { getRoundWinners } from '../utils/getRoundWinners';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Text } from '@chakra-ui/react';

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
    <Box
      className="scoreboard"
      data-testid="scoreboard"
      borderRadius="lg"
      boxShadow="md"
      p={4}
      bg="whiteAlpha.900"
      _dark={{ bg: 'gray.700' }}
    >
      <Text as="h2" fontSize="xl" fontWeight="bold" mb={4} color="gray.800" _dark={{ color: 'gray.100' }}>
        Scoreboard
      </Text>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Round</Th>
            {players.map((player) => (
              <Th key={player} color={playerColors[player]}>
                {player}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rounds.map((round, idx) => (
            <Tr key={idx} data-testid={`scoreboard-row-${idx}`}>
              <Td>{idx + 1}</Td>
              {players.map((player) => (
                <Td key={player} fontWeight={roundWinners[idx].includes(player) ? 700 : undefined}>
                  {round[player] ?? '-'}
                  {roundWinners[idx].includes(player) ? (
                    <span role="img" aria-label="Winner" className="trophy-animate">
                      🏆
                    </span>
                  ) : (
                    ''
                  )}
                </Td>
              ))}
            </Tr>
          ))}
          <Tr className="scoreboard-total-row" data-testid="scoreboard-total-row">
            <Td>Total</Td>
            {players.map((player) => (
              <Td key={player} fontWeight={700}>
                {totals[player]}
                {overallWinners.includes(player) ? (
                  <span role="img" aria-label="Winner">
                    🏆
                  </span>
                ) : (
                  ''
                )}
              </Td>
            ))}
          </Tr>
        </Tbody>
      </Table>
      {overallWinners.length === 1 ? (
        <Text mt={4} fontWeight={700} color={playerColors[overallWinners[0]]} data-testid="overall-winner">
          Winner: {overallWinners[0]}
        </Text>
      ) : (
        <Text mt={4} fontWeight={700} data-testid="overall-winner">
          Winners: {overallWinners.join(', ')}
        </Text>
      )}
    </Box>
  );
};
