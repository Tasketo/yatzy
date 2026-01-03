import React from 'react';
import { UPPER_CATEGORIES, type YatzyCategory, YATZY_CATEGORY_HELPERS } from '../utils/yatzyCategories';
import { Table, Box, Input as ChakraInput } from '@chakra-ui/react';
import { useTranslation, Trans } from 'react-i18next';

interface UpperSectionProps {
  players: string[];
  scores: Record<string, Record<YatzyCategory, string>>;
  onScoreChange: (player: string, category: YatzyCategory, value: string) => void;
  playerColors: Record<string, string>;
  validationErrors?: Record<
    string,
    Record<YatzyCategory, { reasonKey?: string; messageParams?: Record<string, string | number> } | null>
  >;
  submitAttempted?: boolean;
  onCategoryInfoClick: (title: string, body: string) => void;
}

export const UpperSection: React.FC<UpperSectionProps> = ({
  players,
  scores,
  onScoreChange,
  playerColors,
  validationErrors,
  submitAttempted,
  onCategoryInfoClick,
}) => {
  const { t } = useTranslation();

  const shouldShowError = (
    err: { reasonKey?: string; messageParams?: Record<string, string | number> } | null,
    fieldValue: string,
  ) => {
    if (!err) return false;
    if (err.reasonKey !== 'Required') return true;
    return submitAttempted || fieldValue.trim() !== '';
  };

  const getErrorMessage = (err: { reasonKey?: string; messageParams?: Record<string, string | number> } | null) => {
    if (!err?.reasonKey) return '';
    return t(err.reasonKey, err.messageParams || {});
  };

  return (
    <>
      {UPPER_CATEGORIES.map((category, idx) => {
        const tooltip = YATZY_CATEGORY_HELPERS[category] || '';
        const translatedTooltip = tooltip ? t(tooltip) : '';
        return (
          <Table.Row key={category}>
            <Table.Cell
              tabIndex={0}
              border={0}
              cursor="pointer"
              onClick={() => {
                if (tooltip) {
                  onCategoryInfoClick(t(category), t(tooltip));
                }
              }}
              aria-label={tooltip ? `Show info for ${category}` : undefined}
              data-testid={`category-info-${category}`}
              title={translatedTooltip}
            >
              <Trans>{category}</Trans>
            </Table.Cell>
            {players.map((player) => {
              const curr = scores[player]?.[category];
              const err = validationErrors?.[player]?.[category] ?? null;
              const showErr = shouldShowError(err, curr || '');
              return (
                <Table.Cell key={player} color={playerColors[player]} border={0}>
                  <ChakraInput
                    type="number"
                    textAlign="center"
                    min={0}
                    max={999}
                    value={curr ?? ''}
                    onChange={(e) => onScoreChange(player, category, e.target.value)}
                    inputMode="numeric"
                    color={playerColors[player]}
                    data-testid={`score-input-row-${idx + 1}-${player}`}
                    aria-invalid={showErr}
                    aria-describedby={showErr ? `err-${player}-${category.replace(/\s+/g, '-')}` : undefined}
                    size="sm"
                  />
                  {showErr ? (
                    <Box
                      id={`err-${player}-${category.replace(/\s+/g, '-')}`}
                      mt={1}
                      color="red.500"
                      fontSize="xs"
                      role="alert"
                    >
                      {getErrorMessage(err)}
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
