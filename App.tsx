
import React from 'react';
import { StatusBar } from 'react-native';

import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

function AppContent() {
  const { isDark } = useAppTheme();

  return (
    <>
      <StatusBar
  barStyle={isDark ? 'light-content' : 'dark-content'}
/>
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
