
import React, {
  useCallback,
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

// =====================================
// TYPES
// =====================================

type Health =
  | 'NOT TESTED'
  | 'TESTING'
  | 'EXCELLENT'
  | 'FAIR'
  | 'POOR'
  | 'DEGRADED';

type Results = {
  idlePing: number;
  downloadSpeed: number;
  downloadPing: number;
  uploadSpeed: number;
  uploadPing: number;
};

const emptyResults: Results = {
  idlePing: 0,
  downloadSpeed: 0,
  downloadPing: 0,
  uploadSpeed: 0,
  uploadPing: 0,
};

const TRACE =
  'https://www.cloudflare.com/cdn-cgi/trace';

const DOWNLOAD =
  'https://speed.cloudflare.com/__down?bytes=1000000';

const UPLOAD =
  'https://speed.cloudflare.com/__up';

// =====================================
// NETWORK TEST FUNCTIONS
// =====================================

function sleep(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}

async function requestWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 20000
) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

// HTTP latency (not ICMP ping)
async function measurePing(): Promise<number | null> {
  const start = Date.now();

  try {
    const response = await requestWithTimeout(
      `${TRACE}?t=${Date.now()}`,
      { cache: 'no-store' },
      10000
    );

    if (!response.ok) return null;

    await response.text();

    return Date.now() - start;
  } catch {
    return null;
  }
}

function average(numbers: number[]) {
  if (numbers.length === 0) return 0;

  return numbers.reduce(
    (total, number) => total + number,
    0
  ) / numbers.length;
}

// =====================================
// IDLE LATENCY
// =====================================

async function testIdlePing() {
  const samples: number[] = [];

  for (let i = 0; i < 2; i++) {
    const latency = await measurePing();

    if (latency !== null) {
      samples.push(latency);
    }

    await sleep(250);
  }

  if (samples.length === 0) {
    throw new Error('Unable to measure idle latency.');
  }

  return average(samples);
}

// =====================================
// CONCURRENT LATENCY
// =====================================

async function testLoadedPing() {
  const samples: number[] = [];

  for (let i = 0; i < 5; i++) {
    const latency = await measurePing();

    if (latency !== null) {
      samples.push(latency);
    }

    await sleep(300);
  }

  if (samples.length === 0) {
    throw new Error('Loaded latency test failed.');
  }

  return average(samples);
}

// =====================================
// DOWNLOAD SPEED + LATENCY
// =====================================

async function testDownload() {
  const loadedPingPromise = testLoadedPing();

  try {
    const start = Date.now();

    const response = await requestWithTimeout(
      `${DOWNLOAD}&t=${Date.now()}`,
      { cache: 'no-store' },
      30000
    );

    if (!response.ok) {
      throw new Error('Download request failed.');
    }

    const data = await response.arrayBuffer();

    const seconds = Math.max(
      (Date.now() - start) / 1000,
      0.001
    );

    const speed =
      (data.byteLength * 8) / seconds / 1000000;

    if (data.byteLength === 0) {
      throw new Error('Download returned no data.');
    }

    const ping = await loadedPingPromise;

    return { speed, ping };
  } catch (error) {
    await loadedPingPromise.catch(() => {});
    throw error;
  }
}

// =====================================
// UPLOAD SPEED + LATENCY
// =====================================

async function testUpload() {
  const uploadBytes = 500000;
  const payload = '0'.repeat(uploadBytes);

  const loadedPingPromise = testLoadedPing();

  try {
    const start = Date.now();

    const response = await requestWithTimeout(
      UPLOAD,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: payload,
      },
      30000
    );

    const seconds = Math.max(
      (Date.now() - start) / 1000,
      0.001
    );

    if (!response.ok) {
      throw new Error('Upload request failed.');
    }

    const speed =
      (uploadBytes * 8) / seconds / 1000000;

    const ping = await loadedPingPromise;

    return { speed, ping };
  } catch (error) {
    await loadedPingPromise.catch(() => {});
    throw error;
  }
}

// =====================================
// ORIGINAL HEALTH CLASSIFICATION
// =====================================

function classifyNetwork(result: Results): Health {
  const averageSpeed =
    (result.downloadSpeed + result.uploadSpeed) / 2;

  const averagePing =
    (
      result.idlePing +
      result.downloadPing +
      result.uploadPing
    ) / 3;

  if (averagePing >= 500 || averageSpeed <= 0) {
    return 'DEGRADED';
  }

  if (averageSpeed > 10) {
    return 'EXCELLENT';
  }

  if (averageSpeed >= 2) {
    return 'FAIR';
  }

  return 'POOR';
}

