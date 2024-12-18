import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import home from '../../components/homepage';

export default function HomeScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleLogin = () => {
    try {
      if (!email && !password) {
        throw new Error('Email and Password are required');
      }
      if (!email) {
        throw new Error('Email is required');
      }
      if (!password) {
        throw new Error('Password is required');
      }
      // Navigate to homepage
      
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
      console.log("Failed to login");
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/transport.jpg')}
        style={styles.image}
      />
      <Text style={styles.title}>YAMAN MACHAN</Text>
      <View style= {styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.signupContainer}>
        <View>
          <Text style={styles.signupText}>Don't have an account?</Text>
        </View>
          <TouchableOpacity>
            <Text style={styles.signupButton}>Sign up</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 25,
  },
  inputContainer: {
    marginHorizontal: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    marginBottom: 15,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#f8650c',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    padding: 12,
    backgroundColor: '#f8650c',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    maxHeight: 370,
    marginBottom: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginHorizontal: 9,
  },
  signupText: {
    fontSize: 13,
  },
  signupButton: {
    fontSize: 12,
    color: '#f8650c',
    marginLeft: 5,
  },
});
