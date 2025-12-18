import { useState, useEffect, useCallback } from 'react';
import { LOWER_CATEGORIES, UPPER_CATEGORIES, type YatzyCategory } from '../utils/yatzyCategories';
import { getRandomColor } from '../utils/getRandomColor';

// --- Types for improved type safety ---
export type PlayerName = string;
export type PlayerScores = Record<YatzyCategory, string>;
export type RoundScores = Record<PlayerName, PlayerScores>;

const ALL_CATEGORIES: YatzyCategory[] = [...UPPER_CATEGORIES, ...LOWER_CATEGORIES];

type Page = 'game' | 'scoreboard';

export function useYatzyGame() {
  const [players, setPlayers] = useState<PlayerName[] | null>(null);
  const [scoresPerRound, setScoresPerRound] = useState<RoundScores[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [playerColors, setPlayerColors] = useState<Record<PlayerName, string>>({});
  const [page, setPage] = useState<Page>('game');

  useEffect(() => {
    const saved = localStorage.getItem('yatzy-state');
    if (saved) {
      try {
        const { players, scoresPerRound, playerColors, currentRound, page } = JSON.parse(saved);
        if (players && scoresPerRound && playerColors) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setPlayers(players);
          setScoresPerRound(scoresPerRound);
          setPlayerColors(playerColors);
          setCurrentRound(currentRound || 0);
          setPage(page || 'game');
        }
      } catch {
        // Ignore JSON parse errors and fallback to initial state
      }
    }
  }, []);

  useEffect(() => {
    if (players) {
      localStorage.setItem(
        'yatzy-state',
        JSON.stringify({
          players,
          scoresPerRound,
          playerColors,
          currentRound,
          page,
        }),
      );
    }
  }, [players, scoresPerRound, playerColors, currentRound, page]);

  const handlePlayersSubmit = useCallback((names: PlayerName[]) => {
    setPlayers(names);
    const initialScores: RoundScores = {};
    names.forEach((name) => {
      initialScores[name] = {} as PlayerScores;
      ALL_CATEGORIES.forEach((cat) => {
        initialScores[name][cat] = '';
      });
    });
    setScoresPerRound([initialScores]);
    setCurrentRound(0);
    setPage('game');
    const colors: Record<PlayerName, string> = {};
    const used: string[] = [];
    names.forEach((name) => {
      const color = getRandomColor(used);
      colors[name] = color;
      used.push(color);
    });
    setPlayerColors(colors);
  }, []);

  const handleScoreChange = useCallback(
    (player: PlayerName, category: YatzyCategory, value: string) => {
      setScoresPerRound((prev) => {
        const updated = [...prev];
        updated[currentRound] = {
          ...updated[currentRound],
          [player]: {
            ...updated[currentRound][player],
            [category]: value,
          },
        };
        return updated;
      });
    },
    [currentRound],
  );

  const allFieldsFilled =
    players &&
    scoresPerRound[currentRound] &&
    players.every((player) =>
      ALL_CATEGORIES.every(
        (cat) =>
          scoresPerRound[currentRound][player]?.[cat] !== '' &&
          scoresPerRound[currentRound][player]?.[cat] !== undefined,
      ),
    );

  const handleFinishRound = useCallback(() => {
    setPage('scoreboard');
  }, []);

  const handlePlayNewRound = useCallback(() => {
    if (!players) return;
    const newScores: RoundScores = {};
    players.forEach((name) => {
      newScores[name] = {} as PlayerScores;
      ALL_CATEGORIES.forEach((cat) => {
        newScores[name][cat] = '';
      });
    });
    setScoresPerRound((prev) => [...prev, newScores]);
    setCurrentRound(scoresPerRound.length);
    setPage('game');
  }, [players, scoresPerRound.length]);

  const handleGoToRound = useCallback((idx: number) => {
    setCurrentRound(idx);
    setPage('game');
  }, []);

  const handleReset = useCallback(() => {
    localStorage.removeItem('yatzy-state');
    setPlayers(null);
    setScoresPerRound([]);
    setPlayerColors({});
    setCurrentRound(0);
    setPage('game');
  }, []);

  return {
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
  };
}
