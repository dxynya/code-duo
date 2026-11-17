
import React, { useState } from 'react';

import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

export default function Activity1Screen() {
  const { colors, isDark, toggleTheme } = useAppTheme();

  const [count, setCount] = useState(0);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      contentContainerStyle={styles.container}
    >

      {/* ACTIVITY HEADER */}

      <View
        style={[
          styles.header,
          { backgroundColor: colors.hero },
        ]}
      >
        <Ionicons
          name="phone-portrait-outline"
          size={40}
          color="#FFFFFF"
        />

        <Text style={styles.headerTitle}>
          Activity 1
        </Text>

        <Text style={styles.headerSubtitle}>
          Portfolio & State Management
        </Text>
      </View>

      {/* GLOBAL THEME CONTROL */}

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.row}>
          <View
            style={[
              styles.iconBox,
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
              size={25}
              color={colors.primary}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.cardTitle,
                { color: colors.text },
              ]}
            >
              App Appearance
            </Text>

            <Text
              style={{
                color: colors.subText,
                marginTop: 4,
              }}
            >
              {isDark
                ? 'Midnight Purple'
                : 'Lavender Light'}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.description,
            { color: colors.subText },
          ]}
        >
          Switch between Dark and Light Mode.
          The selected theme automatically
          applies to the entire Code Duo app.
        </Text>

        <Pressable
          onPress={toggleTheme}
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Ionicons
            name="color-palette-outline"
            size={20}
            color={colors.buttonText}
          />

          <Text
            style={{
              color: colors.buttonText,
              fontWeight: '800',
            }}
          >
            SWITCH THEME
          </Text>
        </Pressable>
      </View>

      {/* LOCAL STATE DEMONSTRATION */}

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: colors.text },
          ]}
        >
          Local State Counter
        </Text>

        <Text
          style={[
            styles.description,
            { color: colors.subText },
          ]}
        >
          Tap the button to update the counter
          using React useState.
        </Text>

        <View
          style={[
            styles.counterBox,
            {
              backgroundColor:
                colors.cardSecondary,
            },
          ]}
        >
          <Text
            style={[
              styles.counter,
              { color: colors.primary },
            ]}
          >
            {count}
          </Text>

          <Text style={{ color: colors.subText }}>
            Total Taps
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            onPress={() =>
              setCount(previous => previous + 1)
            }
            style={[
              styles.smallButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <Ionicons
              name="add"
              size={21}
              color={colors.buttonText}
            />

            <Text
              style={{
                color: colors.buttonText,
                fontWeight: '800',
              }}
            >
              INCREMENT
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setCount(0)}
            style={[
              styles.smallButton,
              {
                backgroundColor:
                  colors.cardSecondary,
              },
            ]}
          >
            <Ionicons
              name="refresh-outline"
              size={20}
              color={colors.text}
            />

            <Text
              style={{
                color: colors.text,
                fontWeight: '800',
              }}
            >
              RESET
            </Text>
          </Pressable>
        </View>
      </View>

      {/* FEATURE STATUS */}

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: colors.text },
          ]}
        >
          App Features
        </Text>

        {[
          'Multi-Screen Navigation',
          'Responsive Dashboard',
          'Reusable Components',
          'Global Theme Management',
          'Local State Interaction',
        ].map(feature => (
          <View
            key={feature}
            style={styles.featureRow}
          >
            <Ionicons
              name="checkmark-circle"
              size={21}
              color={colors.primary}
            />

            <Text
              style={{
                color: colors.text,
                flex: 1,
              }}
            >
              {feature}
            </Text>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 40,
    gap: 16,
  },

  header: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
  },

  headerSubtitle: {
    color: '#EFE1FF',
    fontSize: 14,
    textAlign: 'center',
  },

  card: {
    borderWidth: 1,
    borderRadius: 21,
    padding: 18,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: '800',
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    marginVertical: 16,
  },

  button: {
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },

  counterBox: {
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    marginBottom: 15,
  },

  counter: {
    fontSize: 48,
    fontWeight: '900',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },

  smallButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 13,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 10,
  },
});