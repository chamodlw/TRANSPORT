import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Homepage() {
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack(); // Navigates to the previous screen
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
            
            {/* Page Content */}
            <Text style={styles.text}>Welcome to the Homepage!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    backButtonContainer: {
        position: 'absolute',
        top: 50,
        left: 20, // Position the back button at the top-left corner
    },
    text: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
    },
});
