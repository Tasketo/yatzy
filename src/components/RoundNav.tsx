import { Button, Wrap } from '@chakra-ui/react';
import React from 'react';
import { Trans } from 'react-i18next';

interface RoundNavProps {
  rounds: number;
  currentRound: number;
  onGoToRound: (idx: number) => void;
}

const ROUND_BATCH_SIZE = 25;

export const RoundNav: React.FC<RoundNavProps> = ({ rounds, currentRound, onGoToRound }) => {
  const [visibleRoundCount, setVisibleRoundCount] = React.useState(ROUND_BATCH_SIZE);

  return (
    <Wrap mb={4} mt={8}>
      {Array.from({ length: Math.min(rounds, visibleRoundCount) }).map((_, idx) => (
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
      {visibleRoundCount < rounds && (
        <Button
          onClick={() => setVisibleRoundCount((count) => count + ROUND_BATCH_SIZE)}
          data-testid="show-more-round-nav-btn"
          size="sm"
        >
          <Trans>Show more</Trans>
        </Button>
      )}
    </Wrap>
  );
};
