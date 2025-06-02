import React, { useState } from 'react';

interface PlayerFormProps {
  onSubmit: (players: string[]) => void;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({ onSubmit }) => {
  const [names, setNames] = useState<string[]>(['']);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (index: number, value: string) => {
    const updated = [...names];
    updated[index] = value;
    setNames(updated);
    setError(null);
  };

  const addPlayer = () => {
    setNames([...names, '']);
    setError(null);
  };
  const removePlayer = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = names.map((n) => n.trim()).filter(Boolean);
    const hasDuplicates = new Set(filtered).size !== filtered.length;
    if (hasDuplicates) {
      setError('Duplicate player names are not allowed.');
      return;
    }
    if (filtered.length === 0) {
      setError('Please enter at least one player');
      return;
    }
    setError(null);
    onSubmit(filtered);
  };

  return (
    <form onSubmit={handleSubmit} className="player-form" data-testid="player-form">
      <h2>Set players</h2>
      {error && (
        <div style={{ color: 'red', marginBottom: 8 }} data-testid="player-form-error">
          {error}
        </div>
      )}
      {names.map((name, idx) => (
        <div key={idx} className="player-input-row">
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(idx, e.target.value)}
            placeholder={`Player ${idx + 1}`}
            data-testid={`player-input-${idx + 1}`}
          />
          {names.length > 1 && (
            <button type="button" onClick={() => removePlayer(idx)} aria-label="Remove" className="btn-danger">
              ✕
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addPlayer} data-testid="add-player-btn" className="btn-secondary">
        + Add player
      </button>
      <button type="submit" className="btn-primary" data-testid="start-btn">
        Start
      </button>
    </form>
  );
};
