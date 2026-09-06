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

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react-native';

import StatusBarMock from '../components/StatusBarMock';
import Header from '../components/Header';

import API_URL from '../config/api';


// =================================================
// Page 04 - Sign In
// =================================================

export default function Page04_SignIn({
  onNavigate,
  userRole,
}) {

  // =================================================
  // States
  // =================================================

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);


  // =================================================
  // Handle Sign In
  // =================================================

  const handleSignIn = async () => {

    // -------------------------------------------------
    // Validate fields
    // -------------------------------------------------

    if (
      !email.trim() ||
      !password.trim()
    ) {

      Alert.alert(
        'Missing Information',
        'Please enter your email and password.'
      );

      return;
    }


    try {

      setLoading(true);


      console.log(
        '================================='
      );

      console.log(
        'LOGIN STARTED'
      );

      console.log(
        'Email:',
        email.trim().toLowerCase()
      );

      console.log(
        'Selected Role:',
        userRole
      );

      console.log(
        '================================='
      );


      // =================================================
      // Login API
      // =================================================

      const response =
        await fetch(
          `${API_URL}/api/auth/login`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify({

                email:
                  email.trim().toLowerCase(),

                password:
                  password,

              }),

          }
        );


      // =================================================
      // Read Response
      // =================================================

      const data =
        await response.json();


      console.log(
        'LOGIN RESPONSE:',
        data
      );


      // =================================================
      // Login Failed
      // =================================================

      if (!response.ok) {

        Alert.alert(
          'Login Failed',
          data.message ||
          'Invalid email or password.'
        );

        return;
      }


      // =================================================
      // Get User Information
      // =================================================

      const userData =
        data.user || data;


      // =================================================
      // Get ID
      // =================================================

      const userId =
        data._id ||
        data.id ||
        userData._id ||
        userData.id;


      // =================================================
      // Get Token
      // =================================================

      const token =
        data.token ||
        userData.token;


      // =================================================
      // Get Role
      // =================================================

      const rawRole =
        data.role ||
        userData.role ||
        '';


      const loginRole =
        String(rawRole)
          .trim()
          .toLowerCase();


      // =================================================
      // Debug
      // =================================================

      console.log(
        '================================='
      );

      console.log(
        'BACKEND ROLE:',
        rawRole
      );

      console.log(
        'NORMALIZED ROLE:',
        loginRole
      );

      console.log(
        'USER ID:',
        userId
      );

      console.log(
        'EMAIL:',
        data.email ||
        userData.email
      );

      console.log(
        'TOKEN EXISTS:',
        !!token
      );

      console.log(
        '================================='
      );


      // =================================================
      // Validate Response
      // =================================================

      if (
        !userId ||
        !token ||
        !loginRole
      ) {

        Alert.alert(
          'Login Error',
          'Invalid response received from server.'
        );

        return;
      }


      // =================================================
      // Create Complete User Object
      // =================================================

      const completeUser = {

        ...userData,

        ...data,

        _id:
          userId,

        id:
          userId,

        role:
          loginRole === 'doctor'
            ? 'Doctor'
            : loginRole === 'patient'
              ? 'Patient'
              : rawRole,

      };


      // =================================================
      // Save User
      // =================================================

      await AsyncStorage.setItem(
        'user',
        JSON.stringify(
          completeUser
        )
      );


      // =================================================
      // Save Token
      // =================================================

      await AsyncStorage.setItem(
        'token',
        token
      );


      console.log(
        'User saved successfully'
      );


      console.log(
        'Saved User ID:',
        userId
      );


      console.log(
        'Saved User Role:',
        completeUser.role
      );


      // =================================================
      // DOCTOR LOGIN
      // =================================================

      if (
        loginRole === 'doctor'
      ) {

        console.log(
          '================================='
        );

        console.log(
          'DOCTOR LOGIN SUCCESSFUL'
        );

        console.log(
          'Doctor ID:',
          userId
        );

        console.log(
          'Navigating to Page15_DoctorHome'
        );

        console.log(
          '================================='
        );


        onNavigate(
          'Page15_DoctorHome',
          {
            role:
              'Doctor',

            doctorId:
              userId,
          }
        );


        return;
      }


      // =================================================
      // PATIENT LOGIN
      // =================================================

      if (
        loginRole === 'patient'
      ) {

        console.log(
          '================================='
        );

        console.log(
          'PATIENT LOGIN SUCCESSFUL'
        );

        console.log(
          'Navigating to Page05_PatientHome'
        );

        console.log(
          '================================='
        );


        onNavigate(
          'Page05_PatientHome',
          {
            role:
              'Patient',

            patientId:
              userId,
          }
        );


        return;
      }


      // =================================================
      // Unknown Role
      // =================================================

      console.log(
        'UNKNOWN USER ROLE:',
        rawRole
      );


      Alert.alert(
        'Login Error',
        `Unknown user role: ${rawRole}`
      );


    } catch (error) {

      console.error(
        'LOGIN ERROR:',
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


  // =================================================
  // UI
  // =================================================

  return (

    <SafeAreaView
      style={
        styles.container
      }
    >

      <StatusBarMock />


      {/* =================================================
          Header
      ================================================= */}

      <Header

        title="Sign In"

        onBack={() =>
          onNavigate(
            'Page02_Welcome'
          )
        }

      />


      <View
        style={
          styles.content
        }
      >


        {/* =================================================
            Email
        ================================================= */}

        <View
          style={
            styles.inputContainer
          }
        >

          <Mail

            size={20}

            color="#94A3B8"

            style={
              styles.inputIcon
            }

          />


          <TextInput

            style={
              styles.textInput
            }

            placeholder="Enter your email"

            placeholderTextColor="#94A3B8"

            keyboardType="email-address"

            autoCapitalize="none"

            autoCorrect={false}

            value={
              email
            }

            onChangeText={
              setEmail
            }

          />

        </View>


        {/* =================================================
            Password
        ================================================= */}

        <View
          style={
            styles.inputContainer
          }
        >

          <Lock

            size={20}

            color="#94A3B8"

            style={
              styles.inputIcon
            }

          />


          <TextInput

            style={
              styles.textInput
            }

            placeholder="Enter your password"

            placeholderTextColor="#94A3B8"

            secureTextEntry={
              !showPassword
            }

            autoCapitalize="none"

            autoCorrect={false}

            value={
              password
            }

            onChangeText={
              setPassword
            }

          />


          <TouchableOpacity

            onPress={() =>
              setShowPassword(
                !showPassword
              )
            }

            style={
              styles.eyeIcon
            }

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


        {/* =================================================
            Forgot Password
        ================================================= */}

        <TouchableOpacity

          style={
            styles.forgotPassContainer
          }

          onPress={() =>
            Alert.alert(
              'Forgot Password',
              'Password reset feature will be available soon.'
            )
          }

        >

          <Text
            style={
              styles.forgotPassText
            }
          >

            Forgot password?

          </Text>

        </TouchableOpacity>


        {/* =================================================
            Sign In Button
        ================================================= */}

        <TouchableOpacity

          style={[

            styles.signInButton,

            loading &&
              styles.disabledButton,

          ]}

          onPress={
            handleSignIn
          }

          disabled={
            loading
          }

          activeOpacity={
            0.85
          }

        >

          {loading ? (

            <ActivityIndicator

              size="small"

              color="#FFFFFF"

            />

          ) : (

            <Text
              style={
                styles.signInButtonText
              }
            >

              Sign In

            </Text>

          )}

        </TouchableOpacity>


        {/* =================================================
            Footer
        ================================================= */}

        <View
          style={
            styles.footerRow
          }
        >

          <Text
            style={
              styles.footerText
            }
          >

            Don’t have an account?{' '}

          </Text>


          <TouchableOpacity

            onPress={() =>
              onNavigate(
                'Page03_SignUp'
              )
            }

          >

            <Text
              style={
                styles.signUpLink
              }
            >

              Sign up

            </Text>

          </TouchableOpacity>

        </View>


      </View>

    </SafeAreaView>

  );

}


// =================================================
// Styles
// =================================================

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      backgroundColor:
        '#FFFFFF',

    },


    content: {

      flex: 1,

      paddingHorizontal:
        24,

      paddingTop:
        30,

    },


    inputContainer: {

      flexDirection:
        'row',

      alignItems:
        'center',

      backgroundColor:
        '#F8FAFC',

      borderWidth:
        1,

      borderColor:
        '#E2E8F0',

      borderRadius:
        12,

      paddingHorizontal:
        16,

      height:
        56,

      marginBottom:
        20,

    },


    inputIcon: {

      marginRight:
        12,

    },


    textInput: {

      flex: 1,

      fontSize:
        15,

      color:
        '#1E293B',

    },


    eyeIcon: {

      padding:
        4,

    },


    forgotPassContainer: {

      alignSelf:
        'flex-end',

      marginBottom:
        40,

    },


    forgotPassText: {

      fontSize:
        14,

      color:
        '#3B82F6',

      fontWeight:
        '600',

    },


    signInButton: {

      backgroundColor:
        '#5B92E5',

      height:
        52,

      borderRadius:
        26,

      justifyContent:
        'center',

      alignItems:
        'center',

      marginTop:
        140,

      marginBottom:
        16,

      shadowColor:
        '#5B92E5',

      shadowOffset: {

        width:
          0,

        height:
          4,

      },

      shadowOpacity:
        0.3,

      shadowRadius:
        6,

      elevation:
        4,

    },


    disabledButton: {

      opacity:
        0.7,

    },


    signInButtonText: {

      color:
        '#FFFFFF',

      fontSize:
        16,

      fontWeight:
        '700',

    },


    footerRow: {

      flexDirection:
        'row',

      justifyContent:
        'center',

      alignItems:
        'center',

    },


    footerText: {

      fontSize:
        14,

      color:
        '#475569',

    },


    signUpLink: {

      fontSize:
        14,

      fontWeight:
        '700',

      color:
        '#3B82F6',

    },

  });