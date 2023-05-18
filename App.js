import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors';
import { trails } from './components/Trails';

export default function App() {
  const [customTrails, setCustomTrails] = useState([]);
  const [addingMarker, setAddingMarker] = useState(false);
  const [customTrailTitle, setCustomTrailTitle] = useState('');
  const [showMarkers, setShowMarkers] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [stepCount, setStepCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  const addCustomMarker = (click) => {
    if (addingMarker) {
      const defaultTrailTitle = customTrailTitle || 'Custom Trail';
      const coordinate = click.nativeEvent.coordinate;
      setCustomTrails([...customTrails, { coordinate, title: defaultTrailTitle }]);
      setAddingMarker(false);
      setCustomTrailTitle('');
    }
  };

  const handleMarkCurrentLocation = async () => {
    await Location.requestForegroundPermissionsAsync();
    const location = await Location.getCurrentPositionAsync({});
    setCurrentLocation(location);
  };

  const startTracking = () => {
    setIsTracking(true);
    Pedometer.watchStepCount(result => setStepCount(result.steps));
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={addCustomMarker}
        initialRegion={{
          latitude: 43.25003410784608,
          longitude: -79.94333715436593,
          latitudeDelta: 0.13,
          longitudeDelta: 0.13,
        }}
      >
        {showMarkers &&
          trails.map((trail, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: trail.latitude, longitude: trail.longitude }}
              title={trail.title}
            />
          ))}
        {showMarkers &&
          customTrails.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.coordinate}
              title={marker.title}
              pinColor='#00ff00'
            />
          ))}
        {showMarkers && currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
            title='Current Location'
            pinColor='#0000FF'
          />
        )}
      </MapView>
      <View style={styles.controlContainer}>
        <View style={styles.controls}>
          <TextInput
            style={styles.input}
            placeholder="Custom Marker Name"
            placeholderTextColor="#808080"
            value={customTrailTitle}
            onChangeText={(text) => setCustomTrailTitle(text)}
          />
        </View>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={() => setAddingMarker(true)}>
            <Text style={styles.buttonText}>Add Trail</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={() => setShowMarkers(!showMarkers)}>
            <Text style={styles.buttonText}>{showMarkers ? 'Hide Markers' : 'Show Markers'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={handleMarkCurrentLocation}>
            <Text style={styles.buttonText}>Mark Location</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={isTracking ? stopTracking : startTracking}>
            <Text style={styles.buttonText}>{isTracking ? 'Stop' : 'Start'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controls}>
          <Text style={styles.stepCount}>Step Count: {stepCount}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    color: '#000000',
  },
  map: {
    flex: 1,
    marginBottom: 10,
  },
  controlContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  controls: {
    width: '49%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stepCount: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
