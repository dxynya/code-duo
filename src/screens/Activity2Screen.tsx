
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as Network from 'expo-network';

import { useAppTheme } from '../context/ThemeContext';

type RequestStatus =
  | 'idle'
  | 'running'
  | 'queued'
  | 'completed';

export default function Activity2Screen() {
  const { colors } = useAppTheme();
  const network = Network.useNetworkState();

  const [progress, setProgress] = useState(0);

  const [status, setStatus] =
    useState<RequestStatus>('idle');

  const [logs, setLogs] = useState<string[]>([]);

  const previousNetwork = useRef<string | null>(null);
  const firstCheck = useRef(true);

  const networkKnown = network.isConnected != null;
  const connected = network.isConnected === true;

  const networkType = String(
    network.type ?? 'UNKNOWN'
  ).toUpperCase();

  const currentNetwork = !networkKnown
    ? 'CHECKING'
    : connected
      ? networkType
      : 'OFFLINE';

  // =====================================
  // EVENT LOG
  // =====================================

  function addLog(message: string) {
    const time = new Date().toLocaleTimeString();

    setLogs(previous =>
      [`${time} • ${message}`, ...previous]
        .slice(0, 10)
    );
  }

  // =====================================
  // MONITOR NETWORK CHANGES
  // =====================================

  useEffect(() => {
    if (!networkKnown) return;

    if (previousNetwork.current === currentNetwork) {
      return;
    }

    if (firstCheck.current) {
      addLog(`Current network: ${currentNetwork}`);
      firstCheck.current = false;
    } else {
      addLog(`Network changed: ${currentNetwork}`);
    }

    previousNetwork.current = currentNetwork;
  }, [currentNetwork, networkKnown]);

  // =====================================
  // CONNECTION HANDOVER AND RECOVERY
  // =====================================

  useEffect(() => {
    if (!networkKnown) return;

    // Connection lost while request is running
    if (!connected && status === 'running') {
      setStatus('queued');

      addLog('Connection lost during request.');
      addLog('Request queued for recovery.');
    }

    // Connection restored while request is queued
    if (connected && status === 'queued') {
      setStatus('running');

      addLog(
        `Connection restored. Resuming from ${progress}%.`
      );
    }
  }, [connected, networkKnown, status]);

  // =====================================
  // SIMULATED DATASET REQUEST
  // =====================================

  useEffect(() => {
    if (status !== 'running' || !connected) {
      return;
    }

    const timer = setInterval(() => {
      setProgress(previous =>
        Math.min(previous + 10, 100)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [status, connected]);

  // =====================================
  // REQUEST COMPLETION
  // =====================================

  useEffect(() => {
    if (progress !== 100 || status !== 'running') {
      return;
    }

    setStatus('completed');
    addLog('Request completed successfully.');
  }, [progress, status]);

  // =====================================
  // START REQUEST
  // =====================================

  function startRequest() {
    if (status === 'running' || status === 'queued') {
      return;
    }

    setProgress(0);

    if (!networkKnown || !connected) {
      setStatus('queued');
      addLog('No connection. Request placed in queue.');
      return;
    }

    setStatus('running');
    addLog('Large dataset request started.');
  }

  // =====================================
  // RESET REQUEST
  // =====================================

  function resetRequest() {
    setStatus('idle');
    setProgress(0);
    addLog('Request reset.');
  }

  // =====================================
  // NETWORK ICON
  // =====================================

  const networkIcon =
    !connected
      ? 'wifi-outline'
      : networkType === 'WIFI'
        ? 'wifi'
        : networkType === 'CELLULAR'
          ? 'cellular'
          : 'globe-outline';

  const statusText = {
    idle: 'IDLE',
    running: 'DOWNLOADING',
    queued: 'QUEUED',
    completed: 'COMPLETED',
  }[status];

  // =====================================
  // USER INTERFACE
  // =====================================

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <View style={[
        styles.header,
        { backgroundColor: colors.hero },
      ]}>
        <Ionicons
          name="wifi-outline"
          size={38}
          color="#FFFFFF"
        />

        <Text style={styles.headerTitle}>
          Network Monitor
        </Text>

        <Text style={styles.headerSubtitle}>
          Live Connection & Handover Handling
        </Text>
      </View>

      {/* CURRENT NETWORK */}

      <View style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}>

        <Text style={[
          styles.cardTitle,
          { color: colors.text },
        ]}>
          Current Active Network
        </Text>

        <View style={styles.networkContainer}>

          <View style={[
            styles.networkIcon,
            {
              backgroundColor:
                colors.cardSecondary,
            },
          ]}>
            <Ionicons
              name={networkIcon}
              size={43}
              color={colors.primary}
            />
          </View>

          <Text style={[
            styles.networkName,
            { color: colors.primary },
          ]}>
            {currentNetwork}
          </Text>

          <Text style={{
            color: colors.subText,
            textAlign: 'center',
          }}>
            {!networkKnown
              ? 'Checking connection...'
              : connected
                ? 'Connection available'
                : 'No active connection'}
          </Text>

        </View>

        <View style={[
          styles.connectionInfo,
          {
            backgroundColor:
              colors.cardSecondary,
          },
        ]}>
          <View style={styles.infoRow}>
            <Text style={{ color: colors.subText }}>
              Connection
            </Text>

            <Text style={{
              color: colors.text,
              fontWeight: '800',
            }}>
              {connected ? 'Online' : 'Offline'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={{ color: colors.subText }}>
              Internet Reachable
            </Text>

            <Text style={{
              color: colors.text,
              fontWeight: '800',
            }}>
              {network.isInternetReachable == null
                ? 'Unknown'
                : network.isInternetReachable
                  ? 'Yes'
                  : 'No'}
            </Text>
          </View>
        </View>

      </View>

      {/* REQUEST QUEUE */}

      <View style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}>

        <Text style={[
          styles.cardTitle,
          { color: colors.text },
        ]}>
          Request Queue
        </Text>

        <View style={styles.statusRow}>
          <Ionicons
            name={
              status === 'running'
                ? 'cloud-download-outline'
                : status === 'queued'
                  ? 'time-outline'
                  : status === 'completed'
                    ? 'checkmark-circle-outline'
                    : 'pause-circle-outline'
            }
            size={25}
            color={colors.primary}
          />

          <Text style={[
            styles.requestStatus,
            { color: colors.primary },
          ]}>
            {statusText}
          </Text>
        </View>

        {/* PROGRESS */}

        <View style={[
          styles.progressTrack,
          {
            backgroundColor:
              colors.cardSecondary,
          },
        ]}>
          <View style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: `${progress}%`,
            },
          ]} />
        </View>

        <Text style={[
          styles.progressText,
          { color: colors.text },
        ]}>
          {progress}%
        </Text>

        <Text style={[
          styles.progressDescription,
          { color: colors.subText },
        ]}>
          {status === 'running'
            ? 'Processing simulated dataset...'
            : status === 'queued'
              ? 'Waiting for connection recovery'
              : status === 'completed'
                ? 'Request completed successfully'
                : 'Ready to start request'}
        </Text>

        {/* START BUTTON */}

        <Pressable
          disabled={
            status === 'running' ||
            status === 'queued'
          }
          onPress={startRequest}
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity:
                status === 'running' ||
                status === 'queued'
                  ? 0.5
                  : 1,
            },
          ]}
        >
          <Ionicons
            name="cloud-download-outline"
            size={20}
            color={colors.buttonText}
          />

          <Text style={[
            styles.buttonText,
            { color: colors.buttonText },
          ]}>
            {status === 'running'
              ? 'REQUEST RUNNING'
              : status === 'queued'
                ? 'WAITING FOR CONNECTION'
                : status === 'completed'
                  ? 'START AGAIN'
                  : 'START LARGE REQUEST'}
          </Text>
        </Pressable>

        {/* RESET BUTTON */}

        <Pressable
          onPress={resetRequest}
          style={[
            styles.resetButton,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons
            name="refresh-outline"
            size={19}
            color={colors.text}
          />

          <Text style={{
            color: colors.text,
            fontWeight: '800',
          }}>
            RESET
          </Text>
        </Pressable>

      </View>

      {/* EVENT LOG */}

      <View style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}>

        <View style={styles.logHeader}>
          <Text style={[
            styles.cardTitle,
            { color: colors.text },
          ]}>
            Event Log
          </Text>

          <Pressable onPress={() => setLogs([])}>
            <Ionicons
              name="trash-outline"
              size={23}
              color={colors.primary}
            />
          </Pressable>
        </View>

        {logs.length === 0 ? (
          <Text style={{ color: colors.subText }}>
            No events yet.
          </Text>
        ) : (
          logs.map((log, index) => (
            <View
              key={`${index}-${log}`}
              style={[
                styles.logItem,
                {
                  backgroundColor:
                    colors.cardSecondary,
                },
              ]}
            >
              <Text style={[
                styles.logText,
                { color: colors.text },
              ]}>
                {log}
              </Text>
            </View>
          ))
        )}

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
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    gap: 10,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
  },

  headerSubtitle: {
    color: '#EFE1FF',
    fontSize: 14,
    textAlign: 'center',
  },

  card: {
    padding: 18,
    borderRadius: 21,
    borderWidth: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 15,
  },

  networkContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },

  networkIcon: {
    width: 95,
    height: 95,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  networkName: {
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 7,
  },

  connectionInfo: {
    borderRadius: 15,
    padding: 15,
    marginTop: 12,
    gap: 12,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },

  requestStatus: {
    fontSize: 22,
    fontWeight: '900',
  },

  progressTrack: {
    height: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
  },

  progressText: {
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 18,
  },

  progressDescription: {
    textAlign: 'center',
    fontSize: 13,
    marginBottom: 20,
    marginTop: 5,
  },

  button: {
    padding: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },

  buttonText: {
    fontWeight: '800',
    fontSize: 13,
  },

  resetButton: {
    marginTop: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logItem: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },

  logText: {
    fontSize: 12,
    lineHeight: 19,
  },

});
