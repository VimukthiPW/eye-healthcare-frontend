import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import StatusBarMock from '../components/StatusBarMock';

export default function Page02_Welcome({ onNavigate }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBarMock />

      <View style={styles.content}>
        {/* Eye Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo_eye.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Healthcare</Text>
        </View>

        {/* Text Heading */}
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>Let’s get started!</Text>
          <Text style={styles.subtitleText}>
            Login to Stay healthy and fit
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => onNavigate('Page04_SignIn')}
            activeOpacity={0.85}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => onNavigate('Page03_SignUp')}
            activeOpacity={0.85}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
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
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 60,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 150,
    height: 120,
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#5B92E5',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#5B92E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  signUpButton: {
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#5B92E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#5B92E5',
    fontSize: 16,
    fontWeight: '700',
  },
});
