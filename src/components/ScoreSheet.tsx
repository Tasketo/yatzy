import React from 'react';
import { type YatzyCategory } from '../utils/yatzyCategories';
import { CategoryInfoModal } from './CategoryInfoModal';
import { Table, Box, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { UpperSection } from './UpperSection';
import { SumAndBonusRow } from './SumAndBonusRow';
import { LowerSection } from './LowerSection';
import { TotalRow } from './TotalRow';

interface ScoreSheetProps {
  players: string[];
  scores: Record<string, Record<YatzyCategory, string>>;
  onScoreChange: (player: string, category: YatzyCategory, value: string) => void;
  playerColors: Record<string, string>;
  onPlayerColorChange?: (player: string) => void;
  validationErrors?: Record<
    string,
    Record<YatzyCategory, { reasonKey?: string; messageParams?: Record<string, string | number> } | null>
  >;
  submitAttempted?: boolean;
}

export const ScoreSheet: React.FC<ScoreSheetProps> = ({
  players,
  scores,
  onScoreChange,
  playerColors,
  onPlayerColorChange,
  validationErrors,
  submitAttempted,
}) => {
  const { t } = useTranslation();

  // Modal state for category info
  const { open, onOpen, onClose } = useDisclosure();
  const [modalInfo, setModalInfo] = React.useState<{ title: string; body: string } | null>(null);

  const handleCategoryInfoClick = (title: string, body: string) => {
    setModalInfo({ title, body });
    onOpen();
  };

  return (
    <Box
      data-testid="score-sheet"
      borderRadius="lg"
      boxShadow="md"
      p={1}
      bg="whiteAlpha.900"
      _dark={{ bg: 'gray.900' }}
    >
      <Table.Root size="sm" variant="line">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>{t('Name')}:</Table.ColumnHeader>
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
          <UpperSection
            players={players}
            scores={scores}
            onScoreChange={onScoreChange}
            playerColors={playerColors}
            validationErrors={validationErrors}
            submitAttempted={submitAttempted}
            onCategoryInfoClick={handleCategoryInfoClick}
          />
          <SumAndBonusRow players={players} scores={scores} playerColors={playerColors} />
          <LowerSection
            players={players}
            scores={scores}
            onScoreChange={onScoreChange}
            playerColors={playerColors}
            validationErrors={validationErrors}
            submitAttempted={submitAttempted}
            onCategoryInfoClick={handleCategoryInfoClick}
          />
          <TotalRow players={players} scores={scores} playerColors={playerColors} />
        </Table.Body>
      </Table.Root>
      {/* Modal for category info */}
      <CategoryInfoModal isOpen={open} onClose={onClose} title={modalInfo?.title} body={modalInfo?.body} />
    </Box>
  );
};
