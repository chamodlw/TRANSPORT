import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Button, TextInput ,Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Homepage() {
    const navigation = useNavigation();
    const [directions, setDirections] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [length, setLength] = useState(null);
    const [time, setTime] = useState(null);
    const [startLong, setStartLong] = useState(0);
    const [startLang, setStartLang] = useState(0);
    const [endLong, setEndLong] = useState(0);
    const [endLang, setEndLang] = useState(0);
    const [startName, setStartName] = useState('');
    const [endName, setEndName] = useState('');

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false, // Disable the header
        });
    }, [navigation]);

    const handleBackPress = () => {
        navigation.goBack(); // Navigates to the previous screen
    };
    
    const handleLanLong = () => {
        //passing town name set to langtitute and longtitude
        const apiKey2 = '5b3ce3597851110001cf62480a979bf9a9b44fb08610d2e36c393870';
        const uri2 = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey2}&text=${startName}`;
        const uri3 = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey2}&text=${endName}`;
        fetch(uri2)
            .then((response) => response.json())
            .then((data) => {
                console.log(startName + "Data fetched");
                setStartLang(data.features[0].geometry.coordinates[1]);
                setStartLong(data.features[0].geometry.coordinates[0]);
            })
            .catch((error) => {
                console.error('Error fetching directions:', error);
            });
        fetch(uri3)
            .then((response) => response.json())
            .then((data) => {
                console.log(endName + "Data fetched");
                setEndLang(data.features[0].geometry.coordinates[1]);
                setEndLong(data.features[0].geometry.coordinates[0]);
            })
        .catch((error) => {
            console.error('Error fetching directions:', error);
        });
};

    const getDirections = async () => {
        setLoading(true);
        const startCoordinates = [startLong, startLang]; // Example: San Francisco (longitude, latitude)
        const endCoordinates = [endLong, endLang]; // Example: Los Angeles
    
        const apiKey = '5b3ce3597851110001cf62480a979bf9a9b44fb08610d2e36c393870'; // Replace with your OpenRouteService API Key
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startCoordinates[0]},${startCoordinates[1]}&end=${endCoordinates[0]},${endCoordinates[1]}`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(startName+" to "+endName+ " Data fetched"); // Log the data to check the response structure
    
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
    const router = useRouter();

    const goToMap = () => {
        // Navigate to homepage
        router.push({
            pathname: '/map',
            params: {
            startLong: startLong,
            startLang: startLang,
            endLong: endLong,
            endLang: endLang,
            },
        });

    };
    return (
        <View style={styles.container}>
            {/* Back Button */}
            <View style={styles.backButtonContainer}>
                <Button
                    title="Back"
                    onPress={handleBackPress}
                    color="#84391A" // Customize button color
                />
                
            </View>
            <View style={styles.body}>
                <Image
                    source={require('../assets/images/transport-circled.png')}
                    style={styles.image}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter start town"
                    value={startName}
                    onChangeText={(text) => setStartName(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter end town"
                    value={endName}
                    onChangeText={(text) => setEndName(text)}
                />
                <View style={styles.button}>
                <Button
                    title="Confirm"
                    onPress={() => handleLanLong()}
                    color="#84391A" // Customize button color
                />
                </View>
                <View style={styles.button}>
                <Button
                    title="Distance & Time"
                    onPress={getDirections}
                    color="#84391A" // Customize button color
                    />
                </View>
                {loading ? (
                    <Text>Loading directions...</Text>
                ) : (
                    <View style={styles.texts}>
                        <View>
                            <Text style={styles.text}>
                                {length !== null ? 'Distance is ' + checkDistance(length) : ''}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.text}>
                                 {time !== null ?'Time is ' + checkTime(time) : ''}
                            </Text>
                        </View>
                    </View>
                )}
                <View style={styles.button}>
                <Button
                    title="Go to Map ➔"
                    onPress={goToMap}
                    color="#84391A" // Customize button color
                    />
                </View>
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
    image: {
        alignSelf: 'center',
        marginBottom: 30,
        marginTop: 160,
        maxHeight: 220,
        maxWidth: 220,
    },
    body: {
    },
    backButtonContainer: {
        position: 'absolute',
        top: 40,
        left: 20, // Position the back button at the top-left corner
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        textShadowColor: '#84391A', // Add stroke
        textShadowOffset: { width: 1, height: 1 }, // Add stroke
        textShadowRadius: 1, // Add stroke
    },
    texts: {
        marginTop: 10,
        marginBottom: 10,
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#84391A',
        borderRadius: 8,
        marginBottom: 16,
    },
    button:{
        marginVertical: 8,
        backgroundColor: '#ffffff',
    }
});

