import React from 'react';
import { getRoundWinners } from '../utils/getRoundWinners';
import { Table, Box, Button, Text } from '@chakra-ui/react';
import { Trans } from 'react-i18next';

const ROUND_BATCH_SIZE = 25;

interface ScoreboardProps {
  players: string[];
  rounds: Array<Record<string, number>>;
  playerColors: Record<string, string>;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ players, rounds, playerColors }) => {
  const [visibleRoundCount, setVisibleRoundCount] = React.useState(ROUND_BATCH_SIZE);

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

  // Find the highest and lowest round score for each player
  const highestScores: Record<string, number> = {};
  const lowestScores: Record<string, number> = {};
  players.forEach((player) => {
    const playerScores = rounds.map((round) => round[player] ?? 0);
    highestScores[player] = playerScores.length > 0 ? Math.max(...playerScores) : 0;
    lowestScores[player] = playerScores.length > 0 ? Math.min(...playerScores) : 0;
  });

  // Find player(s) with the most round wins
  const maxWins = Math.max(...Object.values(roundWins));
  const overallWinners = players.filter((player) => roundWins[player] === maxWins && maxWins > 0);

  return (
    <Box data-testid="scoreboard" borderRadius="lg" boxShadow="md" p={4} bg="whiteAlpha.900" _dark={{ bg: 'gray.700' }}>
      <Text as="h2" fontSize="xl" fontWeight="bold" mb={4} color="gray.800" _dark={{ color: 'gray.100' }}>
        <Trans>Scoreboard</Trans>
      </Text>
      {visibleRoundCount < rounds.length && (
        <Button
          mb={4}
          data-testid="show-more-rounds-btn"
          onClick={() => setVisibleRoundCount((count) => count + ROUND_BATCH_SIZE)}
        >
          <Trans>Show more</Trans>
        </Button>
      )}
      <Table.Root size="sm">
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
          {rounds.slice(Math.max(0, rounds.length - visibleRoundCount)).map((round, idx) => {
            const roundIndex = Math.max(0, rounds.length - visibleRoundCount) + idx;
            return (
              <Table.Row key={roundIndex} data-testid={`scoreboard-row-${roundIndex}`}>
                <Table.Cell>{roundIndex + 1}</Table.Cell>
                {players.map((player) => (
                  <Table.Cell key={player} fontWeight={roundWinners[roundIndex].includes(player) ? 700 : undefined}>
                    {round[player] ?? '-'}
                    {roundWinners[roundIndex].includes(player) ? (
                      <span role="img" aria-label="Winner" className="trophy-animate">
                        🏆
                      </span>
                    ) : (
                      ''
                    )}
                  </Table.Cell>
                ))}
              </Table.Row>
            );
          })}
          <Table.Row data-testid="scoreboard-total-row">
            <Table.Cell fontWeight={700}>
              <Trans>Total points</Trans>
            </Table.Cell>
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
          <Table.Row data-testid="scoreboard-wins-row">
            <Table.Cell fontWeight={700}>
              <Trans>Total wins</Trans>
            </Table.Cell>
            {players.map((player) => (
              <Table.Cell key={player} fontWeight={700}>
                {roundWins[player]}
              </Table.Cell>
            ))}
          </Table.Row>
          <Table.Row data-testid="scoreboard-highest-row">
            <Table.Cell fontWeight={700}>
              <Trans>Highest score</Trans>
            </Table.Cell>
            {players.map((player) => (
              <Table.Cell key={player} fontWeight={700}>
                {highestScores[player]}
              </Table.Cell>
            ))}
          </Table.Row>
          <Table.Row data-testid="scoreboard-lowest-row">
            <Table.Cell fontWeight={700}>
              <Trans>Lowest score</Trans>
            </Table.Cell>
            {players.map((player) => (
              <Table.Cell key={player} fontWeight={700}>
                {lowestScores[player]}
              </Table.Cell>
            ))}
          </Table.Row>
        </Table.Body>
      </Table.Root>
      {overallWinners.length === 1 ? (
        <Text mt={4} fontWeight={700} color={playerColors[overallWinners[0]]} data-testid="overall-winner">
          <Trans>Winner</Trans>: {overallWinners[0]}
        </Text>
      ) : (
        <Text mt={4} fontWeight={700} data-testid="overall-winner">
          <Trans>Winners</Trans>: {overallWinners.join(', ')}
        </Text>
      )}
    </Box>
  );
};
