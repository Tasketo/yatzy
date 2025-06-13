import { Box, Button, useColorMode, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { PlayerForm } from './components/PlayerForm';
import { ScoreSheet } from './components/ScoreSheet';
import { Scoreboard } from './components/Scoreboard';
import { RoundNav } from './components/RoundNav';
import { useYatzyGame } from './hooks/useYatzyGame';
import { UPPER_CATEGORIES, LOWER_CATEGORIES } from './utils/yatzyCategories';
import { getRandomColor } from './utils/getRandomColor';
import { ResetConfirmationDialog } from './components/ResetConfirmationDialog';

function App() {
  const {
    players,
    scoresPerRound,
    currentRound,
    playerColors,
    page,
    allFieldsFilled,
    handlePlayersSubmit,
    handleScoreChange,
    handleFinishRound,
    handlePlayNewRound,
    handleGoToRound,
    handleReset,
    setPlayerColors,
  } = useYatzyGame();

  const { colorMode, toggleColorMode } = useColorMode();

  const eyecatcherBg = useColorModeValue(
    'linear-gradient(90deg, #ff9800 0%, #f44336 100%)',
    'linear-gradient(90deg, #ff9800 0%, #8ab4f8 100%)',
  );
  const eyecatcherText = useColorModeValue('white', 'gray.900');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorMode);
  }, [colorMode]);

  // Handler to change player color
  const handlePlayerColorChange = (player: string) => {
    if (!players) return;
    // Exclude current color from available
    const usedColors = Object.values(playerColors).filter((c) => c !== playerColors[player]);
    let newColor = getRandomColor(usedColors);
    // Avoid same color
    while (newColor === playerColors[player] && usedColors.length < 17) {
      newColor = getRandomColor(usedColors);
    }
    setPlayerColors({ ...playerColors, [player]: newColor });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null!); // non-null assertion to satisfy type

  return (
    <Box className="app-container" position="relative">
      <Box
        width="100%"
        borderRadius="1.2em 1.2em 0.2em 0.2em"
        boxShadow="0 4px 24px 0 rgba(244, 67, 54, 0.1)"
        bg={eyecatcherBg}
        color={eyecatcherText}
        fontFamily="'Montserrat', 'Segoe UI', Arial, sans-serif"
        fontSize={{ base: '2xl', md: '2.5rem' }}
        fontWeight={900}
        letterSpacing="0.08em"
        mb={4}
        py={3}
        px={6}
        textAlign="center"
        textShadow="0 2px 8px rgba(0,0,0,0.1)"
        transition="transform 0.2s"
        userSelect="none"
        _hover={{ boxShadow: '0 8px 32px 0 rgba(244, 67, 54, 0.18)', transform: 'scale(1.04) rotate(-2deg)' }}
        className="yatzy-eyecatcher"
        data-testid="eyecatcher"
      >
        Yatzy
      </Box>
      <Button
        className="theme-toggle-btn"
        aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
        onClick={toggleColorMode}
        position="absolute"
        top={4}
        right={6}
        data-testid="theme-toggle-btn"
        variant="ghost"
        fontSize="xl"
      >
        {colorMode === 'light' ? '🌙' : '☀️'}
      </Button>
      {!players ? (
        <PlayerForm onSubmit={handlePlayersSubmit} />
      ) : page === 'game' ? (
        <>
          {scoresPerRound.length > 1 && (
            <RoundNav rounds={scoresPerRound.length} currentRound={currentRound} onGoToRound={handleGoToRound} />
          )}
          <ScoreSheet
            players={players}
            scores={scoresPerRound[currentRound]}
            onScoreChange={handleScoreChange}
            playerColors={playerColors}
            onPlayerColorChange={handlePlayerColorChange}
          />
          <Box mt={6} textAlign="center">
            <Button
              onClick={handleFinishRound}
              data-testid="finish-round-btn"
              colorScheme="purple"
              disabled={!allFieldsFilled}
              size="lg"
            >
              {currentRound === scoresPerRound.length - 1 ? 'Submit' : 'Show Scoreboard'}
            </Button>
          </Box>
        </>
      ) : (
        <Box>
          {scoresPerRound.length > 1 && (
            <RoundNav rounds={scoresPerRound.length} currentRound={currentRound} onGoToRound={handleGoToRound} />
          )}
          <Scoreboard
            players={players}
            rounds={scoresPerRound.map((round) => {
              // Calculate total for each player for this round
              const totals: Record<string, number> = {};
              players.forEach((player) => {
                const upperSum = UPPER_CATEGORIES.map((cat) => parseInt(round[player]?.[cat] || '0', 10)).reduce(
                  (a, b) => a + b,
                  0,
                );
                const bonus = upperSum > 62 ? 35 : 0;
                const lowerSum = LOWER_CATEGORIES.map((cat) => parseInt(round[player]?.[cat] || '0', 10)).reduce(
                  (a, b) => a + b,
                  0,
                );
                totals[player] = upperSum + bonus + lowerSum;
              });
              return totals;
            })}
            playerColors={playerColors}
          />
          <Box mt={6} textAlign="center">
            <Button onClick={handlePlayNewRound} data-testid="play-new-round-btn" colorScheme="blue">
              Play new round
            </Button>
          </Box>
        </Box>
      )}
      {players && (
        <Box mb={5} mt={5} textAlign="center">
          <Button colorScheme="red" variant="outline" data-testid="reset-btn" onClick={onOpen}>
            Reset game
          </Button>
          <ResetConfirmationDialog
            isOpen={isOpen}
            onClose={onClose}
            onReset={() => {
              onClose();
              handleReset();
            }}
            cancelRef={cancelRef}
          />
        </Box>
      )}
    </Box>
  );
}

export default App;
