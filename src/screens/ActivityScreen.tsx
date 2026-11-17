
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

type Props = {
  number: number;
  title: string;
  description: string;
};

export default function ActivityScreen({
  number,
  title,
  description,
}: Props) {
  const { colors } = useAppTheme();

  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('Not Started');

  useEffect(() => {
    if (count > 0) {
      setStatus('In Progress');
    } else {
      setStatus('Not Started');
    }
  }, [count]);

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
          styles.hero,
          { backgroundColor: colors.hero },
        ]}
      >
        <Ionicons
          name="layers-outline"
          size={43}
          color="#FFFFFF"
        />

        <Text style={styles.activityNumber}>
          LABORATORY ACTIVITY {number}
        </Text>

        <Text style={styles.heroTitle}>
          {title}
        </Text>

        <Text style={styles.heroDescription}>
          {description}
        </Text>
      </View>

      {/* STATE DEMONSTRATION */}
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
            styles.heading,
            { color: colors.text },
          ]}
        >
          Interactive Demo
        </Text>

        <Text
          style={[
            styles.description,
            { color: colors.subText },
          ]}
        >
          This button demonstrates local state
          using React's useState and useEffect hooks.
        </Text>

        <View
          style={[
            styles.statusBox,
            {
              backgroundColor:
                colors.cardSecondary,
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              { color: colors.text },
            ]}
          >
            Status: {status}
          </Text>

          <Text
            style={[
              styles.count,
              { color: colors.primary },
            ]}
          >
            {count}
          </Text>

          <Text
            style={{
              color: colors.subText,
              textAlign: 'center',
            }}
          >
            Button Presses
          </Text>
        </View>

        <Pressable
          onPress={() =>
            setCount((previous) => previous + 1)
          }
          style={[
            styles.button,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text
            style={{
              color: colors.buttonText,
              fontWeight: '800',
            }}
          >
            Press Me
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setCount(0)}
          style={[
            styles.resetButton,
            { borderColor: colors.border },
          ]}
        >
          <Text
            style={{
              color: colors.text,
              fontWeight: '700',
            }}
          >
            Reset
          </Text>
        </Pressable>
      </View>

      {/* ACTIVITY DETAILS */}
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
            styles.heading,
            { color: colors.text },
          ]}
        >
          Activity Details
        </Text>

        <Text
          style={[
            styles.description,
            { color: colors.subText },
          ]}
        >
          This screen is part of the React Native
          master compilation application. The actual
          laboratory activity features can be added
          here in future exercises.
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

  hero: {
    borderRadius: 25,
    padding: 22,
    gap: 12,
  },

  activityNumber: {
    color: '#EBDFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },

  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },

  heroDescription: {
    color: '#F3EAFF',
    fontSize: 14,
    lineHeight: 21,
  },

  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
  },

  heading: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },

  statusBox: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 16,
    marginVertical: 14,
    gap: 8,
  },

  label: {
    fontSize: 15,
    fontWeight: '700',
  },

  count: {
    fontSize: 46,
    fontWeight: '900',
  },

  button: {
    padding: 16,
    alignItems: 'center',
    borderRadius: 14,
    marginTop: 8,
  },

  resetButton: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 10,
  },
});
