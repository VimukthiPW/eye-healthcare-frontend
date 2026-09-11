import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import {
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import StatusBarMock from '../components/StatusBarMock';
import BottomNavBar from '../components/BottomNavBar';


// =================================================
// Page 14 - Patient Profile
// =================================================

export default function Page14_Profile({
  onNavigate,
}) {

  // =================================================
  // User Information
  // =================================================

  const [userName, setUserName] =
    useState('');

  const [userEmail, setUserEmail] =
    useState('');

  const [loading, setLoading] =
    useState(true);


  // =================================================
  // Load Logged-In User
  // =================================================

  useEffect(() => {

    const loadUser =
      async () => {

        try {

          const userData =
            await AsyncStorage.getItem(
              'user'
            );


          console.log(
            'Profile stored user:',
            userData
          );


          if (userData) {

            const user =
              JSON.parse(
                userData
              );


            // =================================================
            // Name
            // =================================================

            setUserName(
              user.name ||
              user.fullName ||
              'User'
            );


            // =================================================
            // Email
            // =================================================

            setUserEmail(
              user.email ||
              user.userEmail ||
              ''
            );

          } else {

            setUserName(
              'User'
            );

            setUserEmail(
              ''
            );

          }


        } catch (error) {

          console.error(
            'Load profile error:',
            error
          );


          setUserName(
            'User'
          );

          setUserEmail(
            ''
          );


        } finally {

          setLoading(
            false
          );

        }

      };


    loadUser();

  }, []);


  // =================================================
  // Logout
  // =================================================

  const handleLogout =
    async () => {

      try {

        await AsyncStorage.removeItem(
          'token'
        );

        await AsyncStorage.removeItem(
          'user'
        );

      } catch (error) {

        console.error(
          'Logout error:',
          error
        );

      }


      onNavigate(
        'Page01_RoleSelect'
      );

    };


  // =================================================
  // Loading
  // =================================================

  if (loading) {

    return (

      <SafeAreaView
        style={
          styles.container
        }
      >

        <StatusBarMock />

        <View
          style={
            styles.loadingContainer
          }
        >

          <ActivityIndicator
            size="large"
            color="#3B82F6"
          />

        </View>


        <BottomNavBar
          activeTab="Profile"

          onTabSelect={(tab) => {

            if (
              tab === 'Home'
            ) {

              onNavigate(
                'Page05_PatientHome'
              );

            }

            if (
              tab === 'Reports'
            ) {

              onNavigate(
                'Page09_ReportsList'
              );

            }

          }}

        />

      </SafeAreaView>

    );

  }


  // =================================================
  // Main UI
  // =================================================

  return (

    <SafeAreaView
      style={
        styles.container
      }
    >

      <StatusBarMock />


      <ScrollView
        contentContainerStyle={
          styles.content
        }

        showsVerticalScrollIndicator={
          false
        }
      >

        {/* =================================================
            Profile Avatar
            Edit icon removed
        ================================================= */}

        <View
          style={
            styles.avatarSection
          }
        >

          <View
            style={
              styles.avatarCircle
            }
          >

            <User
              size={54}
              color="#D97706"
            />

          </View>


          <Text
            style={
              styles.userName
            }
          >
            {userName}
          </Text>

        </View>


        {/* =================================================
            User Information Card
            Edit icon removed
        ================================================= */}

        <View
          style={
            styles.infoCard
          }
        >

          {/* Name */}

          <View
            style={
              styles.infoLine
            }
          >

            <Text
              style={
                styles.infoText
              }
            >
              Name : {userName}
            </Text>

          </View>


          {/* Email */}

          <View
            style={
              styles.infoLine
            }
          >

            <Text
              style={
                styles.infoText
              }
            >
              Email : {userEmail}
            </Text>

          </View>

        </View>


        {/* =================================================
            Logout
        ================================================= */}

        <TouchableOpacity
          style={
            styles.logoutRow
          }

          onPress={
            handleLogout
          }

          activeOpacity={
            0.8
          }
        >

          <View
            style={
              styles.logoutIconCircle
            }
          >

            <LogOut
              size={20}
              color="#3B82F6"
            />

          </View>


          <Text
            style={
              styles.logoutText
            }
          >
            Logout
          </Text>


          <ChevronRight
            size={22}
            color="#64748B"
          />

        </TouchableOpacity>


      </ScrollView>


      {/* =================================================
          Bottom Navigation
      ================================================= */}

      <BottomNavBar
        activeTab="Profile"

        onTabSelect={(tab) => {

          if (
            tab === 'Home'
          ) {

            onNavigate(
              'Page05_PatientHome'
            );

          }


          if (
            tab === 'Reports'
          ) {

            onNavigate(
              'Page09_ReportsList'
            );

          }

        }}

      />

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
      backgroundColor: '#FFFFFF',
    },


    content: {
      paddingHorizontal: 24,
      paddingTop: 30,
      alignItems: 'center',
      paddingBottom: 120,
    },


    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },


    avatarSection: {
      alignItems: 'center',
      marginBottom: 24,
    },


    avatarCircle: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: '#FED7AA',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: '#475569',
      marginBottom: 12,
    },


    userName: {
      fontSize: 20,
      fontWeight: '800',
      color: '#000000',
    },


    infoCard: {
      width: '100%',
      backgroundColor: '#EAEFFE',
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 120,
    },


    infoLine: {
      marginBottom: 10,
    },


    infoLineLast: {
      marginBottom: 0,
    },


    infoText: {
      fontSize: 16,
      fontWeight: '800',
      color: '#0F172A',
    },


    logoutRow: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },


    logoutIconCircle: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: '#EAEFFE',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },


    logoutText: {
      flex: 1,
      fontSize: 18,
      fontWeight: '800',
      color: '#0F172A',
    },

  });