import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ChakraProvider, Container, defaultSystem } from '@chakra-ui/react';
import './i18n';
import { ColorModeProvider } from './components/ui/color-mode-components.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        <Container>
          <App />
        </Container>
      </ColorModeProvider>
    </ChakraProvider>
  </StrictMode>,
);
