import { PlayerForm } from './components/PlayerForm';
import { ScoreSheet } from './components/ScoreSheet';
import { Scoreboard } from './components/Scoreboard';
import { RoundNav } from './components/RoundNav';
import { useYatzyGame } from './hooks/useYatzyGame';
import { UPPER_CATEGORIES, LOWER_CATEGORIES } from './utils/yatzyCategories';
import { getRandomColor } from './utils/getRandomColor';
import './App.css';
import { useEffect, useState } from 'react';

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

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

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

  return (
    <div className="app-container">
      <div className="yatzy-eyecatcher">Yatzy</div>
      <button
        className="theme-toggle-btn"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        onClick={toggleTheme}
        style={{ position: 'absolute', top: 18, right: 24 }}
        data-testid="theme-toggle-btn"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      {players && page === 'game' && (
        <button className="btn-danger" data-testid="reset-btn" onClick={handleReset}>
          Reset game
        </button>
      )}
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
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <button
              onClick={handleFinishRound}
              data-testid="finish-round-btn"
              disabled={!allFieldsFilled}
              style={{
                margin: '0 auto',
                display: 'block',
                background: allFieldsFilled ? '#646cff' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5em',
                padding: '0.7em 2em',
                fontSize: '1.1em',
                cursor: allFieldsFilled ? 'pointer' : 'not-allowed',
                opacity: allFieldsFilled ? 1 : 0.7,
              }}
            >
              Submit round & Show scoreboard
            </button>
          </div>
        </>
      ) : (
        <div>
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
                const bonus = upperSum > 62 ? 50 : 0;
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
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <button onClick={handlePlayNewRound} data-testid="play-new-round-btn" className="btn-primary">
              Play new round
            </button>
            <button onClick={handleReset} data-testid="reset-btn-scoreboard" className="btn-danger">
              Reset game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
