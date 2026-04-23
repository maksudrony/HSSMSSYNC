import './global.css';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types/navigation';
// Importing our screens
import LoadingScreen from './src/screens/LoadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Initialize the Stack Navigator with our strict TypeScript definitions
const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    // SafeAreaProvider calculates the device notch/bezels once at the app root
    <SafeAreaProvider>
      {/* NavigationContainer manages our app's navigation tree and state */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
          
          {/* Registering each screen strictly matching our RootStackParamList */}
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} /> 
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

/* Stack.Navigator defines the actual flow. 
    initialRouteName: Forces the app to start on the Loading screen.
    screenOptions={{ headerShown: false }}: Hides the default ugly top header bar. */
