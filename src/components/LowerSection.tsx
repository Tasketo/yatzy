import React from 'react';
import {
  LOWER_CATEGORIES,
  UPPER_CATEGORIES,
  type YatzyCategory,
  YATZY_CATEGORY_HELPERS,
} from '../utils/yatzyCategories';
import { Table, Box, Input as ChakraInput } from '@chakra-ui/react';
import { useTranslation, Trans } from 'react-i18next';

interface LowerSectionProps {
  players: string[];
  scores: Record<string, Record<YatzyCategory, string>>;
  onScoreChange: (player: string, category: YatzyCategory, value: string) => void;
  playerColors: Record<string, string>;
  validationErrors?: Record<string, Record<YatzyCategory, string | null>>;
  submitAttempted?: boolean;
  onCategoryInfoClick: (title: string, body: string) => void;
}

export const LowerSection: React.FC<LowerSectionProps> = ({
  players,
  scores,
  onScoreChange,
  playerColors,
  validationErrors,
  submitAttempted,
  onCategoryInfoClick,
}) => {
  const { t } = useTranslation();

  const shouldShowError = (err: string | null, fieldValue: string) => {
    if (!err) return false;
    if (err !== 'Required') return true;
    return submitAttempted || fieldValue.trim() !== '';
  };

  return (
    <>
      <Table.Row>
        <Table.Cell colSpan={players.length + 1} border={0}></Table.Cell>
      </Table.Row>
      {LOWER_CATEGORIES.map((category, idx) => {
        const tooltip = YATZY_CATEGORY_HELPERS[category] || '';
        return (
          <Table.Row key={category}>
            <Table.Cell
              tabIndex={0}
              cursor="pointer"
              border={0}
              onClick={() => {
                if (tooltip) {
                  onCategoryInfoClick(t(category), t(tooltip));
                }
              }}
              aria-label={tooltip ? `Show info for ${category}` : undefined}
              data-testid={`category-info-${category}`}
              title={tooltip}
            >
              <Trans>{category}</Trans>
            </Table.Cell>
            {players.map((player) => {
              const curr = scores[player]?.[category as YatzyCategory];
              const err = validationErrors?.[player]?.[category as YatzyCategory] ?? null;
              const showErr = shouldShowError(err, curr || '');
              return (
                <Table.Cell key={player} color={playerColors[player]} border={0}>
                  <ChakraInput
                    type="number"
                    textAlign="center"
                    min={0}
                    max={50}
                    value={curr ?? ''}
                    onChange={(e) => onScoreChange(player, category as YatzyCategory, e.target.value)}
                    inputMode="numeric"
                    color={playerColors[player]}
                    data-testid={`score-input-row-${idx + 1 + UPPER_CATEGORIES.length}-${player}`}
                    aria-invalid={showErr}
                    aria-describedby={
                      showErr ? `err-${player}-${(category as string).replace(/\s+/g, '-')}` : undefined
                    }
                    size="sm"
                  />
                  {showErr ? (
                    <Box
                      id={`err-${player}-${(category as string).replace(/\s+/g, '-')}`}
                      mt={1}
                      color="red.500"
                      fontSize="xs"
                      role="alert"
                    >
                      {err}
                    </Box>
                  ) : null}
                </Table.Cell>
              );
            })}
          </Table.Row>
        );
      })}
    </>
  );
};
