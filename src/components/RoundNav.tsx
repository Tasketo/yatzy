import React from 'react';

interface RoundNavProps {
  rounds: number;
  currentRound: number;
  onGoToRound: (idx: number) => void;
}

export const RoundNav: React.FC<RoundNavProps> = ({ rounds, currentRound, onGoToRound }) => (
  <div style={{ marginBottom: 16, marginTop: 32 }}>
    {Array.from({ length: rounds }).map((_, idx) => (
      <button
        key={idx}
        onClick={() => onGoToRound(idx)}
        style={{
          fontWeight: idx === currentRound ? 'bold' : undefined,
          marginRight: 4,
        }}
        data-testid={`round-btn-${idx}`}
        className="btn-secondary"
      >
        Round {idx + 1}
      </button>
    ))}
  </div>
);
