import React, { useState } from 'react';
import { Input, Button, VStack, HStack, Text, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface PlayerFormProps {
  onSubmit: (players: string[]) => void;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
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
      setError(t('Duplicate player names are not allowed.'));
      return;
    }
    if (filtered.length === 0) {
      setError(t('Please enter at least one player'));
      return;
    }
    setError(null);
    onSubmit(filtered);
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      className="player-form"
      data-testid="player-form"
      maxW="sm"
      mx="auto"
      p={4}
      borderRadius="md"
      boxShadow="md"
      bg="whiteAlpha.900"
      _dark={{ bg: 'gray.700' }}
    >
      <Text as="h2" fontSize="xl" fontWeight="bold" mb={2} color="gray.800" _dark={{ color: 'gray.100' }}>
        {t('Set players')}
      </Text>
      {error && (
        <Text color="red.500" mb={2} data-testid="player-form-error">
          {error}
        </Text>
      )}
      <VStack align="stretch">
        {names.map((name, idx) => (
          <HStack key={idx}>
            <Input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(idx, e.target.value)}
              placeholder={t('Player Name') + ` ${idx + 1}`}
              data-testid={`player-input-${idx + 1}`}
              bg="whiteAlpha.800"
              _dark={{ bg: 'gray.800' }}
            />
            {names.length > 1 && (
              <Button
                type="button"
                colorScheme="red"
                size="sm"
                onClick={() => removePlayer(idx)}
                aria-label={t('Remove Player')}
                data-testid={`remove-player-btn-${idx + 1}`}
              >
                -
              </Button>
            )}
          </HStack>
        ))}
        <Button type="button" colorScheme="teal" onClick={addPlayer} mb={2} data-testid="add-player-btn">
          {t('Add Player')}
        </Button>
        <Button type="submit" colorScheme="blue" data-testid="start-btn">
          {t('Start Game')}
        </Button>
      </VStack>
    </Box>
  );
};
