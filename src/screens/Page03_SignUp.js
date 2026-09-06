import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import StatusBarMock from '../components/StatusBarMock';
import Header from '../components/Header';

const API_URL = 'https://eye-healthcare-backend.vercel.app';

export default function Page03_SignUp({ onNavigate, userRole }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // ==============================
    // Validation
    // ==============================

    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter your name, email and password.'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Invalid Password',
        'Password must be at least 6 characters long.'
      );
      return;
    }

    // ==============================
    // Determine User Role
    // ==============================

    const role = userRole === 'Doctor' ? 'Doctor' : 'Patient';

    try {
      setLoading(true);

      console.log('=================================');
      console.log('Registration started');
      console.log('Name:', name.trim());
      console.log('Email:', email.trim().toLowerCase());
      console.log('Role:', role);
      console.log('=================================');

      // ==============================
      // Register API
      // ==============================

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            role: role,

            // Doctor default information
            ...(role === 'Doctor'
              ? {
                  specialization: 'Ophthalmologist',
                  hospital: 'Vision Eye Care Center',
                }
              : {}),
          }),
        }
      );

      const data = await response.json();

      console.log('Registration response:', data);

      // ==============================
      // Registration Failed
      // ==============================

      if (!response.ok) {
        Alert.alert(
          'Sign Up Failed',
          data.message || 'Unable to create account.'
        );
        return;
      }

      // ==============================
      // Validate Backend Response
      // ==============================

      if (!data._id || !data.token || !data.role) {
        Alert.alert(
          'Registration Error',
          'Invalid response received from server.'
        );
        return;
      }

      // ==============================
      // Save User Data
      // ==============================

      await AsyncStorage.setItem(
        'user',
        JSON.stringify(data)
      );

      // Save JWT token
      await AsyncStorage.setItem(
        'token',
        data.token
      );

      console.log('=================================');
      console.log('Registration successful');
      console.log('User ID:', data._id);
      console.log('User Name:', data.name);
      console.log('User Role:', data.role);
      console.log('Token saved');
      console.log('=================================');

      // ==============================
      // Doctor Registration
      // ==============================

      if (data.role === 'Doctor') {
        Alert.alert(
          'Account Created',
          'Doctor account created successfully.',
          [
            {
              text: 'Continue',
              onPress: () => {
                onNavigate('Page15_DoctorHome', {
                  role: 'Doctor',
                  doctorId: data._id,
                });
              },
            },
          ]
        );

        return;
      }

      // ==============================
      // Patient Registration
      // ==============================

      if (data.role === 'Patient') {
        Alert.alert(
          'Account Created',
          'Your account has been created successfully.',
          [
            {
              text: 'Continue',
              onPress: () => {
                onNavigate('Page05_PatientHome', {
                  role: 'Patient',
                });
              },
            },
          ]
        );

        return;
      }

      // ==============================
      // Unknown Role
      // ==============================

      Alert.alert(
        'Registration Error',
        'Unknown user role.'
      );

    } catch (error) {
      console.error(
        'Registration error:',
        error
      );

      Alert.alert(
        'Connection Error',
        'Cannot connect to the backend server.\n\nPlease make sure the backend server is running on port 5000.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarMock />

      <Header
        title="Sign Up"
        onBack={() =>
          onNavigate('Page02_Welcome')
        }
      />

      <View style={styles.content}>

        {/* ==============================
            Name Input
        ============================== */}

        <View style={styles.inputContainer}>
          <User
            size={20}
            color="#94A3B8"
            style={styles.inputIcon}
          />

          <TextInput
            style={styles.textInput}
            placeholder="Enter your name"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        {/* ==============================
            Email Input
        ============================== */}

        <View style={styles.inputContainer}>
          <Mail
            size={20}
            color="#94A3B8"
            style={styles.inputIcon}
          />

          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* ==============================
            Password Input
        ============================== */}

        <View style={styles.inputContainer}>
          <Lock
            size={20}
            color="#94A3B8"
            style={styles.inputIcon}
          />

          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor="#94A3B8"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={() =>
              setShowPassword(!showPassword)
            }
            style={styles.eyeIcon}
          >
            {showPassword ? (
              <Eye
                size={20}
                color="#94A3B8"
              />
            ) : (
              <EyeOff
                size={20}
                color="#94A3B8"
              />
            )}
          </TouchableOpacity>
        </View>

        {/* ==============================
            Sign Up Button
        ============================== */}

        <TouchableOpacity
          style={[
            styles.signUpButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleSignUp}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.signUpButtonText}>
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        {/* ==============================
            Footer Link
        ============================== */}

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            Don’t have an account?{' '}
          </Text>

          <TouchableOpacity
            onPress={() =>
              onNavigate('Page04_SignIn')
            }
          >
            <Text style={styles.signInLink}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 20,
  },

  inputIcon: {
    marginRight: 12,
  },

  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
  },

  eyeIcon: {
    padding: 4,
  },

  signUpButton: {
    backgroundColor: '#5B92E5',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200,
    marginBottom: 16,

    shadowColor: '#5B92E5',
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  disabledButton: {
    opacity: 0.7,
  },

  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerText: {
    fontSize: 14,
    color: '#475569',
  },

  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B82F6',
  },
});
