import React from 'react';
import { Button, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return (
    <HStack spacing={2} mb={4} justifyContent="flex-end">
      <Button size="sm" onClick={() => changeLanguage('en')} isActive={i18n.language === 'en'}>
        EN
      </Button>
      <Button size="sm" onClick={() => changeLanguage('de')} isActive={i18n.language === 'de'}>
        DE
      </Button>
    </HStack>
  );
};
