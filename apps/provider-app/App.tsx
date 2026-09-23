import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProviderAuthScreen } from './src/screens/ProviderAuthScreen';
import { DutyDashboardScreen } from './src/screens/DutyDashboardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="ProviderAuth"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0F172A' },
        }}
      >
        <Stack.Screen name="ProviderAuth" component={ProviderAuthScreen} />
        <Stack.Screen name="DutyDashboard" component={DutyDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
