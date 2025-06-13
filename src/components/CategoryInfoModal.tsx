import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react';

interface CategoryInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  body?: string;
}

export const CategoryInfoModal: React.FC<CategoryInfoModalProps> = ({ isOpen, onClose, title, body }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{title}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {body}
        <Button mb={4} mt={4} colorScheme="blue" onClick={onClose} width="100%" data-testid="close-category-info-modal">
          Close
        </Button>
      </ModalBody>
    </ModalContent>
  </Modal>
);
