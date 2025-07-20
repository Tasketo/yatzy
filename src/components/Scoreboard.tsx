import React from 'react';
import { getRoundWinners } from '../utils/getRoundWinners';
import { Table, Box, Text } from '@chakra-ui/react';
import { Trans } from 'react-i18next';

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
    <Box data-testid="scoreboard" borderRadius="lg" boxShadow="md" p={4} bg="whiteAlpha.900" _dark={{ bg: 'gray.700' }}>
      <Text as="h2" fontSize="xl" fontWeight="bold" mb={4} color="gray.800" _dark={{ color: 'gray.100' }}>
        <Trans>Scoreboard</Trans>
      </Text>
      <Table.Root variant="outline" size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>
              <Trans>Round</Trans>
            </Table.ColumnHeader>
            {players.map((player) => (
              <Table.ColumnHeader key={player} color={playerColors[player]}>
                {player}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rounds.map((round, idx) => (
            <Table.Row key={idx} data-testid={`scoreboard-row-${idx}`}>
              <Table.Cell>{idx + 1}</Table.Cell>
              {players.map((player) => (
                <Table.Cell key={player} fontWeight={roundWinners[idx].includes(player) ? 700 : undefined}>
                  {round[player] ?? '-'}
                  {roundWinners[idx].includes(player) ? (
                    <span role="img" aria-label="Winner" className="trophy-animate">
                      🏆
                    </span>
                  ) : (
                    ''
                  )}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
          <Table.Row data-testid="scoreboard-total-row">
            <Table.Cell>Total</Table.Cell>
            {players.map((player) => (
              <Table.Cell key={player} fontWeight={700}>
                {totals[player]}
                {overallWinners.includes(player) ? (
                  <span role="img" aria-label="Winner">
                    🏆
                  </span>
                ) : (
                  ''
                )}
              </Table.Cell>
            ))}
          </Table.Row>
        </Table.Body>
      </Table.Root>
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
