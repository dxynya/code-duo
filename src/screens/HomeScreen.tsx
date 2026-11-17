
import React from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '../context/ThemeContext';
import ActivityCard from '../components/ActivityCard';

// ==========================================
// ACTIVITY ROUTES
// ==========================================

export type ActivityRoute =
  | 'Activity1'
  | 'Activity2'
  | 'Activity3'
  | 'Activity4'
  | 'Activity5';

type Props = {
  navigation: {
    navigate: (
      screen: ActivityRoute | 'Settings'
    ) => void;
  };
};

// ==========================================
// ACTIVITIES
// ==========================================

const activities = [
  {
    number: '01',
    title: 'React Native Basics',
    description: 'Portfolio & state management',
    icon: 'phone-portrait-outline' as const,
    color: '#8658D7',
    route: 'Activity1' as const,
  },
  {
    number: '02',
    title: 'Network Monitor',
    description: 'Connectivity monitoring',
    icon: 'wifi-outline' as const,
    color: '#3D9BC4',
    route: 'Activity2' as const,
  },
  {
    number: '03',
    title: 'Performance',
    description: 'Network diagnostics',
    icon: 'speedometer-outline' as const,
    color: '#DAA052',
    route: 'Activity3' as const,
  },
  {
    number: '04',
    title: 'Local Mesh Chat',
    description: 'Offline messaging',
    icon: 'chatbubbles-outline' as const,
    color: '#D674B9',
    route: 'Activity4' as const,
  },
  {
    number: '05',
    title: 'Geofencing',
    description: 'Custom map & locations',
    icon: 'location-outline' as const,
    color: '#55AE91',
    route: 'Activity5' as const,
  },
];

// ==========================================
// HOME SCREEN
// ==========================================

