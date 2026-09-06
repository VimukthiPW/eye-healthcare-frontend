import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

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
  RefreshControl,
} from 'react-native';

import {
  Calendar,
  LogOut,
  Clock,
  User,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import StatusBarMock from '../components/StatusBarMock';
import API_URL from '../config/api';


// =================================================
// Page 15 - Doctor Home
// =================================================

export default function Page15_DoctorHome({
  onNavigate,
}) {

  // =================================================
  // Appointments
  // =================================================

  const [appointments, setAppointments] =
    useState([]);


  // =================================================
  // Loading
  // =================================================

  const [loading, setLoading] =
    useState(true);


  // =================================================
  // Refreshing
  // =================================================

  const [refreshing, setRefreshing] =
    useState(false);


  // =================================================
  // Updating Appointment
  // =================================================

  const [updatingId, setUpdatingId] =
    useState(null);


  // =================================================
  // Get Doctor Appointments
  // =================================================

  const fetchAppointments =
    useCallback(
      async (showLoader = true) => {

        try {

          if (showLoader) {
            setLoading(true);
          }


          // -------------------------------------------------
          // Get Token
          // -------------------------------------------------

          const token =
            await AsyncStorage.getItem(
              'token'
            );


          if (!token) {

            Alert.alert(
              'Login Required',
              'Please login as a doctor first.'
            );

            setAppointments([]);

            return;
          }


          console.log(
            '================================='
          );

          console.log(
            'Loading Doctor Appointments'
          );

          console.log(
            `${API_URL}/api/appointments/doctor`
          );

          console.log(
            '================================='
          );


          // -------------------------------------------------
          // API Request
          // -------------------------------------------------

          const response =
            await fetch(
              `${API_URL}/api/appointments/doctor`,
              {
                method: 'GET',

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  'Content-Type':
                    'application/json',
                },
              }
            );


          // -------------------------------------------------
          // Response
          // -------------------------------------------------

          const data =
            await response.json();


          console.log(
            'Doctor Appointments Response:',
            data
          );


          // -------------------------------------------------
          // API Error
          // -------------------------------------------------

          if (!response.ok) {

            throw new Error(
              data?.message ||
              'Failed to load appointments'
            );

          }


          // -------------------------------------------------
          // Backend Response
          //
          // {
          //   success: true,
          //   count: 2,
          //   appointments: [...]
          // }
          // -------------------------------------------------

          let appointmentList = [];


          if (
            Array.isArray(data)
          ) {

            appointmentList =
              data;

          } else if (
            Array.isArray(
              data?.appointments
            )
          ) {

            appointmentList =
              data.appointments;

          }


          // -------------------------------------------------
          // Save
          // -------------------------------------------------

          setAppointments(
            appointmentList
          );


          console.log(
            'Appointments Count:',
            appointmentList.length
          );


        } catch (error) {

          console.error(
            'Doctor appointments error:',
            error
          );


          setAppointments([]);


          Alert.alert(
            'Appointments Error',
            error.message ||
            'Unable to load appointments.'
          );


        } finally {

          setLoading(false);

          setRefreshing(false);

        }

      },
      []
    );


  // =================================================
  // Load Appointments On Page Open
  // =================================================

  useEffect(() => {

    fetchAppointments();

  }, [
    fetchAppointments,
  ]);


  // =================================================
  // Refresh
  // =================================================

  const handleRefresh =
    async () => {

      setRefreshing(true);

      await fetchAppointments(false);

    };


  // =================================================
  // Doctor Profile
  // =================================================

  const handleDoctorProfile =
    async () => {

      try {

        const userData =
          await AsyncStorage.getItem(
            'user'
          );


        console.log(
          'Stored Doctor User:',
          userData
        );


        if (!userData) {

          Alert.alert(
            'Doctor Information Missing',
            'Please login again as a doctor.'
          );

          return;
        }


        const user =
          JSON.parse(userData);


        const doctorId =
          user?._id ||
          user?.id ||
          user?.userId;


        console.log(
          'Doctor ID:',
          doctorId
        );


        if (!doctorId) {

          Alert.alert(
            'Doctor ID Missing',
            'Doctor ID could not be found. Please login again.'
          );

          return;
        }


        onNavigate(
          'Page16_DoctorDetailDoctor',
          {
            doctorId:
              doctorId,
          }
        );


      } catch (error) {

        console.error(
          'Doctor profile navigation error:',
          error
        );


        Alert.alert(
          'Error',
          'Unable to open doctor profile.'
        );

      }

    };


  // =================================================
  // Update Appointment Status
  // =================================================

  const updateAppointmentStatus =
    async (
      appointmentId,
      newStatus
    ) => {

      try {

        // -------------------------------------------------
        // Token
        // -------------------------------------------------

        const token =
          await AsyncStorage.getItem(
            'token'
          );


        if (!token) {

          Alert.alert(
            'Login Required',
            'Please login again.'
          );

          return;
        }


        // -------------------------------------------------
        // Updating
        // -------------------------------------------------

        setUpdatingId(
          appointmentId
        );


        console.log(
          '================================='
        );

        console.log(
          'Updating Appointment'
        );

        console.log(
          'Appointment ID:',
          appointmentId
        );

        console.log(
          'New Status:',
          newStatus
        );

        console.log(
          '================================='
        );


        // -------------------------------------------------
        // PUT Request
        // -------------------------------------------------

        const response =
          await fetch(
            `${API_URL}/api/appointments/${appointmentId}/status`,
            {
              method: 'PUT',

              headers: {
                Authorization:
                  `Bearer ${token}`,

                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify({
                  status:
                    newStatus,
                }),
            }
          );


        const data =
          await response.json();


        console.log(
          'Status Update Response:',
          data
        );


        // -------------------------------------------------
        // Error
        // -------------------------------------------------

        if (!response.ok) {

          throw new Error(
            data?.message ||
            'Failed to update appointment'
          );

        }


        // -------------------------------------------------
        // Update Local Appointment
        // -------------------------------------------------

        setAppointments(
          previousAppointments =>
            previousAppointments.map(
              appointment => {

                if (
                  appointment._id ===
                  appointmentId
                ) {

                  return {
                    ...appointment,
                    status:
                      newStatus,
                  };

                }

                return appointment;

              }
            )
        );


        // -------------------------------------------------
        // Success Message
        // -------------------------------------------------

        if (
          newStatus ===
          'Accepted'
        ) {

          Alert.alert(
            'Appointment Accepted',
            'The appointment has been accepted successfully.'
          );

        }


        else if (
          newStatus ===
          'Rejected'
        ) {

          Alert.alert(
            'Appointment Rejected',
            'The appointment has been rejected successfully.'
          );

        }


        else if (
          newStatus ===
          'Completed'
        ) {

          Alert.alert(
            'Appointment Completed',
            'The appointment has been marked as completed.'
          );

        }


      } catch (error) {

        console.error(
          'Appointment status error:',
          error
        );


        Alert.alert(
          'Update Error',
          error.message ||
          'Unable to update appointment.'
        );


      } finally {

        setUpdatingId(null);

      }

    };


  // =================================================
  // Accept
  // =================================================

  const handleAccept =
    (appointmentId) => {

      updateAppointmentStatus(
        appointmentId,
        'Accepted'
      );

    };


  // =================================================
  // Reject
  // =================================================

  const handleReject =
    (appointmentId) => {

      Alert.alert(
        'Reject Appointment',
        'Are you sure you want to reject this appointment?',
        [
          {
            text: 'No',
            style: 'cancel',
          },

          {
            text: 'Reject',
            style: 'destructive',

            onPress: () =>
              updateAppointmentStatus(
                appointmentId,
                'Rejected'
              ),
          },
        ]
      );

    };


  // =================================================
  // Complete
  // =================================================

  const handleComplete =
    (appointmentId) => {

      Alert.alert(
        'Complete Appointment',
        'Mark this appointment as completed?',
        [
          {
            text: 'No',
            style: 'cancel',
          },

          {
            text: 'Complete',

            onPress: () =>
              updateAppointmentStatus(
                appointmentId,
                'Completed'
              ),
          },
        ]
      );

    };


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
  // Counters
  // =================================================

  const pendingAppointments =
    appointments.filter(
      appointment =>
        appointment?.status ===
        'Pending'
    );


  const acceptedAppointments =
    appointments.filter(
      appointment =>
        appointment?.status ===
        'Accepted'
    );


  // =================================================
  // Date Formatter
  // =================================================

  const formatDate =
    (date) => {

      if (!date) {
        return '';
      }


      try {

        const parsedDate =
          new Date(date);


        if (
          Number.isNaN(
            parsedDate.getTime()
          )
        ) {

          return String(date);

        }


        return parsedDate.toLocaleDateString(
          'en-US',
          {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }
        );


      } catch {

        return String(date);

      }

    };


  // =================================================
  // Status Style
  // =================================================

  const getStatusStyle =
    (status) => {

      switch (status) {

        case 'Accepted':
          return styles.acceptedStatus;

        case 'Rejected':
          return styles.rejectedStatus;

        case 'Cancelled':
          return styles.cancelledStatus;

        case 'Completed':
          return styles.completedStatus;

        default:
          return styles.pendingStatus;

      }

    };


  // =================================================
  // Render
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

      <View
        style={
          styles.topHeader
        }
      >

        <View>

          <Text
            style={
              styles.headerTitle
            }
          >
            Doctor Home
          </Text>


          <Text
            style={
              styles.headerSubtitle
            }
          >
            Manage your appointments
          </Text>

        </View>


        <TouchableOpacity
          style={
            styles.logoutButton
          }
          onPress={
            handleLogout
          }
          activeOpacity={
            0.8
          }
        >

          <LogOut
            size={21}
            color="#FFFFFF"
          />

        </TouchableOpacity>

      </View>


      {/* =================================================
          Main Scroll
      ================================================= */}

      <ScrollView

        contentContainerStyle={
          styles.scrollContent
        }

        showsVerticalScrollIndicator={
          false
        }

        refreshControl={

          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              handleRefresh
            }
          />

        }

      >


        {/* =================================================
            Doctor Banner
        ================================================= */}

        <View
          style={
            styles.bannerSection
          }
        >

          <View
            style={
              styles.bannerTextContainer
            }
          >

            <Text
              style={
                styles.welcomeText
              }
            >
              Welcome!
            </Text>


            <Text
              style={
                styles.doctorSubtitle
              }
            >
              Manage your patient
              {'\n'}
              appointments
            </Text>

          </View>


          <Image

            source={
              require(
                '../../assets/female_doctor.png'
              )
            }

            style={
              styles.doctorImage
            }

            resizeMode="contain"

          />

        </View>


        {/* =================================================
            Statistics
        ================================================= */}

        <View
          style={
            styles.statsContainer
          }
        >


          {/* Pending */}

          <View
            style={
              styles.statCard
            }
          >

            <View
              style={[
                styles.statIcon,
                styles.pendingIcon,
              ]}
            >

              <Clock
                size={22}
                color="#F59E0B"
              />

            </View>


            <Text
              style={
                styles.statNumber
              }
            >
              {
                pendingAppointments.length
              }
            </Text>


            <Text
              style={
                styles.statLabel
              }
            >
              Pending
            </Text>

          </View>


          {/* Accepted */}

          <View
            style={
              styles.statCard
            }
          >

            <View
              style={[
                styles.statIcon,
                styles.acceptedIcon,
              ]}
            >

              <CheckCircle
                size={22}
                color="#16A34A"
              />

            </View>


            <Text
              style={
                styles.statNumber
              }
            >
              {
                acceptedAppointments.length
              }
            </Text>


            <Text
              style={
                styles.statLabel
              }
            >
              Accepted
            </Text>

          </View>


          {/* Total */}

          <View
            style={
              styles.statCard
            }
          >

            <View
              style={[
                styles.statIcon,
                styles.totalIcon,
              ]}
            >

              <Calendar
                size={22}
                color="#3B82F6"
              />

            </View>


            <Text
              style={
                styles.statNumber
              }
            >
              {
                appointments.length
              }
            </Text>


            <Text
              style={
                styles.statLabel
              }
            >
              Total
            </Text>

          </View>

        </View>


        {/* =================================================
            Doctor Details Button
        ================================================= */}

        <TouchableOpacity

          style={
            styles.doctorDetailsButton
          }

          onPress={
            handleDoctorProfile
          }

          activeOpacity={
            0.85
          }

        >

          <User
            size={20}
            color="#FFFFFF"
          />


          <Text
            style={
              styles.doctorDetailsText
            }
          >
            Doctor Details
          </Text>

        </TouchableOpacity>


        {/* =================================================
            Recent Appointments Header
        ================================================= */}

        <View
          style={
            styles.sectionHeader
          }
        >

          <View>

            <Text
              style={
                styles.sectionTitle
              }
            >
              Recent Appointments
            </Text>


            <Text
              style={
                styles.sectionSubtitle
              }
            >
              Patient appointment requests
            </Text>

          </View>


          <TouchableOpacity

            onPress={
              handleRefresh
            }

            style={
              styles.refreshButton
            }

            activeOpacity={
              0.8
            }

          >

            <RefreshCw
              size={20}
              color="#3B82F6"
            />

          </TouchableOpacity>

        </View>


        {/* =================================================
            Loading
        ================================================= */}

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
              Loading appointments...
            </Text>

          </View>

        )}


        {/* =================================================
            No Appointments
        ================================================= */}

        {!loading &&
          appointments.length === 0 && (

            <View
              style={
                styles.emptyContainer
              }
            >

              <View
                style={
                  styles.emptyIcon
                }
              >

                <Calendar
                  size={42}
                  color="#94A3B8"
                />

              </View>


              <Text
                style={
                  styles.emptyTitle
                }
              >
                No Appointments Yet
              </Text>


              <Text
                style={
                  styles.emptyText
                }
              >
                Patient appointment requests
                {'\n'}
                will appear here.
              </Text>

            </View>

          )}


        {/* =================================================
            Appointment List
        ================================================= */}

        {!loading &&
          appointments.map(
            (appointment) => {

              const patient =
                appointment?.patient ||
                {};


              const status =
                appointment?.status ||
                'Pending';


              const isPending =
                status ===
                'Pending';


              const isAccepted =
                status ===
                'Accepted';


              const isUpdating =
                updatingId ===
                appointment?._id;


              return (

                <View
                  key={
                    appointment?._id
                  }
                  style={
                    styles.appointmentCard
                  }
                >


                  {/* =================================================
                      Patient Header
                  ================================================= */}

                  <View
                    style={
                      styles.patientHeader
                    }
                  >

                    <View
                      style={
                        styles.patientIcon
                      }
                    >

                      <User
                        size={22}
                        color="#3B82F6"
                      />

                    </View>


                    <View
                      style={
                        styles.patientInfo
                      }
                    >

                      <Text
                        style={
                          styles.patientName
                        }
                        numberOfLines={
                          1
                        }
                      >
                        {
                          patient?.name ||
                          'Unknown Patient'
                        }
                      </Text>


                      <Text
                        style={
                          styles.patientEmail
                        }
                        numberOfLines={
                          1
                        }
                      >
                        {
                          patient?.email ||
                          ''
                        }
                      </Text>

                    </View>


                    {/* Status */}

                    <View
                      style={[
                        styles.statusBadge,
                        getStatusStyle(
                          status
                        ),
                      ]}
                    >

                      <Text
                        style={
                          styles.statusText
                        }
                      >
                        {
                          status
                        }
                      </Text>

                    </View>

                  </View>


                  {/* =================================================
                      Appointment Details
                  ================================================= */}

                  <View
                    style={
                      styles.detailsContainer
                    }
                  >

                    <View
                      style={
                        styles.detailRow
                      }
                    >

                      <Calendar
                        size={16}
                        color="#64748B"
                      />


                      <Text
                        style={
                          styles.detailText
                        }
                      >
                        {
                          formatDate(
                            appointment?.date
                          )
                        }
                      </Text>

                    </View>


                    <View
                      style={
                        styles.detailRow
                      }
                    >

                      <Clock
                        size={16}
                        color="#64748B"
                      />


                      <Text
                        style={
                          styles.detailText
                        }
                      >
                        {
                          appointment?.timeSlot ||
                          'Not specified'
                        }
                      </Text>

                    </View>

                  </View>


                  {/* =================================================
                      Appointment Type
                  ================================================= */}

                  <Text
                    style={
                      styles.appointmentType
                    }
                  >
                    Type:{' '}
                    {
                      appointment?.appointmentType ||
                      'In-Person'
                    }
                  </Text>


                  {/* =================================================
                      Symptoms
                  ================================================= */}

                  {appointment?.symptoms ? (

                    <View
                      style={
                        styles.symptomsBox
                      }
                    >

                      <Text
                        style={
                          styles.symptomsLabel
                        }
                      >
                        Symptoms
                      </Text>


                      <Text
                        style={
                          styles.symptomsText
                        }
                      >
                        {
                          appointment.symptoms
                        }
                      </Text>

                    </View>

                  ) : null}


                  {/* =================================================
                      Notes
                  ================================================= */}

                  {!appointment?.symptoms &&
                    appointment?.notes ? (

                      <View
                        style={
                          styles.symptomsBox
                        }
                      >

                        <Text
                          style={
                            styles.symptomsLabel
                          }
                        >
                          Notes
                        </Text>


                        <Text
                          style={
                            styles.symptomsText
                          }
                        >
                          {
                            appointment.notes
                          }
                        </Text>

                      </View>

                    ) : null}


                  {/* =================================================
                      Pending Actions
                  ================================================= */}

                  {isPending && (

                    <View
                      style={
                        styles.actionButtons
                      }
                    >


                      {/* Reject */}

                      <TouchableOpacity

                        style={
                          styles.rejectButton
                        }

                        disabled={
                          isUpdating
                        }

                        onPress={() =>
                          handleReject(
                            appointment._id
                          )
                        }

                        activeOpacity={
                          0.8
                        }

                      >

                        {isUpdating ? (

                          <ActivityIndicator
                            size="small"
                            color="#DC2626"
                          />

                        ) : (

                          <>

                            <XCircle
                              size={18}
                              color="#DC2626"
                            />


                            <Text
                              style={
                                styles.rejectText
                              }
                            >
                              Reject
                            </Text>

                          </>

                        )}

                      </TouchableOpacity>


                      {/* Accept */}

                      <TouchableOpacity

                        style={
                          styles.acceptButton
                        }

                        disabled={
                          isUpdating
                        }

                        onPress={() =>
                          handleAccept(
                            appointment._id
                          )
                        }

                        activeOpacity={
                          0.8
                        }

                      >

                        {isUpdating ? (

                          <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                          />

                        ) : (

                          <>

                            <CheckCircle
                              size={18}
                              color="#FFFFFF"
                            />


                            <Text
                              style={
                                styles.acceptText
                              }
                            >
                              Accept
                            </Text>

                          </>

                        )}

                      </TouchableOpacity>

                    </View>

                  )}


                  {/* =================================================
                      Accepted → Complete
                  ================================================= */}

                  {isAccepted && (

                    <TouchableOpacity

                      style={
                        styles.completeButton
                      }

                      disabled={
                        isUpdating
                      }

                      onPress={() =>
                        handleComplete(
                          appointment._id
                        )
                      }

                      activeOpacity={
                        0.8
                      }

                    >

                      {isUpdating ? (

                        <ActivityIndicator
                          size="small"
                          color="#FFFFFF"
                        />

                      ) : (

                        <>

                          <CheckCircle
                            size={18}
                            color="#FFFFFF"
                          />


                          <Text
                            style={
                              styles.completeText
                            }
                          >
                            Complete Appointment
                          </Text>

                        </>

                      )}

                    </TouchableOpacity>

                  )}

                </View>

              );

            }
          )}

      </ScrollView>

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
        '#D7F2FA',

    },


    // =================================================
    // Header
    // =================================================

    topHeader: {

      paddingHorizontal: 20,

      paddingTop: 12,

      paddingBottom: 10,

      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

    },


    headerTitle: {

      fontSize: 22,

      fontWeight:
        '800',

      color:
        '#0F172A',

    },


    headerSubtitle: {

      fontSize: 12,

      color:
        '#64748B',

      marginTop: 3,

    },


    logoutButton: {

      width: 44,

      height: 44,

      backgroundColor:
        '#1E88E5',

      borderRadius: 12,

      justifyContent:
        'center',

      alignItems:
        'center',

      elevation: 4,

    },


    // =================================================
    // Scroll
    // =================================================

    scrollContent: {

      paddingBottom: 40,

    },


    // =================================================
    // Banner
    // =================================================

    bannerSection: {

      height: 170,

      paddingHorizontal: 24,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

    },


    bannerTextContainer: {

      flex: 1,

    },


    welcomeText: {

      fontSize: 30,

      fontWeight:
        '800',

      color:
        '#4C84E6',

    },


    doctorSubtitle: {

      fontSize: 13,

      color:
        '#64748B',

      marginTop: 8,

      maxWidth: 170,

    },


    doctorImage: {

      width: 160,

      height: 170,

    },


    // =================================================
    // Statistics
    // =================================================

    statsContainer: {

      flexDirection:
        'row',

      paddingHorizontal: 16,

      marginBottom: 18,

    },


    statCard: {

      flex: 1,

      backgroundColor:
        '#FFFFFF',

      borderRadius: 16,

      marginHorizontal: 5,

      paddingVertical: 15,

      alignItems:
        'center',

      elevation: 2,

    },


    statIcon: {

      width: 42,

      height: 42,

      borderRadius: 12,

      justifyContent:
        'center',

      alignItems:
        'center',

      marginBottom: 7,

    },


    pendingIcon: {

      backgroundColor:
        '#FEF3C7',

    },


    acceptedIcon: {

      backgroundColor:
        '#DCFCE7',

    },


    totalIcon: {

      backgroundColor:
        '#DBEAFE',

    },


    statNumber: {

      fontSize: 20,

      fontWeight:
        '800',

      color:
        '#0F172A',

    },


    statLabel: {

      fontSize: 11,

      color:
        '#64748B',

      marginTop: 2,

    },


    // =================================================
    // Doctor Details Button
    // =================================================

    doctorDetailsButton: {

      marginHorizontal: 20,

      marginBottom: 20,

      backgroundColor:
        '#3B82F6',

      borderRadius: 14,

      paddingVertical: 15,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      gap: 9,

      elevation: 3,

    },


    doctorDetailsText: {

      color:
        '#FFFFFF',

      fontSize: 15,

      fontWeight:
        '800',

    },


    // =================================================
    // Section Header
    // =================================================

    sectionHeader: {

      paddingHorizontal: 20,

      marginBottom: 12,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

    },


    sectionTitle: {

      fontSize: 19,

      fontWeight:
        '800',

      color:
        '#0F172A',

    },


    sectionSubtitle: {

      fontSize: 12,

      color:
        '#64748B',

      marginTop: 3,

    },


    refreshButton: {

      width: 40,

      height: 40,

      borderRadius: 12,

      backgroundColor:
        '#FFFFFF',

      justifyContent:
        'center',

      alignItems:
        'center',

    },


    // =================================================
    // Loading
    // =================================================

    loadingContainer: {

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingVertical: 50,

    },


    loadingText: {

      marginTop: 12,

      fontSize: 14,

      color:
        '#64748B',

    },


    // =================================================
    // Empty
    // =================================================

    emptyContainer: {

      backgroundColor:
        '#FFFFFF',

      marginHorizontal: 20,

      borderRadius: 18,

      paddingVertical: 45,

      paddingHorizontal: 25,

      alignItems:
        'center',

    },


    emptyIcon: {

      width: 80,

      height: 80,

      borderRadius: 40,

      backgroundColor:
        '#F1F5F9',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginBottom: 15,

    },


    emptyTitle: {

      fontSize: 18,

      fontWeight:
        '800',

      color:
        '#0F172A',

    },


    emptyText: {

      fontSize: 13,

      color:
        '#64748B',

      textAlign:
        'center',

      marginTop: 7,

    },


    // =================================================
    // Appointment Card
    // =================================================

    appointmentCard: {

      backgroundColor:
        '#FFFFFF',

      marginHorizontal: 20,

      marginBottom: 15,

      borderRadius: 18,

      padding: 16,

      elevation: 2,

    },


    // =================================================
    // Patient Header
    // =================================================

    patientHeader: {

      flexDirection:
        'row',

      alignItems:
        'center',

    },


    patientIcon: {

      width: 48,

      height: 48,

      borderRadius: 14,

      backgroundColor:
        '#EAEFFE',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 12,

    },


    patientInfo: {

      flex: 1,

      paddingRight: 8,

    },


    patientName: {

      fontSize: 16,

      fontWeight:
        '800',

      color:
        '#0F172A',

    },


    patientEmail: {

      fontSize: 11,

      color:
        '#64748B',

      marginTop: 3,

    },


    // =================================================
    // Status
    // =================================================

    statusBadge: {

      paddingHorizontal: 9,

      paddingVertical: 5,

      borderRadius: 7,

    },


    pendingStatus: {

      backgroundColor:
        '#FEF3C7',

    },


    acceptedStatus: {

      backgroundColor:
        '#DCFCE7',

    },


    rejectedStatus: {

      backgroundColor:
        '#FEE2E2',

    },


    cancelledStatus: {

      backgroundColor:
        '#FEE2E2',

    },


    completedStatus: {

      backgroundColor:
        '#DBEAFE',

    },


    statusText: {

      fontSize: 10,

      fontWeight:
        '800',

      color:
        '#0F172A',

    },


    // =================================================
    // Appointment Details
    // =================================================

    detailsContainer: {

      flexDirection:
        'row',

      marginTop: 15,

      gap: 18,

    },


    detailRow: {

      flexDirection:
        'row',

      alignItems:
        'center',

      gap: 6,

    },


    detailText: {

      fontSize: 13,

      color:
        '#334155',

      fontWeight:
        '600',

    },


    // =================================================
    // Appointment Type
    // =================================================

    appointmentType: {

      fontSize: 11,

      color:
        '#64748B',

      marginTop: 10,

    },


    // =================================================
    // Symptoms / Notes
    // =================================================

    symptomsBox: {

      backgroundColor:
        '#F8FAFC',

      borderRadius: 10,

      padding: 10,

      marginTop: 13,

    },


    symptomsLabel: {

      fontSize: 11,

      color:
        '#64748B',

      fontWeight:
        '700',

      marginBottom: 4,

    },


    symptomsText: {

      fontSize: 12,

      color:
        '#334155',

      lineHeight: 18,

    },


    // =================================================
    // Action Buttons
    // =================================================

    actionButtons: {

      flexDirection:
        'row',

      gap: 10,

      marginTop: 15,

    },


    // =================================================
    // Reject
    // =================================================

    rejectButton: {

      flex: 1,

      height: 44,

      borderRadius: 11,

      borderWidth: 1,

      borderColor:
        '#FCA5A5',

      backgroundColor:
        '#FFF5F5',

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      gap: 7,

    },


    rejectText: {

      color:
        '#DC2626',

      fontSize: 13,

      fontWeight:
        '800',

    },


    // =================================================
    // Accept
    // =================================================

    acceptButton: {

      flex: 1,

      height: 44,

      borderRadius: 11,

      backgroundColor:
        '#16A34A',

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      gap: 7,

    },


    acceptText: {

      color:
        '#FFFFFF',

      fontSize: 13,

      fontWeight:
        '800',

    },


    // =================================================
    // Complete
    // =================================================

    completeButton: {

      marginTop: 15,

      height: 44,

      borderRadius: 11,

      backgroundColor:
        '#2563EB',

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      gap: 7,

    },


    completeText: {

      color:
        '#FFFFFF',

      fontSize: 13,

      fontWeight:
        '800',

    },

  });