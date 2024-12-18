import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Homepage() {
    const navigation = useNavigation();
    const [directions, setDirections] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [length, setLength] = useState(null);
    const [time, setTime] = useState(null);
    const [startLong, setStartLong] = useState(-122.4194);
    const [startLang, setStartLang] = useState(37.7749);
    const [endLong, setEndLong] = useState(-118.2437);
    const [endLang, setEndLang] = useState(34.0522);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false, // Disable the header
        });
    }, [navigation]);

    const handleBackPress = () => {
        navigation.goBack(); // Navigates to the previous screen
    };
    
    const handleLanLong = (townName) => {
        //passing town name set to langtitute and longtitude
        const apiKey2 = '5b3ce3597851110001cf62480a979bf9a9b44fb08610d2e36c393870';
        const uri2 = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey2}&text=${townName}`;
    }

    const getDirections = async () => {
        setLoading(true);
        const startCoordinates = [startLong, startLang]; // Example: San Francisco (longitude, latitude)
        const endCoordinates = [endLong, endLang]; // Example: Los Angeles
    
        const apiKey = '5b3ce3597851110001cf62480a979bf9a9b44fb08610d2e36c393870'; // Replace with your OpenRouteService API Key
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoordinates[0]},${startCoordinates[1]}&end=${endCoordinates[0]},${endCoordinates[1]}`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data); // Log the data to check the response structure
    
            if (data.features && data.features.length > 0) {
                // Extract geometry or properties from the first feature
                const route = data.features[0].properties; // Access properties for route data
                const routeSummary = `Distance: ${route.segments[0].distance} meters, Duration: ${route.segments[0].duration} seconds`;
                const routeLength = route.segments[0].distance;
                const routeTime = route.segments[0].duration;

                console.log("Route summary is: ", routeSummary); // Log the route summary
                setLength(routeLength);
                setTime(routeTime);
                setDirections(routeSummary); // Set the route summary with distance and duration
            } else {
                setDirections("No route found.");
            }
        } catch (error) {
            console.error('Error fetching directions:', error); // Log the error
            setDirections("Error fetching directions.");
        } finally {
            setLoading(false);
        }
    };
    //check distance suitable in km or m
    const checkDistance = (distance: number) => {
        if (distance > 1000) {
            return `${(distance / 1000).toFixed(2)} km`;
        } else {
            return `${distance} m`;
        }
    };
    //check time suitable in hours minutes or seconds
    const checkTime = (time: number) => {
        if (time > 3600) {
            return `${(time / 3600).toFixed(2)} hrs`;
        } else if (time > 60) {
            return `${(time / 60).toFixed(2)} min`;
        } else {
            return `${time} s`;
        }
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <View style={styles.backButtonContainer}>
                <Button
                    title="Back"
                    onPress={handleBackPress}
                    color="#f8650c" // Customize button color
                />
            </View>
            <View style={styles.body}>
            <TextInput
                style={styles.input}
                placeholder="Enter start town"
                value=''
                onChangeText={(text) => handleLanLong(parseFloat(text))}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter end town"
                onChangeText={(text) => handleLanLong(parseFloat(text))}
            />
            <Button
                title="handleLanLong"
                onPress={handleLanLong}
                color="#f8650c" // Customize button color
            />
            <Button
                title="Get Directions"
                onPress={getDirections}
                color="#f8650c" // Customize button color
                />
                {loading ? (
                    <Text>Loading directions...</Text>
                ) : (
                    <View>
                        <View>
                            <Text style={styles.text}>
                                Distance is {length !== null ? checkDistance(length) : 'N/A'}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.text}>
                                Time is {time !== null ? checkTime(time) : 'N/A'}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    body: {
    },
    backButtonContainer: {
        position: 'absolute',
        top: 40,
        left: 20, // Position the back button at the top-left corner
    },
    text: {
        fontSize: 18,
        color: '#333',
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
    },
});
