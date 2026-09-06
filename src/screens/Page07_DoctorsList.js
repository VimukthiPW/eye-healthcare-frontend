import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import StatusBarMock from '../components/StatusBarMock';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';

import API_URL from '../config/api';


// =================================================
// Fallback Images
// =================================================

const fallbackImages = {
  'Dr. Rishi': require('../../assets/dr_rishi.png'),
  'Dr. Vaamana': require('../../assets/dr_vaamana.png'),
  'Dr. Nallarasi': require('../../assets/dr_nallarasi.png'),
  'Dr. Nihal': require('../../assets/dr_nihal.png'),
};


// =================================================
// Page
// =================================================

export default function Page07_DoctorsList({
  onNavigate,
  setSelectedDoctor,
}) {

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);


  // =================================================
  // Load Doctors From Backend
  // =================================================

  const fetchDoctors = async () => {

    try {

      setLoading(true);

      console.log(
        'Loading doctors from:',
        `${API_URL}/api/doctors`
      );


      const response = await fetch(
        `${API_URL}/api/doctors`
      );


      const data = await response.json();


      console.log(
        'Doctors API response:',
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          'Failed to load doctors'
        );

      }


      // Backend returns an array
      if (!Array.isArray(data)) {

        throw new Error(
          'Invalid doctors data received from server'
        );

      }


      const formattedDoctors = data.map(
        (doctor) => ({

          ...doctor,

          // =================================================
          // IMPORTANT
          // Keep MongoDB ID
          // =================================================

          id: doctor._id,

          doctorId: doctor._id,


          // Doctor specialization
          specialty:
            doctor.specialization ||
            'Ophthalmologist',


          // Doctor image
          image:
            doctor.avatar
              ? { uri: doctor.avatar }
              : fallbackImages[doctor.name] ||
                null,

        })
      );


      console.log(
        'Formatted Doctors:',
        formattedDoctors
      );


      setDoctors(
        formattedDoctors
      );


    } catch (error) {

      console.error(
        'Doctors loading error:',
        error
      );


      Alert.alert(
        'Doctors Error',
        error.message ||
        'Unable to load doctors from server.'
      );


    } finally {

      setLoading(false);

    }

  };


  // =================================================
  // Load Doctors When Page Opens
  // =================================================

  useEffect(() => {

    fetchDoctors();

  }, []);


  // =================================================
  // Select Doctor
  // =================================================

  const handleSelectDoctor = (doctor) => {

    console.log(
      '================================='
    );

    console.log(
      'SELECTED DOCTOR'
    );

    console.log(
      'Doctor Name:',
      doctor.name
    );

    console.log(
      'Doctor MongoDB ID:',
      doctor._id
    );

    console.log(
      'Doctor ID:',
      doctor.doctorId
    );

    console.log(
      'Available Days:',
      doctor.availableDays
    );

    console.log(
      'Available Time Slots:',
      doctor.availableTimeSlots
    );

    console.log(
      '================================='
    );


    // =================================================
    // Store the complete doctor object
    // =================================================

    if (setSelectedDoctor) {

      setSelectedDoctor({
        ...doctor,

        // Make sure both IDs are available
        id: doctor._id,
        doctorId: doctor._id,
      });

    }


    // =================================================
    // Navigate to Doctor Detail
    // =================================================

    onNavigate(
      'Page08_DoctorDetailPatient'
    );

  };


  // =================================================
  // Render
  // =================================================

  return (

    <SafeAreaView
      style={styles.container}
    >

      <StatusBarMock />


      {/* =========================================
          Header
      ========================================= */}

      <Header
        title="Doctors"
        onBack={() =>
          onNavigate(
            'Page05_PatientHome'
          )
        }
      />


      {/* =========================================
          Doctors Content
      ========================================= */}

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >


        {/* =======================================
            Loading
        ======================================= */}

        {loading && (

          <View
            style={
              styles.loadingContainer
            }
          >

            <ActivityIndicator
              size="large"
              color="#3B82F6"
            />

            <Text
              style={
                styles.loadingText
              }
            >
              Loading doctors...
            </Text>

          </View>

        )}


        {/* =======================================
            No Doctors
        ======================================= */}

        {!loading &&
          doctors.length === 0 && (

            <View
              style={
                styles.emptyContainer
              }
            >

              <Text
                style={
                  styles.emptyTitle
                }
              >
                No Doctors Available
              </Text>


              <Text
                style={
                  styles.emptyText
                }
              >
                There are currently no doctors
                available.
              </Text>


              <TouchableOpacity
                style={
                  styles.retryButton
                }
                onPress={
                  fetchDoctors
                }
                activeOpacity={0.8}
              >

                <Text
                  style={
                    styles.retryText
                  }
                >
                  Try Again
                </Text>

              </TouchableOpacity>

            </View>

          )}


        {/* =======================================
            Doctor List
        ======================================= */}

        {!loading &&
          doctors.length > 0 &&
          doctors.map(
            (doctor) => (

              <TouchableOpacity
                key={doctor._id}
                style={
                  styles.doctorCard
                }
                onPress={() =>
                  handleSelectDoctor(
                    doctor
                  )
                }
                activeOpacity={0.85}
              >

                {/* Doctor Image */}

                {doctor.image ? (

                  <Image
                    source={
                      doctor.image
                    }
                    style={
                      styles.doctorImage
                    }
                    resizeMode="cover"
                  />

                ) : (

                  <View
                    style={
                      styles.imagePlaceholder
                    }
                  >

                    <Text
                      style={
                        styles.placeholderText
                      }
                    >
                      DR
                    </Text>

                  </View>

                )}


                {/* Doctor Information */}

                <View
                  style={
                    styles.doctorInfo
                  }
                >

                  <Text
                    style={
                      styles.doctorName
                    }
                  >
                    {doctor.name}
                  </Text>


                  <Text
                    style={
                      styles.specialty
                    }
                  >
                    {doctor.specialty}
                  </Text>


                  {doctor.hospital && (

                    <Text
                      style={
                        styles.hospital
                      }
                    >
                      {doctor.hospital}
                    </Text>

                  )}

                </View>

              </TouchableOpacity>

            )
          )}

      </ScrollView>


      {/* =========================================
          Bottom Navigation
      ========================================= */}

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

    backgroundColor: '#FFFFFF',

  },


  content: {

    paddingHorizontal: 20,

    paddingTop: 16,

    paddingBottom: 24,

  },


  doctorCard: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    borderWidth: 1,

    borderColor: '#E2E8F0',

    padding: 12,

    marginBottom: 16,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.04,

    shadowRadius: 4,

    elevation: 2,

  },


  doctorImage: {

    width: 100,

    height: 100,

    borderRadius: 12,

    marginRight: 16,

  },


  imagePlaceholder: {

    width: 100,

    height: 100,

    borderRadius: 12,

    marginRight: 16,

    backgroundColor: '#EAEFFE',

    justifyContent: 'center',

    alignItems: 'center',

  },


  placeholderText: {

    fontSize: 22,

    fontWeight: '800',

    color: '#3B82F6',

  },


  doctorInfo: {

    flex: 1,

    justifyContent: 'center',

  },


  doctorName: {

    fontSize: 18,

    fontWeight: '800',

    color: '#000000',

    marginBottom: 5,

  },


  specialty: {

    fontSize: 14,

    fontWeight: '600',

    color: '#475569',

    marginBottom: 4,

  },


  hospital: {

    fontSize: 12,

    color: '#64748B',

  },


  loadingContainer: {

    flex: 1,

    minHeight: 300,

    alignItems: 'center',

    justifyContent: 'center',

  },


  loadingText: {

    marginTop: 12,

    fontSize: 14,

    color: '#64748B',

  },


  emptyContainer: {

    paddingTop: 100,

    alignItems: 'center',

    paddingHorizontal: 20,

  },


  emptyTitle: {

    fontSize: 20,

    fontWeight: '800',

    color: '#0F172A',

    marginBottom: 8,

  },


  emptyText: {

    fontSize: 14,

    color: '#64748B',

    textAlign: 'center',

    marginBottom: 20,

  },


  retryButton: {

    backgroundColor: '#3B82F6',

    paddingHorizontal: 24,

    paddingVertical: 12,

    borderRadius: 10,

  },


  retryText: {

    color: '#FFFFFF',

    fontSize: 14,

    fontWeight: '700',

  },

});