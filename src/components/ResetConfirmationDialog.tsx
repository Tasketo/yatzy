import { Dialog, Button } from '@chakra-ui/react';
import { useRef } from 'react';

import { Trans } from 'react-i18next';

interface ResetConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export function ResetConfirmationDialog({ isOpen, onClose, onReset }: ResetConfirmationDialogProps) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <Dialog.Root
      role="alertdialog"
      placement="center"
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      initialFocusEl={() => ref.current}
    >
      <Dialog.Backdrop data-testid="ResetConfirmationDialog" />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header fontSize="lg" fontWeight="bold">
            <Trans>Reset Game</Trans>
          </Dialog.Header>
          <Dialog.Body>
            <Trans>Are you sure you want to reset the game? This will clear all players and scores.</Trans>
          </Dialog.Body>
          <Dialog.Footer>
            <Button ref={ref} onClick={onClose} data-testid="cancel-reset-btn">
              <Trans>Cancel</Trans>
            </Button>
            <Button colorScheme="red" onClick={onReset} ml={3} data-testid="confirm-reset-btn">
              <Trans>Reset</Trans>
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
