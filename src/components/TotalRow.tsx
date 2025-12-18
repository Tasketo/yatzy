import React from 'react';
import { type YatzyCategory } from '../utils/yatzyCategories';
import { Table } from '@chakra-ui/react';
import { Trans } from 'react-i18next';
import { calculateRoundTotal } from '../utils/calculateScores';

interface TotalRowProps {
  players: string[];
  scores: Record<string, Record<YatzyCategory, string>>;
  playerColors: Record<string, string>;
}

export const TotalRow: React.FC<TotalRowProps> = ({ players, scores, playerColors }) => {
  return (
    <Table.Row>
      <Table.Cell fontWeight="bold">
        <Trans>Total</Trans>
      </Table.Cell>
      {players.map((player) => {
        const playerScores = scores[player] || {};
        const total = calculateRoundTotal(playerScores);
        return (
          <Table.Cell
            textAlign="center"
            key={player}
            color={playerColors[player]}
            data-testid={`endsum-cell-${player}`}
            fontWeight={700}
          >
            {total}
          </Table.Cell>
        );
      })}
    </Table.Row>
  );
};
