import React from 'react';
import { type YatzyCategory } from '../utils/yatzyCategories';
import { Table, Checkbox } from '@chakra-ui/react';
import { Trans } from 'react-i18next';
import { calculateUpperSum, calculateBonus } from '../utils/calculateScores';

interface SumAndBonusRowProps {
  players: string[];
  scores: Record<string, Record<YatzyCategory, string>>;
  playerColors: Record<string, string>;
}

export const SumAndBonusRow: React.FC<SumAndBonusRowProps> = ({ players, scores, playerColors }) => {
  return (
    <>
      {/* Sum row */}
      <Table.Row>
        <Table.Cell fontWeight="bold">
          <Trans>Sum</Trans>
        </Table.Cell>
        {players.map((player) => {
          const playerScores = scores[player] || {};
          const sum = calculateUpperSum(playerScores);
          return (
            <Table.Cell
              textAlign="center"
              key={player}
              color={playerColors[player]}
              data-testid={`sum-cell-${player}`}
              fontWeight={700}
            >
              {sum}
            </Table.Cell>
          );
        })}
      </Table.Row>
      {/* Bonus row */}
      <Table.Row>
        <Table.Cell fontStyle="italic" border={0}>
          <Trans>Bonus</Trans>
        </Table.Cell>
        {players.map((player) => {
          const playerScores = scores[player] || {};
          const upperSum = calculateUpperSum(playerScores);
          const hasBonus = calculateBonus(upperSum) > 0;
          return (
            <Table.Cell key={player} textAlign="center" border={0}>
              <Checkbox.Root
                checked={hasBonus}
                readOnly
                colorScheme="green"
                aria-label={hasBonus ? 'Bonus reached' : 'No bonus'}
                data-testid={`bonus-checkbox-${player}`}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control color={playerColors[player]} />
              </Checkbox.Root>
            </Table.Cell>
          );
        })}
      </Table.Row>
    </>
  );
};
