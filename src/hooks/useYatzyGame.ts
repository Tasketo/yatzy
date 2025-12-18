import { useState, useEffect, useCallback, useMemo } from 'react';
import { type YatzyCategory } from '../utils/yatzyCategories';
import { validateRoundScores } from '../utils/validateScores';
import { getRandomColor } from '../utils/getRandomColor';

// --- Types for improved type safety ---
export type PlayerName = string;
export type PlayerScores = Record<YatzyCategory, string>;
export type RoundScores = Record<PlayerName, PlayerScores>;

const ALL_CATEGORIES: YatzyCategory[] = [
  'Ones',
  'Twos',
  'Threes',
  'Fours',
  'Fives',
  'Sixes',
  'One Pair',
  'Two Pairs',
  'Three of a Kind',
  'Four of a Kind',
  'Small Straight',
  'Large Straight',
  'Full House',
  'Chance',
  'Yatzy',
];

type Page = 'game' | 'scoreboard';

// Initialize state from localStorage
function initializeGameState() {
  const saved = localStorage.getItem('yatzy-state');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      // Validate structure to ensure we have the required fields
      if (
        data &&
        typeof data === 'object' &&
        data.players &&
        Array.isArray(data.players) &&
        data.scoresPerRound &&
        Array.isArray(data.scoresPerRound) &&
        data.playerColors &&
        typeof data.playerColors === 'object'
      ) {
        return {
          players: data.players,
          scoresPerRound: data.scoresPerRound,
          currentRound: data.currentRound || 0,
          playerColors: data.playerColors,
          page: (data.page || 'game') as Page,
        };
      } else {
        console.warn('Invalid localStorage state structure, falling back to initial state');
      }
    } catch (error) {
      console.warn(
        'Failed to load game state from localStorage:',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
  return null;
}

export function useYatzyGame() {
  const initialState = initializeGameState();

  const [players, setPlayers] = useState<PlayerName[] | null>(initialState?.players ?? null);
  const [scoresPerRound, setScoresPerRound] = useState<RoundScores[]>(initialState?.scoresPerRound ?? []);
  const [currentRound, setCurrentRound] = useState<number>(initialState?.currentRound ?? 0);
  const [playerColors, setPlayerColors] = useState<Record<PlayerName, string>>(initialState?.playerColors ?? {});
  const [page, setPage] = useState<Page>(initialState?.page ?? 'game');
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);

  const validationErrors = useMemo(() => {
    if (!players || !scoresPerRound[currentRound]) return {} as Record<string, Record<YatzyCategory, string | null>>;
    const out: Record<string, Record<YatzyCategory, string | null>> = {};
    players.forEach((p) => {
      const playerScores = scoresPerRound[currentRound][p] || ({} as Record<YatzyCategory, string>);
      out[p] = validateRoundScores(playerScores);
    });
    return out;
  }, [players, scoresPerRound, currentRound]);

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
    setSubmitAttempted(false);
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

  const allFieldsValid =
    !!players && players.every((p) => Object.values(validationErrors[p] || {}).every((v) => v === null));

  const handleFinishRound = useCallback(() => {
    setSubmitAttempted(true);
    if (!allFieldsValid) return;
    setPage('scoreboard');
  }, [allFieldsValid]);

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
    setSubmitAttempted(false);
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
    setSubmitAttempted(false);
  }, []);

  return {
    players,
    scoresPerRound,
    currentRound,
    playerColors,
    page,
    validationErrors,
    allFieldsValid,
    submitAttempted,
    handlePlayersSubmit,
    handleScoreChange,
    handleFinishRound,
    handlePlayNewRound,
    handleGoToRound,
    handleReset,
    setPlayerColors,
  };
}
