import React, { useRef, useEffect } from 'react';
import {
  LOWER_CATEGORIES,
  UPPER_CATEGORIES,
  type YatzyCategory,
  YATZY_CATEGORY_HELPERS,
} from '../utils/yatzyCategories';
import { CategoryInfoModal } from './CategoryInfoModal';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Input as ChakraInput, Checkbox, useDisclosure } from '@chakra-ui/react';
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
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>
              <Trans>Name</Trans>:
            </Th>
            {players.map((player) => (
              <Th
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
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {/* Upper section */}
          {UPPER_CATEGORIES.map((category, idx) => {
            const tooltip = YATZY_CATEGORY_HELPERS[category] || '';
            return (
              <Tr key={category}>
                <Td
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
                </Td>
                {players.map((player) => {
                  const curr = scores[player]?.[category];
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
                        color={playerColors[player]}
                        data-testid={`score-input-row-${idx + 1}-${player}`}
                        size="sm"
                      />
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
          {/* Sum row */}
          <Tr>
            <Td fontWeight="bold">
              <Trans>Sum</Trans>
            </Td>
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
          <Tr>
            <Td fontStyle="italic">
              <Trans>Bonus</Trans>
            </Td>
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
            <Td colSpan={players.length + 1}></Td>
          </Tr>
          {/* Lower section */}
          {LOWER_CATEGORIES.map((category, idx) => {
            const tooltip = YATZY_CATEGORY_HELPERS[category] || '';
            return (
              <Tr key={category}>
                <Td
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
                </Td>
                {players.map((player) => {
                  const curr = scores[player]?.[category as YatzyCategory];
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
          <Tr>
            <Td fontWeight="bold">
              <Trans>Total</Trans>
            </Td>
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
      {/* Modal for category info */}
      <CategoryInfoModal isOpen={isOpen} onClose={onClose} title={modalInfo?.title} body={modalInfo?.body} />
    </Box>
  );
};
