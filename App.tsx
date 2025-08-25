import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// ✅ Import your context provider
import { ConnectionProvider } from './src/api/ConnectionContext';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* ✅ Wrap the app in ConnectionProvider */}
      <ConnectionProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <Toast />
      </ConnectionProvider>
    </SafeAreaProvider>
  );
}

export default App;
