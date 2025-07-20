import React from 'react';
import { Dialog, Button } from '@chakra-ui/react';
import { Trans } from 'react-i18next';

interface CategoryInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  body?: string;
}

export const CategoryInfoModal: React.FC<CategoryInfoModalProps> = ({ isOpen, onClose, title, body }) => (
  <Dialog.Root
    open={isOpen}
    onOpenChange={(open) => {
      if (!open) onClose();
    }}
    placement="center"
  >
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Content>
        <Dialog.CloseTrigger asChild>
          <Button position="absolute" top={2} right={2} variant="ghost" aria-label="Close" onClick={onClose}>
            X
          </Button>
        </Dialog.CloseTrigger>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>{body}</Dialog.Body>
        <Dialog.Footer>
          <Button variant="subtle" onClick={onClose} data-testid="close-category-info-modal">
            <Trans>Close</Trans>
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Root>
);
