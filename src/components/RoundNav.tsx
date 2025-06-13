import { Button, Wrap } from '@chakra-ui/react';
import React from 'react';
import { Trans } from 'react-i18next';

interface RoundNavProps {
  rounds: number;
  currentRound: number;
  onGoToRound: (idx: number) => void;
}

export const RoundNav: React.FC<RoundNavProps> = ({ rounds, currentRound, onGoToRound }) => (
  <Wrap mb={4} mt={8}>
    {Array.from({ length: rounds }).map((_, idx) => (
      <Button
        key={idx}
        onClick={() => onGoToRound(idx)}
        fontWeight={idx === currentRound ? 'bold' : undefined}
        mr={1}
        data-testid={`round-btn-${idx}`}
        colorScheme={idx === currentRound ? 'purple' : 'gray'}
        variant={idx === currentRound ? 'solid' : 'outline'}
        size="sm"
      >
        <Trans>Round</Trans> {idx + 1}
      </Button>
    ))}
  </Wrap>
);
