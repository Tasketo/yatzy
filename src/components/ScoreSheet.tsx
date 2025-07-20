import React, { useRef, useEffect } from 'react';
import {
  LOWER_CATEGORIES,
  UPPER_CATEGORIES,
  type YatzyCategory,
  YATZY_CATEGORY_HELPERS,
} from '../utils/yatzyCategories';
import { CategoryInfoModal } from './CategoryInfoModal';
import { Table, Box, Input as ChakraInput, Checkbox, useDisclosure } from '@chakra-ui/react';
import { useTranslation, Trans } from 'react-i18next';

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
  const { t } = useTranslation();
  // Track previous values for animation
  const prevScores = useRef<Record<string, Record<YatzyCategory, string>>>({});

  useEffect(() => {
    prevScores.current = scores;
  }, [scores]);

  // Modal state for category info
  const { open, onOpen, onClose } = useDisclosure();
  const [modalInfo, setModalInfo] = React.useState<{ title: string; body: string } | null>(null);

  return (
    <Box
      data-testid="score-sheet"
      borderRadius="lg"
      boxShadow="md"
      p={4}
      bg="whiteAlpha.900"
      _dark={{ bg: 'gray.700' }}
    >
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>
              <Trans>Name</Trans>:
            </Table.ColumnHeader>
            {players.map((player) => (
              <Table.ColumnHeader
                key={player}
                color={playerColors[player]}
                textAlign="center"
                fontWeight={700}
                cursor={onPlayerColorChange ? 'pointer' : 'default'}
                onClick={onPlayerColorChange ? () => onPlayerColorChange(player) : undefined}
                title={onPlayerColorChange ? t('Click to change color') : undefined}
                tabIndex={onPlayerColorChange ? 0 : undefined}
                onKeyDown={
                  onPlayerColorChange
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') onPlayerColorChange(player);
                      }
                    : undefined
                }
                aria-label={onPlayerColorChange ? t('Change color for {{player}}', { player }) : undefined}
                data-testid={`player-color-${player}`}
              >
                {player}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {/* Upper section */}
          {UPPER_CATEGORIES.map((category, idx) => {
            const tooltip = YATZY_CATEGORY_HELPERS[category] || '';
            return (
              <Table.Row key={category}>
                <Table.Cell
                  tabIndex={0}
                  style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
                  onClick={() => {
                    if (tooltip) {
                      setModalInfo({ title: t(category), body: t(tooltip) });
                      onOpen();
                    }
                  }}
                  aria-label={tooltip ? `Show info for ${category}` : undefined}
                  data-testid={`category-info-${category}`}
                  title={tooltip}
                >
                  <Trans>{category}</Trans>
                </Table.Cell>
                {players.map((player) => {
                  const curr = scores[player]?.[category];
                  return (
                    <Table.Cell key={player} color={playerColors[player]}>
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
                        size="sm"
                      />
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
          {/* Sum row */}
          <Table.Row>
            <Table.Cell fontWeight="bold">
              <Trans>Sum</Trans>
            </Table.Cell>
            {players.map((player) => {
              const sum = UPPER_CATEGORIES.map((cat) => parseInt(scores[player]?.[cat] || '0', 10)).reduce(
                (a, b) => a + b,
                0,
              );
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
            <Table.Cell fontStyle="italic">
              <Trans>Bonus</Trans>
            </Table.Cell>
            {players.map((player) => {
              const upperSum = UPPER_CATEGORIES.map((cat) => parseInt(scores[player]?.[cat] || '0', 10)).reduce(
                (a, b) => a + b,
                0,
              );
              const hasBonus = upperSum > 62;
              return (
                <Table.Cell key={player} textAlign="center">
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
          <Table.Row>
            <Table.Cell colSpan={players.length + 1}></Table.Cell>
          </Table.Row>
          {/* Lower section */}
          {LOWER_CATEGORIES.map((category, idx) => {
            const tooltip = YATZY_CATEGORY_HELPERS[category] || '';
            return (
              <Table.Row key={category}>
                <Table.Cell
                  tabIndex={0}
                  style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
                  onClick={() => {
                    if (tooltip) {
                      setModalInfo({ title: t(category), body: t(tooltip) });
                      onOpen();
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
                  return (
                    <Table.Cell key={player} color={playerColors[player]}>
                      <ChakraInput
                        type="number"
                        textAlign="center"
                        min={0}
                        max={999}
                        value={curr ?? ''}
                        onChange={(e) => onScoreChange(player, category as YatzyCategory, e.target.value)}
                        inputMode="numeric"
                        color={playerColors[player]}
                        data-testid={`score-input-row-${idx + 1 + UPPER_CATEGORIES.length}-${player}`}
                        size="sm"
                      />
                    </Table.Cell>
                  );
                })}
              </Table.Row>
            );
          })}
          {/* Total row */}
          <Table.Row>
            <Table.Cell fontWeight="bold">
              <Trans>Total</Trans>
            </Table.Cell>
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
        </Table.Body>
      </Table.Root>
      {/* Modal for category info */}
      <CategoryInfoModal isOpen={open} onClose={onClose} title={modalInfo?.title} body={modalInfo?.body} />
    </Box>
  );
};