// =====================================
// ACTIVITY 3
// =====================================

export default function Activity3Screen() {
  const { colors } = useAppTheme();

  const network = Network.useNetworkState();

  const [health, setHealth] =
    useState<Health>('NOT TESTED');

  const [results, setResults] =
    useState<Results>(emptyResults);

  const [testing, setTesting] = useState(false);

  const [phase, setPhase] =
    useState('Waiting for diagnostic');

  const [error, setError] = useState('');

  const [lastTest, setLastTest] = useState('');

  const mounted = useRef(true);
  const busy = useRef(false);

  const runDiagnostic = useCallback(async () => {
    if (busy.current) return;

    busy.current = true;

    if (mounted.current) {
      setTesting(true);
      setHealth('TESTING');
      setPhase('Measuring idle latency...');
      setError('');
      setResults(emptyResults);
    }

    try {
      // STEP 1: IDLE PING
      const idlePing = await testIdlePing();

      if (!mounted.current) return;

      setResults(previous => ({
        ...previous,
        idlePing,
      }));

      // STEP 2: DOWNLOAD + PING
      setPhase('Testing download speed...');

      const download = await testDownload();

      if (!mounted.current) return;

      setResults(previous => ({
        ...previous,
        downloadSpeed: download.speed,
        downloadPing: download.ping,
      }));

      // STEP 3: UPLOAD + PING
      setPhase('Testing upload speed...');

      const upload = await testUpload();

      if (!mounted.current) return;

      const finalResults: Results = {
        idlePing,
        downloadSpeed: download.speed,
        downloadPing: download.ping,
        uploadSpeed: upload.speed,
        uploadPing: upload.ping,
      };

      // STEP 4: CLASSIFICATION
      const classification =
        classifyNetwork(finalResults);

      setResults(finalResults);
      setHealth(classification);
      setPhase('Diagnostic completed');
      setLastTest(new Date().toLocaleTimeString());
    } catch (err) {
      if (!mounted.current) return;

      setResults(emptyResults);
      setHealth('DEGRADED');
      setPhase('Diagnostic failed');
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to complete the network test.'
      );
    } finally {
      busy.current = false;

      if (mounted.current) {
        setTesting(false);
      }
    }
  }, []);

  // =====================================
  // AUTOMATIC TESTING
  // =====================================

  useEffect(() => {
    mounted.current = true;

    // Run automatically when the screen opens.
    runDiagnostic();

    // Repeat every 60 seconds while mounted.
    const timer = setInterval(() => {
      runDiagnostic();
    }, 60000);

    return () => {
      mounted.current = false;
      clearInterval(timer);
    };
  }, [runDiagnostic]);

  const networkName =
    network.isConnected === false
      ? 'OFFLINE'
      : network.isConnected == null
        ? 'CHECKING'
        : String(network.type ?? 'UNKNOWN').toUpperCase();

  // Hide old measurements during testing or degradation.
  const displayedResults =
    health === 'DEGRADED' || health === 'TESTING'
      ? emptyResults
      : results;

  const metrics = [
    {
      title: 'IDLE PING',
      value: displayedResults.idlePing.toFixed(1),
      unit: 'ms',
      icon: 'timer-outline' as const,
    },
    {
      title: 'DOWNLOAD',
      value: displayedResults.downloadSpeed.toFixed(2),
      unit: 'Mbps',
      icon: 'download-outline' as const,
    },
    {
      title: 'DOWNLOAD PING',
      value: displayedResults.downloadPing.toFixed(1),
      unit: 'ms',
      icon: 'speedometer-outline' as const,
    },
    {
      title: 'UPLOAD',
      value: displayedResults.uploadSpeed.toFixed(2),
      unit: 'Mbps',
      icon: 'cloud-upload-outline' as const,
    },
    {
      title: 'UPLOAD PING',
      value: displayedResults.uploadPing.toFixed(1),
      unit: 'ms',
      icon: 'pulse-outline' as const,
    },
  ];

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
          name="speedometer-outline"
          size={42}
          color="#FFFFFF"
        />

        <Text style={styles.headerTitle}>
          Network Diagnostics
        </Text>

        <Text style={styles.headerSubtitle}>
          Dynamic Performance Throttle
        </Text>
      </View>

      {/* NETWORK HEALTH */}

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
          Network Health
        </Text>

        <View style={styles.healthContainer}>
          <View style={[
            styles.healthIcon,
            {
              backgroundColor: colors.cardSecondary,
            },
          ]}>
            <Ionicons
              name={
                health === 'DEGRADED'
                  ? 'warning-outline'
                  : 'pulse-outline'
              }
              size={43}
              color={colors.primary}
            />
          </View>

          <Text style={[
            styles.healthStatus,
            { color: colors.primary },
          ]}>
            {health}
          </Text>

          <Text style={{
            color: colors.subText,
            textAlign: 'center',
            marginTop: 7,
          }}>
            {testing ? phase : `Current Network: ${networkName}`}
          </Text>

          {error ? (
            <Text style={styles.error}>
              {error}
            </Text>
          ) : null}

          {lastTest ? (
            <Text style={{
              color: colors.subText,
              marginTop: 10,
              fontSize: 12,
            }}>
              Last Test: {lastTest}
            </Text>
          ) : null}
        </View>

        <Pressable
          disabled={testing}
          onPress={runDiagnostic}
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: testing ? 0.5 : 1,
            },
          ]}
        >
          <Ionicons
            name="play-outline"
            size={21}
            color={colors.buttonText}
          />

          <Text style={[
            styles.buttonText,
            { color: colors.buttonText },
          ]}>
            {testing
              ? 'TESTING...'
              : 'RUN DIAGNOSTIC NOW'}
          </Text>
        </Pressable>
      </View>

      {/* NETWORK METRICS */}

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
          Network Metrics
        </Text>

        <View style={styles.grid}>
          {metrics.map(metric => (
            <View
              key={metric.title}
              style={[
                styles.metricCard,
                {
                  backgroundColor:
                    colors.cardSecondary,
                },
              ]}
            >
              <Ionicons
                name={metric.icon}
                size={26}
                color={colors.primary}
              />

              <Text style={[
                styles.metricTitle,
                { color: colors.subText },
              ]}>
                {metric.title}
              </Text>

              <Text style={[
                styles.metricValue,
                { color: colors.text },
              ]}>
                {metric.value}
              </Text>

              <Text style={{
                color: colors.primary,
                fontSize: 12,
                fontWeight: '700',
              }}>
                {metric.unit}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* LATENCY DETAILS */}

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
          Latency Details
        </Text>

        {[
          {
            label: 'Idle Ping',
            value:
              `${displayedResults.idlePing.toFixed(1)} ms`,
          },
          {
            label: 'Download Ping',
            value:
              `${displayedResults.downloadPing.toFixed(1)} ms`,
          },
          {
            label: 'Upload Ping',
            value:
              `${displayedResults.uploadPing.toFixed(1)} ms`,
          },
          {
            label: 'Active Network',
            value: networkName,
          },
          {
            label: 'Upload Speed',
            value:
              `${displayedResults.uploadSpeed.toFixed(2)} Mbps`,
          },
        ].map(item => (
          <View
            key={item.label}
            style={[
              styles.detailRow,
              {
                borderBottomColor: colors.border,
              },
            ]}
          >
            <Text style={{
              color: colors.subText,
              flex: 1,
            }}>
              {item.label}
            </Text>

            <Text style={{
              color: colors.text,
              fontWeight: '800',
            }}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      <Text style={{
        color: colors.subText,
        fontSize: 12,
        lineHeight: 19,
      }}>
        Tests run automatically every 60 seconds
        while this screen is mounted. Results are
        based on HTTP transfers and latency, not
        ICMP ping. Values can vary depending on
        the network and test server.
      </Text>

    </ScrollView>
  );
}

// =====================================
// STYLES
// =====================================

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
    fontSize: 27,
    fontWeight: '900',
    textAlign: 'center',
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

  cardTitle: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 16,
  },

  healthContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },

  healthIcon: {
    width: 92,
    height: 92,
    borderRadius: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  healthStatus: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },

  button: {
    marginTop: 17,
    padding: 15,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
  },

  buttonText: {
    fontWeight: '800',
    fontSize: 13,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 11,
  },

  metricCard: {
    width: '47%',
    flexGrow: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 7,
  },

  metricTitle: {
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },

  metricValue: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },

  detailRow: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  error: {
    color: '#E58A9C',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },
});
