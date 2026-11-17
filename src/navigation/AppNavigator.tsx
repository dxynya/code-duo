
import React from 'react';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { useAppTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ActivityScreen from '../screens/ActivityScreen';

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Activity1: undefined;
  Activity2: undefined;
  Activity3: undefined;
  Activity4: undefined;
  Activity5: undefined;
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { colors, isDark } = useAppTheme();

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark
        ? DarkTheme.colors
        : DefaultTheme.colors),
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
      notification: colors.accent,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '800',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
          }}
        />

        <Stack.Screen
          name="Activity1"
          options={{ title: 'Activity 1' }}
        >
          {() => (
            <ActivityScreen
              number={1}
              title="React Native Basics"
              description="A multi-screen mobile application with reusable components, responsive layout, and global theme management."
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Activity2"
          options={{ title: 'Activity 2' }}
        >
          {() => (
            <ActivityScreen
              number={2}
              title="Network Monitor"
              description="A workspace for network connectivity and monitoring activities."
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Activity3"
          options={{ title: 'Activity 3' }}
        >
          {() => (
            <ActivityScreen
              number={3}
              title="Network Performance"
              description="A workspace for performance tests and network diagnostics."
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Activity4"
          options={{ title: 'Activity 4' }}
        >
          {() => (
            <ActivityScreen
              number={4}
              title="Local Mesh Chat"
              description="A workspace for offline communication and nearby device features."
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Activity5"
          options={{ title: 'Activity 5' }}
        >
          {() => (
            <ActivityScreen
              number={5}
              title="Geofencing Tracker"
              description="A workspace for custom maps, locations, and geofencing features."
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
