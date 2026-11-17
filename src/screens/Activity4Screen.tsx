
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

export default function Activity4Screen() {
  const { colors } = useAppTheme();

  const [deviceName, setDeviceName] = useState('My Device');

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      contentContainerStyle={styles.container}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <View style={[
          styles.iconBox,
          { backgroundColor: colors.primary },
        ]}>
          <Ionicons
            name="git-network-outline"
            size={30}
            color="#FFFFFF"
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[
            styles.title,
            { color: colors.text },
          ]}>
            Local Mesh Chat
          </Text>

          <Text style={{ color: colors.subText }}>
            Offline peer-to-peer messaging
          </Text>
        </View>
      </View>

      {/* INTRODUCTION */}

      <View style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}>
          My Device
        </Text>

        <Text style={{
          color: colors.subText,
          marginBottom: 12,
        }}>
          Set the name other devices will see.
        </Text>

        <TextInput
          value={deviceName}
          onChangeText={setDeviceName}
          maxLength={20}
          placeholder="Enter device name"
          placeholderTextColor={colors.subText}
          style={[
            styles.input,
            {
              backgroundColor: colors.cardSecondary,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        <View style={styles.statusRow}>
          <View style={styles.dot} />

          <Text style={{
            color: colors.subText,
            fontWeight: '700',
          }}>
            Native connection unavailable
          </Text>
        </View>
      </View>

      {/* NEARBY DEVICES */}

      <View style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}>
        <View style={styles.row}>
          <Ionicons
            name="radio-outline"
            size={23}
            color={colors.primary}
          />

          <Text style={[
            styles.sectionTitle,
            { color: colors.text },
          ]}>
            Nearby Devices
          </Text>
        </View>

        <View style={styles.empty}>
          <Ionicons
            name="phone-portrait-outline"
            size={45}
            color={colors.subText}
          />

          <Text style={{
            color: colors.text,
            fontWeight: '800',
            marginTop: 12,
          }}>
            No devices connected
          </Text>

          <Text style={{
            color: colors.subText,
            textAlign: 'center',
            marginTop: 7,
            lineHeight: 20,
          }}>
            Device discovery will be enabled after
            the compatible Android native module
            is integrated.
          </Text>
        </View>
      </View>

      {/* MESH CHAT */}

      <View style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}>
        <View style={styles.row}>
          <Ionicons
            name="chatbubbles-outline"
            size={23}
            color={colors.primary}
          />

          <Text style={[
            styles.sectionTitle,
            { color: colors.text },
          ]}>
            Mesh Chat
          </Text>
        </View>

        <View style={[
          styles.messageArea,
          { backgroundColor: colors.cardSecondary },
        ]}>
          <Ionicons
            name="chatbox-ellipses-outline"
            size={40}
            color={colors.primary}
          />

          <Text style={{
            color: colors.text,
            fontWeight: '800',
            marginTop: 10,
          }}>
            Waiting for mesh connection
          </Text>

          <Text style={{
            color: colors.subText,
            textAlign: 'center',
            marginTop: 6,
          }}>
            Messages will appear here once devices
            are connected.
          </Text>
        </View>

        <View style={[
          styles.notice,
          { borderColor: colors.border },
        ]}>
          <Ionicons
            name="information-circle-outline"
            color={colors.primary}
            size={21}
          />

          <Text style={{
            flex: 1,
            color: colors.subText,
            fontSize: 12,
            lineHeight: 19,
          }}>
            This screen is a temporary UI while the
            offline peer-to-peer connection is being
            integrated.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 40,
    gap: 17,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginBottom: 5,
  },

  iconBox: {
    width: 55,
    height: 55,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
  },

  card: {
    padding: 17,
    borderRadius: 20,
    borderWidth: 1,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderRadius: 13,
    padding: 14,
    fontSize: 15,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 15,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 10,
    backgroundColor: '#E0A45B',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  empty: {
    alignItems: 'center',
    paddingVertical: 25,
  },

  messageArea: {
    borderRadius: 16,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 10,
  },

  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 13,
    padding: 12,
    marginTop: 15,
  },
});
