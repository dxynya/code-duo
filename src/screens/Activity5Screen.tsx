
import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
} from 'react-native';

import MapView, { Circle, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '../context/ThemeContext';

// ==========================================
// LOCATION TYPE
// ==========================================

type Place = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  custom?: boolean;
};

// ==========================================
// DEFAULT LOCATIONS IN LIANGA
// ==========================================

const DEFAULT_PLACES: Place[] = [
  {
    id: 'home',
    name: 'My House',
    latitude: 8.640187821207665,
    longitude: 126.09038330938166,
  },
  {
    id: 'boarding',
    name: "Friend's Boarding House",
    latitude: 8.63650475617277,
    longitude: 126.09297202249888,
  },
  {
    id: 'point3',
    name: 'Custom Point 3',
    latitude: 8.63024730905172,
    longitude: 126.09420658796834,
  },
  {
    id: 'point4',
    name: 'Custom Point 4',
    latitude: 8.630995559336228,
    longitude: 126.093780459572,
  },
  {
    id: 'point5',
    name: 'Custom Point 5',
    latitude: 8.636747717688802,
    longitude: 126.0944008232226,
  },
  {
    id: 'nemsu',
    name: 'NEMSU - Lianga Campus',
    latitude: 8.633930264696742,
    longitude: 126.09359185999931,
  },
];

