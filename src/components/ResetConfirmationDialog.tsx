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
            Reset Game
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to reset the game? This will clear all players and scores.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} data-testid="cancel-reset-btn">
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onReset} ml={3} data-testid="confirm-reset-btn">
              Reset
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