export default function HomeScreen({
  navigation,
}: Props) {

  const {
    colors,
    isDark,
    toggleTheme,
  } = useAppTheme();

  const { width } = useWindowDimensions();

  // ========================================
  // RESPONSIVE GRID
  // ========================================

  // Small phones = 1 column
  // Normal phones = 2 columns
  // Tablets = 3 columns

  const columns =
    width >= 750
      ? 3
      : width < 360
        ? 1
        : 2;

  const pageWidth = Math.min(
    Math.max(width - 36, 0),
    980
  );

  const gap = 12;

  const cardWidth =
    (pageWidth - gap * (columns - 1)) /
    columns;

  return (

    // ======================================
    // SAFE AREA FIX
    // Prevents overlapping phone status bar
    // ======================================

    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
      edges={['top', 'bottom']}
    >

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.page}>

          {/* ==============================
              TOP NAVIGATION
          ============================== */}

          <View style={styles.topBar}>

            {/* LOGO AND APP NAME */}

            <View style={styles.brand}>

              <View style={styles.logo}>
                <Ionicons
                  name="code-slash"
                  size={24}
                  color="#FFFFFF"
                />
              </View>

              <View style={styles.brandText}>

                <Text
                  style={[
                    styles.brandTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  CODE DUO
                </Text>

                <Text
                  style={[
                    styles.brandSubtitle,
                    {
                      color: colors.subText,
                    },
                  ]}
                >
                  Our Creative Portfolio
                </Text>

              </View>

            </View>

            {/* THEME AND SETTINGS BUTTONS */}

            <View style={styles.actions}>

              <Pressable
                onPress={toggleTheme}
                accessibilityRole="button"
                accessibilityLabel="Toggle light and dark mode"
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >

                <Ionicons
                  name={
                    isDark
                      ? 'sunny-outline'
                      : 'moon-outline'
                  }
                  color={colors.text}
                  size={21}
                />

              </Pressable>

              <Pressable
                onPress={() =>
                  navigation.navigate('Settings')
                }
                accessibilityRole="button"
                accessibilityLabel="Open settings"
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >

                <Ionicons
                  name="settings-outline"
                  color={colors.text}
                  size={21}
                />

              </Pressable>

            </View>

          </View>

          {/* ==============================
              HERO SECTION
          ============================== */}

          <View
            style={[
              styles.hero,
              {
                backgroundColor: colors.hero,
              },
            ]}
          >

            <View style={styles.heroTop}>

              <View style={styles.heroText}>

                <Text style={styles.eyebrow}>
                  WELCOME TO OUR WORKSPACE
                </Text>

                <Text style={styles.heroTitle}>
                  Level Up.
                </Text>

                <Text style={styles.heroHighlight}>
                  Build More. ✦
                </Text>

                <Text style={styles.heroDescription}>
                  Two developers. One creative space.
                  Explore our projects and laboratory
                  activities in one place.
                </Text>

              </View>

              <Ionicons
                name="game-controller-outline"
                size={48}
                color="#F0E2FF"
              />

            </View>

            {/* COLLECTION CARD */}

            <View
              style={[
                styles.progressPanel,
                {
                  backgroundColor: colors.heroInner,
                },
              ]}
            >

              <View style={styles.progressHeader}>

                <Text style={styles.progressLabel}>
                  Our Collection
                </Text>

                <Text style={styles.progressValue}>
                  05 Activities
                </Text>

              </View>

              <View style={styles.progressTrack}>

                <View style={styles.progressFill} />

              </View>

              <Text style={styles.progressNote}>
                Ready to explore our lab activities.
              </Text>

            </View>

          </View>

          {/* ==============================
              ACTIVITIES SECTION
          ============================== */}

          <View style={styles.headingRow}>

            <View style={styles.headingText}>

              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Our Missions
              </Text>

              <Text
                style={[
                  styles.sectionSubtitle,
                  {
                    color: colors.subText,
                  },
                ]}
              >
                Explore our laboratory activities
              </Text>

            </View>

            <View
              style={[
                styles.countPill,
                {
                  backgroundColor:
                    colors.cardSecondary,
                },
              ]}
            >

              <Text
                style={[
                  styles.countText,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                5 TOTAL
              </Text>

            </View>

          </View>

          {/* ==============================
              RESPONSIVE ACTIVITY CARDS
          ============================== */}

          <View style={styles.grid}>

            {activities.map((activity) => (

              <ActivityCard
                key={activity.number}
                width={cardWidth}
                number={activity.number}
                title={activity.title}
                description={activity.description}
                icon={activity.icon}
                iconColor={activity.color}
                onPress={() =>
                  navigation.navigate(
                    activity.route
                  )
                }
              />

            ))}

          </View>

          {/* ==============================
              SETTINGS CARD
          ============================== */}

          <Pressable
            onPress={() =>
              navigation.navigate('Settings')
            }
            accessibilityRole="button"
            accessibilityLabel="Personalize your space"
            style={[
              styles.settingsCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >

            <View
              style={[
                styles.settingsIcon,
                {
                  backgroundColor:
                    colors.cardSecondary,
                },
              ]}
            >

              <Ionicons
                name="color-palette-outline"
                color={colors.primary}
                size={24}
              />

            </View>

            <View style={styles.settingsText}>

              <Text
                style={[
                  styles.settingsTitle,
                  {
                    color: colors.text,
                  },
                ]}
              >
                Personalize Our Space
              </Text>

              <Text
                style={[
                  styles.settingsSub,
                  {
                    color: colors.subText,
                  },
                ]}
              >
                Theme and app settings
              </Text>

            </View>

            <Ionicons
              name="chevron-forward"
              color={colors.subText}
              size={21}
            />

          </Pressable>

          {/* ==============================
              FOOTER
          ============================== */}

          <Text
            style={[
              styles.footer,
              {
                color: colors.subText,
              },
            ]}
          >
            CODE DUO · MADE WITH REACT NATIVE · 2026
          </Text>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 36,
    alignItems: 'center',
  },

  page: {
    width: '100%',
    maxWidth: 980,
  },

  // ========================================
  // TOP BAR
  // ========================================

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },

  brandText: {
    flexShrink: 1,
  },

  logo: {
    width: 42,
    height: 42,
    backgroundColor: '#8658D7',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },

  brandSubtitle: {
    fontSize: 10,
    marginTop: 3,
  },

  actions: {
    flexDirection: 'row',
    gap: 7,
  },

  actionButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ========================================
  // HERO
  // ========================================

  hero: {
    padding: 20,
    borderRadius: 25,
    marginBottom: 25,
  },

  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 22,
  },

  heroText: {
    flex: 1,
  },

  eyebrow: {
    color: '#E8DDFF',
    fontSize: 10,
    letterSpacing: 1.1,
    fontWeight: '800',
    marginBottom: 12,
  },

  heroTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
  },

  heroHighlight: {
    color: '#F1DBFF',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 12,
  },

  heroDescription: {
    color: '#F2E9FF',
    fontSize: 13,
    lineHeight: 20,
  },

  // ========================================
  // COLLECTION PROGRESS
  // ========================================

  progressPanel: {
    padding: 15,
    borderRadius: 17,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },

  progressLabel: {
    color: '#F5EFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  progressValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  progressTrack: {
    height: 7,
    borderRadius: 10,
    backgroundColor: '#9479C5',
    overflow: 'hidden',
  },

  progressFill: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#EBD8FF',
  },

  progressNote: {
    color: '#EEE0FF',
    fontSize: 10,
    marginTop: 9,
  },

  // ========================================
  // SECTION HEADING
  // ========================================

  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },

  headingText: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 23,
    fontWeight: '900',
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },

  countPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  countText: {
    fontSize: 11,
    fontWeight: '800',
  },

  // ========================================
  // ACTIVITY GRID
  // ========================================

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 20,
  },

  // ========================================
  // SETTINGS CARD
  // ========================================

  settingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 19,
    borderWidth: 1,
    padding: 15,
    marginBottom: 24,
  },

  settingsIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },

  settingsText: {
    flex: 1,
  },

  settingsTitle: {
    fontWeight: '800',
    fontSize: 14,
  },

  settingsSub: {
    fontSize: 12,
    marginTop: 5,
  },

  // ========================================
  // FOOTER
  // ========================================

  footer: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 1,
  },

});
