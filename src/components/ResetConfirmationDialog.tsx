import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import type { RefObject } from 'react';
import { Trans } from 'react-i18next';

interface ResetConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  cancelRef: RefObject<HTMLButtonElement>;
}

export function ResetConfirmationDialog({ isOpen, onClose, onReset, cancelRef }: ResetConfirmationDialogProps) {
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay data-testid="ResetConfirmationDialog">
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            <Trans>Reset Game</Trans>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Trans>Are you sure you want to reset the game? This will clear all players and scores.</Trans>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} data-testid="cancel-reset-btn">
              <Trans>Cancel</Trans>
            </Button>
            <Button colorScheme="red" onClick={onReset} ml={3} data-testid="confirm-reset-btn">
              <Trans>Reset</Trans>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
