
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

type IconName = React.ComponentProps<
  typeof Ionicons
>['name'];

type Props = {
  number: string;
  title: string;
  description: string;
  icon: IconName;
  iconColor: string;
  width: number;
  onPress: () => void;
};

export default function ActivityCard({
  number,
  title,
  description,
  icon,
  iconColor,
  width,
  onPress,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open ${title}`}
      style={({ pressed }) => [
        styles.card,
        {
          width,
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: iconColor },
          ]}
        >
          <Ionicons
            name={icon}
            color="#FFFFFF"
            size={24}
          />
        </View>

        <Text
          style={[
            styles.number,
            { color: colors.subText },
          ]}
        >
          {number}
        </Text>
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.description,
            { color: colors.subText },
          ]}
        >
          {description}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text
          style={[
            styles.openText,
            { color: colors.primary },
          ]}
        >
          Open activity
        </Text>

        <Ionicons
          name="arrow-forward"
          color={colors.primary}
          size={16}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 196,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'space-between',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  iconBox: {
    width: 47,
    height: 47,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  number: {
    fontSize: 12,
    fontWeight: '800',
  },

  content: {
    marginVertical: 14,
  },

  title: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 7,
  },

  description: {
    fontSize: 12,
    lineHeight: 18,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  openText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
