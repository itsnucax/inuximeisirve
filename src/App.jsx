import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Main from '@/components/Main';
import { Toaster } from '@/components/ui/toaster';
import TelegramButton from '@/components/TelegramButton';

function App() {
  return (
    <React.StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <Main />
          <TelegramButton />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;