const MAP_CENTER = {
  latitude: 8.6357,
  longitude: 126.0930,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

const STORAGE_PLACES = 'codeduo_activity5_places';
const STORAGE_RADIUS = 'codeduo_activity5_radius';

// ==========================================
// DISTANCE CALCULATION
// ==========================================

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (value: number) =>
    (value * Math.PI) / 180;

  const earthRadius = 6371000;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return (
    earthRadius *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}

// ==========================================
// MAIN SCREEN
// ==========================================

export default function Activity5Screen() {
  const { colors } = useAppTheme();

  const mapRef = useRef<MapView>(null);

  const locationSubscription =
    useRef<Location.LocationSubscription | null>(null);

  const currentLocation =
    useRef<Location.LocationObjectCoords | null>(null);

  const previousStatus =
    useRef<Record<string, boolean>>({});

  const mounted = useRef(true);

  const [places, setPlaces] =
    useState<Place[]>(DEFAULT_PLACES);

  const [radius, setRadius] = useState(50);

  const [position, setPosition] =
    useState<Location.LocationObjectCoords | null>(null);

  const [tracking, setTracking] = useState(false);
  const [starting, setStarting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [events, setEvents] = useState<string[]>([]);

  const [message, setMessage] = useState(
    'Tap Start Tracking to check your location.'
  );

  // ==========================================
  // LOCATION FORM STATES
  // ==========================================

  const [modalVisible, setModalVisible] = useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [placeName, setPlaceName] = useState('');
  const [placeLat, setPlaceLat] = useState('');
  const [placeLng, setPlaceLng] = useState('');

  // ==========================================
  // LOAD SAVED LOCATIONS
  // ==========================================

  useEffect(() => {
    mounted.current = true;

    async function loadSavedData() {
      try {
        const savedPlaces =
          await AsyncStorage.getItem(STORAGE_PLACES);

        const savedRadius =
          await AsyncStorage.getItem(STORAGE_RADIUS);

        if (!mounted.current) return;

        if (savedPlaces) {
          const parsed: unknown = JSON.parse(savedPlaces);

          if (Array.isArray(parsed)) {
            const validPlaces = parsed.filter(
              (item): item is Place =>
                item !== null &&
                typeof item === 'object' &&
                typeof item.id === 'string' &&
                typeof item.name === 'string' &&
                typeof item.latitude === 'number' &&
                Number.isFinite(item.latitude) &&
                item.latitude >= -90 &&
                item.latitude <= 90 &&
                typeof item.longitude === 'number' &&
                Number.isFinite(item.longitude) &&
                item.longitude >= -180 &&
                item.longitude <= 180
            );

            setPlaces([
              ...DEFAULT_PLACES,
              ...validPlaces.map(item => ({
                ...item,
                custom: true,
              })),
            ]);
          }
        }

        if (savedRadius !== null) {
          const value = Number(savedRadius);

          if (Number.isFinite(value)) {
            setRadius(
              Math.max(10, Math.min(500, value))
            );
          }
        }
      } catch {
        if (mounted.current) {
          Alert.alert(
            'Storage Error',
            'Unable to load saved locations.'
          );
        }
      } finally {
        if (mounted.current) setLoaded(true);
      }
    }

    void loadSavedData();

    return () => {
      mounted.current = false;
      locationSubscription.current?.remove();
      locationSubscription.current = null;
    };
  }, []);

  // ==========================================
  // SAVE LOCATIONS AND RADIUS
  // ==========================================

  useEffect(() => {
    if (!loaded) return;

    const customPlaces = places.filter(
      place => place.custom
    );

    AsyncStorage.setItem(
      STORAGE_PLACES,
      JSON.stringify(customPlaces)
    ).catch(() => {});
  }, [places, loaded]);

  useEffect(() => {
    if (!loaded) return;

    AsyncStorage.setItem(
      STORAGE_RADIUS,
      String(radius)
    ).catch(() => {});
  }, [radius, loaded]);

  // ==========================================
  // RESET STATUS WHEN RADIUS CHANGES
  // ==========================================

  useEffect(() => {
    const current = currentLocation.current;

    const updated: Record<string, boolean> = {};

    if (current) {
      places.forEach(place => {
        updated[place.id] =
          calculateDistance(
            current.latitude,
            current.longitude,
            place.latitude,
            place.longitude
          ) <= radius;
      });
    }

    previousStatus.current = updated;
  }, [radius, places]);

  // ==========================================
  // HANDLE GPS LOCATION
  // ==========================================

  function handleLocation(
    coords: Location.LocationObjectCoords
  ) {
    currentLocation.current = coords;

    const newEvents: string[] = [];

    places.forEach(place => {
      const distance = calculateDistance(
        coords.latitude,
        coords.longitude,
        place.latitude,
        place.longitude
      );

      const inside = distance <= radius;

      const previous =
        previousStatus.current[place.id];

      if (
        previous !== undefined &&
        previous !== inside
      ) {
        newEvents.push(
          `${inside ? 'ENTERED' : 'EXITED'} ${place.name}`
        );
      }

      previousStatus.current[place.id] = inside;
    });

    if (!mounted.current) return;

    setPosition(coords);

    setMessage(
      `GPS Active • Accuracy ±${Math.round(
        coords.accuracy ?? 0
      )} meters`
    );

    if (newEvents.length > 0) {
      const timestamp =
        new Date().toLocaleTimeString();

      setEvents(previous => [
        ...newEvents.map(
          event => `${timestamp} • ${event}`
        ),
        ...previous,
      ].slice(0, 30));
    }
  }

  // ==========================================
  // START TRACKING
  // ==========================================

  async function startTracking() {
    if (starting || locationSubscription.current) {
      return;
    }

    setStarting(true);
    setMessage('Checking GPS permissions...');

    try {
      const gpsEnabled =
        await Location.hasServicesEnabledAsync();

      if (!gpsEnabled) {
        setMessage('Please enable GPS on your phone.');
        return;
      }

      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        setMessage('Location permission was denied.');
        return;
      }

      const firstLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      if (!mounted.current) return;

      // Establish the initial status without
      // creating false entry/exit events.
      previousStatus.current = {};

      handleLocation(firstLocation.coords);

      const subscription =
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 5,
          },
          update => {
            handleLocation(update.coords);
          }
        );

      if (!mounted.current) {
        subscription.remove();
        return;
      }

      locationSubscription.current = subscription;

      setTracking(true);
    } catch (error) {
      if (mounted.current) {
        setMessage(
          `Unable to start GPS: ${String(error)}`
        );
      }
    } finally {
      if (mounted.current) setStarting(false);
    }
  }

  // ==========================================
  // STOP TRACKING
  // ==========================================

  function stopTracking() {
    locationSubscription.current?.remove();

    locationSubscription.current = null;

    currentLocation.current = null;

    previousStatus.current = {};

    setPosition(null);
    setTracking(false);

    setMessage('Tracking stopped.');
  }

  // ==========================================
  // MAP FUNCTIONS
  // ==========================================

  function focusLocation(
    latitude: number,
    longitude: number
  ) {
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
      500
    );
  }

  function goToMyLocation() {
    if (!position) {
      Alert.alert(
        'GPS',
        'Start tracking first.'
      );
      return;
    }

    focusLocation(
      position.latitude,
      position.longitude
    );
  }

  function handleMapLongPress(
    coordinate: {
      latitude: number;
      longitude: number;
    }
  ) {
    openForm(coordinate);
  }

  // ==========================================
  // LOCATION FORM
  // ==========================================

  function openForm(
    coordinate?: {
      latitude: number;
      longitude: number;
    },
    existing?: Place
  ) {
    setEditingId(existing?.id ?? null);

    setPlaceName(existing?.name ?? '');

    setPlaceLat(
      String(
        existing?.latitude ??
        coordinate?.latitude ??
        ''
      )
    );

    setPlaceLng(
      String(
        existing?.longitude ??
        coordinate?.longitude ??
        ''
      )
    );

    setModalVisible(true);
  }

  function useCurrentGPS() {
    if (!position) {
      Alert.alert(
        'GPS',
        'Start GPS tracking first.'
      );
      return;
    }

    setPlaceLat(String(position.latitude));
    setPlaceLng(String(position.longitude));
  }

  function savePlace() {
    const lat = Number(placeLat.trim());
    const lng = Number(placeLng.trim());

    if (
      !placeName.trim() ||
      !placeLat.trim() ||
      !placeLng.trim() ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      Alert.alert(
        'Invalid Location',
        'Enter a name and valid coordinates.'
      );
      return;
    }

    const newPlace: Place = {
      id: editingId ?? `custom_${Date.now()}`,
      name: placeName.trim(),
      latitude: lat,
      longitude: lng,
      custom: true,
    };

    if (editingId) {
      setPlaces(previous =>
        previous.map(place =>
          place.id === editingId
            ? newPlace
            : place
        )
      );
    } else {
      setPlaces(previous => [
        ...previous,
        newPlace,
      ]);
    }

    setModalVisible(false);
    setEditingId(null);

    focusLocation(lat, lng);
  }

  function deletePlace(place: Place) {
    if (!place.custom) return;

    Alert.alert(
      'Delete Location',
      `Delete ${place.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPlaces(previous =>
              previous.filter(
                item => item.id !== place.id
              )
            );
          },
        },
      ]
    );
  }

  // ==========================================
  // DISTANCE AND STATUS
  // ==========================================

  function getDistance(place: Place) {
    if (!position) return null;

    return calculateDistance(
      position.latitude,
      position.longitude,
      place.latitude,
      place.longitude
    );
  }

  function getInside(place: Place) {
    const distance = getDistance(place);

    return distance !== null && distance <= radius;
  }

  // ==========================================
  // REUSABLE BUTTON
  // ==========================================

  function Button({
    title,
    onPress,
    secondary = false,
    disabled = false,
  }: {
    title: string;
    onPress: () => void;
    secondary?: boolean;
    disabled?: boolean;
  }) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.button,
          {
            backgroundColor: secondary
              ? colors.cardSecondary
              : colors.primary,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Text style={{
          color: secondary ? colors.text : '#FFFFFF',
          fontWeight: '800',
          textAlign: 'center',
        }}>
          {title}
        </Text>
      </Pressable>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <View style={[
      styles.screen,
      { backgroundColor: colors.background },
    ]}>

      {/* GOOGLE MAP */}

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={MAP_CENTER}
          showsUserLocation={tracking}
          showsMyLocationButton={false}
          onLongPress={event =>
            handleMapLongPress(
              event.nativeEvent.coordinate
            )
          }
        >
          {places.map(place => {
            const inside = getInside(place);
            const distance = getDistance(place);

            return (
              <React.Fragment key={place.id}>
                <Circle
                  center={{
                    latitude: place.latitude,
                    longitude: place.longitude,
                  }}
                  radius={radius}
                  strokeWidth={2}
                  strokeColor={
                    inside ? '#36C889' : '#8658D7'
                  }
                  fillColor={
                    inside
                      ? 'rgba(54,200,137,0.16)'
                      : 'rgba(134,88,215,0.15)'
                  }
                />

                <Marker
                  coordinate={{
                    latitude: place.latitude,
                    longitude: place.longitude,
                  }}
                  title={place.name}
                  description={
                    distance === null
                      ? 'Start GPS tracking'
                      : `${inside ? 'INSIDE' : 'OUTSIDE'} • ${distance.toFixed(0)} meters`
                  }
                  pinColor={
                    inside ? '#36C889' : '#8658D7'
                  }
                />
              </React.Fragment>
            );
          })}
        </MapView>

        <Pressable
          onPress={goToMyLocation}
          style={[
            styles.mapButton,
            { backgroundColor: colors.card },
          ]}
        >
          <Ionicons
            name="locate"
            size={25}
            color={colors.primary}
          />
        </Pressable>
      </View>

      {/* SCROLLABLE CONTENT */}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >

        {/* HEADER */}

        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[
              styles.title,
              { color: colors.text },
            ]}>
              Lianga Custom Map
            </Text>

            <Text style={{ color: colors.subText }}>
              {places.length} locations • {radius}m radius
            </Text>
          </View>

          <Ionicons
            name="map-outline"
            size={28}
            color={colors.primary}
          />
        </View>

        {/* GPS TRACKING */}

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
            GPS Tracking
          </Text>

          <Text style={{
            color: colors.subText,
            lineHeight: 21,
            marginBottom: 12,
          }}>
            {message}
          </Text>

          {position && (
            <>
              <Text style={{
                color: colors.text,
                fontSize: 12,
                marginBottom: 8,
              }}>
                {position.latitude.toFixed(6)},{' '}
                {position.longitude.toFixed(6)}
              </Text>

              {(position.accuracy ?? 0) > radius && (
                <Text style={{
                  color: '#E0A45B',
                  fontSize: 12,
                  marginBottom: 8,
                }}>
                  GPS accuracy is larger than the radius.
                  Detection may be unreliable.
                </Text>
              )}
            </>
          )}

          <Button
            title={
              starting
                ? 'STARTING...'
                : tracking
                  ? 'STOP TRACKING'
                  : 'START GPS TRACKING'
            }
            onPress={
              tracking ? stopTracking : startTracking
            }
            disabled={starting}
          />
        </View>

        {/* RADIUS SETTINGS */}

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
            Geofence Radius
          </Text>

          <Text style={[
            styles.radiusValue,
            { color: colors.primary },
          ]}>
            {radius} meters
          </Text>

          <Slider
            minimumValue={10}
            maximumValue={500}
            step={10}
            value={radius}
            onValueChange={value => setRadius(value)}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />

          <View style={styles.between}>
            <Text style={{ color: colors.subText }}>
              10 m
            </Text>

            <Text style={{ color: colors.subText }}>
              500 m
            </Text>
          </View>
        </View>

        {/* ADD LOCATION */}

        <Button
          title="+ ADD CUSTOM LOCATION"
          onPress={() => openForm()}
        />

        <Text style={[
          styles.hint,
          { color: colors.subText },
        ]}>
          Long-press anywhere on the map to add a location.
        </Text>

        {/* LOCATIONS LIST */}

        <Text style={[
          styles.sectionHeading,
          { color: colors.text },
        ]}>
          Saved Locations
        </Text>

        {places.map(place => {
          const distance = getDistance(place);
          const inside = getInside(place);

          return (
            <View
              key={place.id}
              style={[
                styles.locationCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Pressable
                style={styles.locationRow}
                onPress={() =>
                  focusLocation(
                    place.latitude,
                    place.longitude
                  )
                }
              >
                <Ionicons
                  name="location"
                  size={23}
                  color={
                    inside ? '#36C889' : colors.primary
                  }
                />

                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: colors.text,
                    fontWeight: '800',
                  }}>
                    {place.name}
                  </Text>

                  <Text style={{
                    color: colors.subText,
                    fontSize: 12,
                    marginTop: 5,
                  }}>
                    {distance === null
                      ? 'Location not tracked'
                      : `${distance.toFixed(0)} meters away`}
                  </Text>
                </View>

                <Text style={{
                  color: distance === null
                    ? colors.subText
                    : inside
                      ? '#36C889'
                      : '#E0A45B',
                  fontSize: 10,
                  fontWeight: '900',
                }}>
                  {distance === null
                    ? 'UNKNOWN'
                    : inside
                      ? 'INSIDE'
                      : 'OUTSIDE'}
                </Text>
              </Pressable>

              {place.custom && (
                <View style={styles.actions}>
                  <Pressable
                    onPress={() =>
                      openForm(undefined, place)
                    }
                  >
                    <Text style={{
                      color: colors.primary,
                      fontWeight: '800',
                    }}>
                      EDIT
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => deletePlace(place)}
                  >
                    <Text style={{
                      color: '#E58A9C',
                      fontWeight: '800',
                    }}>
                      DELETE
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}

        {/* GEOFENCE EVENTS */}

        <View style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}>
          <View style={styles.row}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.primary}
            />

            <Text style={[
              styles.cardTitle,
              { color: colors.text },
            ]}>
              Geofence Events
            </Text>
          </View>

          {events.length === 0 ? (
            <Text style={{ color: colors.subText }}>
              No entry or exit events detected yet.
            </Text>
          ) : (
            events.map((event, index) => (
              <Text
                key={`${index}-${event}`}
                style={{
                  color: colors.text,
                  fontSize: 12,
                  marginBottom: 10,
                }}
              >
                {event}
              </Text>
            ))
          )}
        </View>

      </ScrollView>

      {/* ADD / EDIT LOCATION MODAL */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalCard,
            { backgroundColor: colors.card },
          ]}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
            >
              <Text style={[
                styles.title,
                { color: colors.text },
              ]}>
                {editingId
                  ? 'Edit Location'
                  : 'Add Custom Location'}
              </Text>

              <Text style={{
                color: colors.subText,
                marginTop: 7,
                marginBottom: 18,
              }}>
                Enter the location name and GPS coordinates.
              </Text>

              <Text style={{
                color: colors.text,
                marginBottom: 6,
              }}>
                Location Name
              </Text>

              <TextInput
                value={placeName}
                onChangeText={setPlaceName}
                placeholder="Enter location name"
                placeholderTextColor={colors.subText}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.cardSecondary,
                    borderColor: colors.border,
                  },
                ]}
              />

              <Text style={{
                color: colors.text,
                marginBottom: 6,
              }}>
                Latitude
              </Text>

              <TextInput
                value={placeLat}
                onChangeText={setPlaceLat}
                keyboardType="decimal-pad"
                placeholder="8.633930"
                placeholderTextColor={colors.subText}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.cardSecondary,
                    borderColor: colors.border,
                  },
                ]}
              />

              <Text style={{
                color: colors.text,
                marginBottom: 6,
              }}>
                Longitude
              </Text>

              <TextInput
                value={placeLng}
                onChangeText={setPlaceLng}
                keyboardType="decimal-pad"
                placeholder="126.093591"
                placeholderTextColor={colors.subText}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.cardSecondary,
                    borderColor: colors.border,
                  },
                ]}
              />

              <Button
                title="USE MY CURRENT GPS"
                secondary
                onPress={useCurrentGPS}
              />

              <Button
                title={
                  editingId
                    ? 'SAVE CHANGES'
                    : 'ADD LOCATION'
                }
                onPress={savePlace}
              />

              <Button
                title="CANCEL"
                secondary
                onPress={() => setModalVisible(false)}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  mapContainer: {
    height: 300,
  },

  map: {
    flex: 1,
  },

  mapButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 21,
    fontWeight: '900',
  },

  sectionHeading: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 5,
  },

  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 17,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
  },

  radiusValue: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: 8,
  },

  between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },

  hint: {
    textAlign: 'center',
    fontSize: 12,
  },

  locationCard: {
    padding: 14,
    borderRadius: 17,
    borderWidth: 1,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 22,
    marginTop: 14,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 20,
  },

  modalCard: {
    maxHeight: '85%',
    borderRadius: 23,
    padding: 20,
  },

  input: {
    borderWidth: 1,
    padding: 13,
    borderRadius: 12,
    marginBottom: 14,
  },
});
