
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { colors, isDark, setDarkMode } = useAppTheme();

  const [profileName, setProfileName] =
    useState('Developer');

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Ionicons
          name="settings-outline"
          size={34}
          color={colors.primary}
        />

        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
        >
          Settings
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: colors.subText },
          ]}
        >
          Make your workspace feel like yours.
        </Text>
      </View>

      {/* APPEARANCE */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.sectionHeading}>
          <Ionicons
            name="color-palette-outline"
            color={colors.primary}
            size={23}
          />

          <Text
            style={[
              styles.cardTitle,
              { color: colors.text },
            ]}
          >
            Appearance
          </Text>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.label,
                { color: colors.text },
              ]}
            >
              Dark Mode
            </Text>

            <Text
              style={[
                styles.helper,
                { color: colors.subText },
              ]}
            >
              Switch between Midnight Purple
              and Lavender Light.
            </Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={setDarkMode}
            trackColor={{
              false: '#D4C6F1',
              true: '#8054DF',
            }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View
          style={[
            styles.currentMode,
            {
              backgroundColor:
                colors.cardSecondary,
            },
          ]}
        >
          <Ionicons
            name={
              isDark
                ? 'moon-outline'
                : 'sunny-outline'
            }
            size={20}
            color={colors.primary}
          />

          <Text
            style={{
              color: colors.text,
              fontWeight: '700',
            }}
          >
            {isDark
              ? 'Midnight Purple Active'
              : 'Lavender Light Active'}
          </Text>
        </View>
      </View>

      {/* PROFILE */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.sectionHeading}>
          <Ionicons
            name="person-circle-outline"
            color={colors.primary}
            size={24}
          />

          <Text
            style={[
              styles.cardTitle,
              { color: colors.text },
            ]}
          >
            Profile
          </Text>
        </View>

        <Text
          style={[
            styles.label,
            { color: colors.text },
          ]}
        >
          Your Display Name
        </Text>

        <TextInput
          value={profileName}
          onChangeText={setProfileName}
          maxLength={30}
          placeholder="Enter your name"
          placeholderTextColor={colors.subText}
          style={[
            styles.input,
            {
              backgroundColor:
                colors.cardSecondary,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        <Text
          style={[
            styles.helper,
            {
              color: colors.subText,
              marginTop: 12,
            },
          ]}
        >
          Hello, {profileName || 'Developer'}!
        </Text>
      </View>

      {/* ABOUT */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.sectionHeading}>
          <Ionicons
            name="information-circle-outline"
            size={23}
            color={colors.primary}
          />

          <Text
            style={[
              styles.cardTitle,
              { color: colors.text },
            ]}
          >
            About the App
          </Text>
        </View>

        <Text
          style={[
            styles.helper,
            { color: colors.subText },
          ]}
        >
          DEVSPACE is a React Native portfolio
          application for organizing laboratory
          activities in a responsive, multi-screen
          dashboard.
        </Text>

        <Text
          style={[
            styles.helper,
            {
              color: colors.subText,
              marginTop: 12,
            },
          ]}
        >
          Theme changes are shared across the app
          using React Context API.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 40,
    gap: 18,
  },

  header: {
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },

  title: {
    fontSize: 27,
    fontWeight: '900',
  },

  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },

  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 19,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: '800',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  label: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
  },

  helper: {
    fontSize: 13,
    lineHeight: 20,
  },

  currentMode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    padding: 14,
    marginTop: 17,
  },

  input: {
    borderWidth: 1,
    padding: 13,
    borderRadius: 13,
    fontSize: 15,
    marginTop: 7,
  },
});
