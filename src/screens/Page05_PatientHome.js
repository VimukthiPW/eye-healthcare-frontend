import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import {
  Lightbulb,
  Bot,
  Eye,
  CalendarCheck,
} from 'lucide-react-native';

import StatusBarMock from '../components/StatusBarMock';
import BottomNavBar from '../components/BottomNavBar';

export default function Page05_PatientHome({ onNavigate }) {

  return (
    <SafeAreaView style={styles.container}>

      <StatusBarMock dark={false} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* =================================================
            Banner Section
        ================================================= */}

        <View style={styles.bannerSection}>

          <Text style={styles.welcomeText}>
            welcome !
          </Text>

          <Image
            source={require('../../assets/female_doctor.png')}
            style={styles.doctorImage}
            resizeMode="contain"
          />

        </View>


        {/* =================================================
            Main Content Area
        ================================================= */}

        <View style={styles.mainCard}>

          {/* =================================================
              Eye Disease Detection
          ================================================= */}

          <TouchableOpacity
            style={styles.heroCard}
            onPress={() =>
              onNavigate('Page06_EyeDetection')
            }
            activeOpacity={0.85}
          >

            <View style={styles.heroIconCircle}>

              <Eye
                size={42}
                color="#FFFFFF"
                strokeWidth={2.2}
              />

            </View>

            <Text style={styles.heroCardTitle}>
              Eye Disease Detection
            </Text>

          </TouchableOpacity>


          {/* =================================================
              Grid Options
          ================================================= */}

          <View style={styles.gridContainer}>

            {/* =================================================
                Book Appointment
            ================================================= */}

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() =>
                onNavigate('Page07_DoctorsList')
              }
              activeOpacity={0.8}
            >

              <Image
                source={require('../../assets/calendar_plus.png')}
                style={styles.gridIconImage}
                resizeMode="contain"
              />

              <Text style={styles.gridLabel}>
                Book Appointment
              </Text>

            </TouchableOpacity>


            {/* =================================================
                Medical Report
            ================================================= */}

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() =>
                onNavigate('Page09_ReportsList')
              }
              activeOpacity={0.8}
            >

              <Image
                source={require('../../assets/medical_report.png')}
                style={styles.gridIconImage}
                resizeMode="contain"
              />

              <Text style={styles.gridLabel}>
                Medical Report
              </Text>

            </TouchableOpacity>


            {/* =================================================
                Eye Care Tips
            ================================================= */}

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() =>
                onNavigate('Page12_EyeCareTips')
              }
              activeOpacity={0.8}
            >

              <View
                style={[
                  styles.gridIconCircle,
                  {
                    backgroundColor: '#3B82F6',
                  },
                ]}
              >

                <Lightbulb
                  size={32}
                  color="#FFFFFF"
                />

              </View>

              <Text style={styles.gridLabel}>
                Eye Care Tips
              </Text>

            </TouchableOpacity>


            {/* =================================================
                Eagle Vision Bot
            ================================================= */}

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() =>
                onNavigate('Page13_EagleVisionBot')
              }
              activeOpacity={0.8}
            >

              <View
                style={[
                  styles.gridIconCircle,
                  {
                    backgroundColor: '#3B82F6',
                  },
                ]}
              >

                <Bot
                  size={32}
                  color="#FFFFFF"
                />

              </View>

              <Text style={styles.gridLabel}>
                Eagle Vision Bot
              </Text>

            </TouchableOpacity>


            {/* =================================================
                My Appointments
            ================================================= */}

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() =>
                onNavigate('Page17_PatientAppointments')
              }
              activeOpacity={0.8}
            >

              <View
                style={[
                  styles.gridIconCircle,
                  {
                    backgroundColor: '#3B82F6',
                  },
                ]}
              >

                <CalendarCheck
                  size={32}
                  color="#FFFFFF"
                />

              </View>

              <Text style={styles.gridLabel}>
                My Appointments
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </ScrollView>


      {/* =================================================
          Bottom Navigation
      ================================================= */}

      <BottomNavBar
        activeTab="Home"
        onTabSelect={(tab) => {

          if (
            tab === 'Reports'
          ) {

            onNavigate(
              'Page09_ReportsList'
            );

          }

          if (
            tab === 'Profile'
          ) {

            onNavigate(
              'Page14_Profile'
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

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor:
      '#D7F2FA',

  },


  scrollContent: {

    flexGrow: 1,

    paddingBottom: 20,

  },


  // =================================================
  // Banner
  // =================================================

  bannerSection: {

    height: 200,

    paddingHorizontal: 24,

    flexDirection:
      'row',

    alignItems:
      'center',

    justifyContent:
      'space-between',

  },


  welcomeText: {

    fontSize: 32,

    fontWeight: '700',

    color: '#4C84E6',

    marginBottom: 20,

  },


  doctorImage: {

    width: 170,

    height: 200,

    marginTop: 10,

  },


  // =================================================
  // Main Card
  // =================================================

  mainCard: {

    flex: 1,

    backgroundColor:
      '#FFFFFF',

    borderTopLeftRadius: 28,

    borderTopRightRadius: 28,

    paddingHorizontal: 20,

    paddingTop: 24,

    paddingBottom: 30,

  },


  // =================================================
  // Eye Detection
  // =================================================

  heroCard: {

    backgroundColor:
      '#E6F8FF',

    borderRadius: 20,

    paddingVertical: 24,

    alignItems:
      'center',

    justifyContent:
      'center',

    marginBottom: 28,

  },


  heroIconCircle: {

    width: 76,

    height: 76,

    borderRadius: 24,

    backgroundColor:
      '#3B82F6',

    justifyContent:
      'center',

    alignItems:
      'center',

    marginBottom: 12,

    shadowColor:
      '#3B82F6',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.3,

    shadowRadius: 6,

    elevation: 4,

  },


  heroCardTitle: {

    fontSize: 16,

    fontWeight: '700',

    color: '#000000',

  },


  // =================================================
  // Grid
  // =================================================

  gridContainer: {

    flexDirection:
      'row',

    flexWrap:
      'wrap',

    justifyContent:
      'space-around',

  },


  gridItem: {

    width: '44%',

    alignItems:
      'center',

    marginBottom: 24,

  },


  gridIconImage: {

    width: 60,

    height: 60,

    marginBottom: 8,

  },


  gridIconCircle: {

    width: 60,

    height: 60,

    borderRadius: 30,

    justifyContent:
      'center',

    alignItems:
      'center',

    marginBottom: 8,

  },


  gridLabel: {

    fontSize: 13,

    fontWeight: '700',

    color: '#000000',

    textAlign: 'center',

  },

});