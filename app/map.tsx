import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Correct usage of expo-router
import polyline from '@mapbox/polyline'; // Install this library for decoding polylines

export default function MapDirections() {
    const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number; }[]>([]);
    const [loading, setLoading] = useState(false);
    const { startLong, startLang, endLong, endLang } = useLocalSearchParams() as { [key: string]: string };

    useEffect(() => {
        if (startLong && startLang && endLong && endLang) {
            fetchDirections();
        }
    }, [startLong, startLang, endLong, endLang]);

    const fetchDirections = async () => {
        setLoading(true);
        const startCoordinates = [parseFloat(startLong), parseFloat(startLang)];
        const endCoordinates = [parseFloat(endLong), parseFloat(endLang)];
        console.log("before get direc"+ startCoordinates, endCoordinates);
    
        const apiKey = '5b3ce3597851110001cf62480a979bf9a9b44fb08610d2e36c393870'; // Replace with your OpenRouteService API key
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoordinates[0]},${startCoordinates[1]}&end=${endCoordinates[0]},${endCoordinates[1]}`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
    
            console.log("API Response:", JSON.stringify(data, null, 2));
    
            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
    
                // Check if geometry is encoded or GeoJSON
                if (typeof route.geometry === "string") {
                    // Decode polyline
                    const decodedCoordinates = polyline.decode(route.geometry).map(([lat, lng]) => ({
                        latitude: lat,
                        longitude: lng,
                    }));
                    setRouteCoordinates(decodedCoordinates);
                } else if (route.geometry && route.geometry.coordinates) {
                    // Handle GeoJSON LineString
                    const geoJsonCoordinates = route.geometry.coordinates.map(([lng, lat]: [number, number]) => ({
                        latitude: lat,
                        longitude: lng,
                    }));
                    setRouteCoordinates(geoJsonCoordinates);
                } else {
                    console.error("Unexpected geometry format.");
                }
            } else {
                console.error("No routes found.");
            }
        } catch (error) {
            console.error("Error fetching directions:", error);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: (parseFloat(startLang) + parseFloat(endLang)) / 2, // Center between start and end
                    longitude: (parseFloat(startLong) + parseFloat(endLong)) / 2,
                    latitudeDelta: 5, // Zoom level
                    longitudeDelta: 5,
                }}
            >
                {/* Render the route */}
                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeWidth={4}
                        strokeColor="blue"
                    />
                )}

                {/* Start Marker */}
                <Marker coordinate={{ latitude: parseFloat(startLang), longitude: parseFloat(startLong) }} title="Start" />

                {/* End Marker */}
                <Marker coordinate={{ latitude: parseFloat(endLang), longitude: parseFloat(endLong) }} title="End" />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
