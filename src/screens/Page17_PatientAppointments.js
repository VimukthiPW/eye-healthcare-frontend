import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';

import {
  Calendar,
  Clock,
  User,
  RefreshCw,
  MapPin,
  XCircle,
  CheckCircle,
} from 'lucide-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import StatusBarMock from '../components/StatusBarMock';
import Header from '../components/Header';

import API_URL from '../config/api';


// =================================================
// Page 17 - Appointments
// Patient + Doctor
// =================================================

export default function Page17_PatientAppointments({
  onNavigate,
}) {

  const [role, setRole] = useState(null);

  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [actionId, setActionId] =
    useState(null);


  // =================================================
  // Load User Role
  // =================================================

  const loadUserRole = useCallback(async () => {

    try {

      const userData =
        await AsyncStorage.getItem('user');

      if (!userData) {

        Alert.alert(
          'Login Required',
          'Please login again.'
        );

        return null;
      }

      const user =
        JSON.parse(userData);

      console.log(
        '================================='
      );

      console.log(
        'Logged User:',
        user
      );

      console.log(
        'User Role:',
        user.role
      );

      console.log(
        '================================='
      );

      setRole(user.role);

      return user.role;

    } catch (error) {

      console.error(
        'Load user role error:',
        error
      );

      Alert.alert(
        'Error',
        'Unable to identify user role.'
      );

      return null;
    }

  }, []);


  // =================================================
  // Get Appointments
  // =================================================

  const fetchAppointments = useCallback(
    async (currentRole, showLoader = true) => {

      try {

        if (showLoader) {
          setLoading(true);
        }


        const token =
          await AsyncStorage.getItem('token');


        if (!token) {

          Alert.alert(
            'Login Required',
            'Please login again.'
          );

          return;
        }


        if (!currentRole) {
          return;
        }


        // =================================================
        // API Endpoint Based On Role
        // =================================================

        const endpoint =
          currentRole === 'Doctor'
            ? '/api/appointments/doctor'
            : '/api/appointments/patient';


        console.log(
          '================================='
        );

        console.log(
          'Appointments Screen'
        );

        console.log(
          'Role:',
          currentRole
        );

        console.log(
          'Endpoint:',
          `${API_URL}${endpoint}`
        );

        console.log(
          '================================='
        );


        // =================================================
        // API Request
        // =================================================

        const response =
          await fetch(
            `${API_URL}${endpoint}`,
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


        const data =
          await response.json();


        console.log(
          'Appointments response:',
          data
        );


        if (!response.ok) {

          throw new Error(
            data.message ||
            'Failed to load appointments'
          );
        }


        // =================================================
        // Save Appointments
        // =================================================

        if (Array.isArray(data)) {

          setAppointments(data);

        }

        else if (
          Array.isArray(
            data?.appointments
          )
        ) {

          setAppointments(
            data.appointments
          );

        }

        else {

          setAppointments([]);

        }


      } catch (error) {

        console.error(
          'Appointments error:',
          error
        );


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
  // Initial Load
  // =================================================

  useEffect(() => {

    const initialize = async () => {

      const currentRole =
        await loadUserRole();

      if (currentRole) {

        await fetchAppointments(
          currentRole
        );

      }

    };

    initialize();

  }, [
    loadUserRole,
    fetchAppointments,
  ]);


  // =================================================
  // Refresh
  // =================================================

  const handleRefresh = async () => {

    setRefreshing(true);

    const currentRole =
      role ||
      await loadUserRole();

    if (currentRole) {

      await fetchAppointments(
        currentRole,
        false
      );

    } else {

      setRefreshing(false);

    }

  };


  // =================================================
  // Back Navigation
  // =================================================

  const handleBack = () => {

    if (role === 'Doctor') {

      onNavigate(
        'Page15_DoctorHome'
      );

      return;
    }


    onNavigate(
      'Page05_PatientHome'
    );

  };


  // =================================================
  // Update Doctor Appointment Status
  // =================================================

  const updateAppointmentStatus = async (
    appointmentId,
    newStatus
  ) => {

    try {

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


      setActionId(
        appointmentId
      );


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

            body: JSON.stringify({
              status: newStatus,
            }),
          }
        );


      const data =
        await response.json();


      console.log(
        'Status update:',
        data
      );


      if (!response.ok) {

        throw new Error(
          data.message ||
          'Failed to update appointment'
        );
      }


      // Update local state
      setAppointments(
        previous =>
          previous.map(
            appointment =>
              appointment._id ===
              appointmentId

                ? {
                    ...appointment,
                    status:
                      newStatus,
                  }

                : appointment
          )
      );


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


    } catch (error) {

      console.error(
        'Update status error:',
        error
      );


      Alert.alert(
        'Update Failed',
        error.message ||
        'Unable to update appointment.'
      );

    } finally {

      setActionId(null);

    }

  };


  // =================================================
  // Doctor Reject Confirmation
  // =================================================

  const handleReject = (
    appointment
  ) => {

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
              appointment._id,
              'Rejected'
            ),
        },
      ]
    );

  };


  // =================================================
  // Patient Cancel Confirmation
  // =================================================

  const handleCancel = (
    appointment
  ) => {

    const doctorName =
      appointment.doctor?.name ||
      'this doctor';


    Alert.alert(
      'Cancel Appointment',

      `Are you sure you want to cancel your appointment with ${doctorName}?`,

      [
        {
          text: 'No',
          style: 'cancel',
        },

        {
          text: 'Yes, Cancel',
          style: 'destructive',

          onPress: () =>
            cancelAppointment(
              appointment._id
            ),
        },
      ]
    );

  };


  // =================================================
  // Patient Cancel API
  // =================================================

  const cancelAppointment = async (
    appointmentId
  ) => {

    try {

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


      setActionId(
        appointmentId
      );


      const response =
        await fetch(
          `${API_URL}/api/appointments/${appointmentId}/cancel`,
          {
            method: 'PUT',

            headers: {
              Authorization:
                `Bearer ${token}`,

              'Content-Type':
                'application/json',
            },
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          'Failed to cancel appointment'
        );
      }


      Alert.alert(
        'Appointment Cancelled',
        'Your appointment has been cancelled successfully.'
      );


      await fetchAppointments(
        'Patient',
        false
      );


    } catch (error) {

      console.error(
        'Cancel appointment error:',
        error
      );


      Alert.alert(
        'Cancellation Failed',
        error.message ||
        'Unable to cancel appointment.'
      );

    } finally {

      setActionId(null);

    }

  };


  // =================================================
  // Date Format
  // =================================================

  const formatDate = (
    date
  ) => {

    if (!date) {
      return 'Date not available';
    }


    try {

      return new Date(
        date
      ).toLocaleDateString(
        'en-US',
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }
      );

    } catch {

      return date;

    }

  };


  // =================================================
  // Status Style
  // =================================================

  const getStatusStyle = (
    status
  ) => {

    switch (status) {

      case 'Accepted':

        return {
          backgroundColor:
            '#DCFCE7',

          color:
            '#15803D',
        };


      case 'Rejected':

        return {
          backgroundColor:
            '#FEE2E2',

          color:
            '#DC2626',
        };


      case 'Cancelled':

        return {
          backgroundColor:
            '#FEE2E2',

          color:
            '#DC2626',
        };


      case 'Completed':

        return {
          backgroundColor:
            '#DBEAFE',

          color:
            '#2563EB',
        };


      default:

        return {
          backgroundColor:
            '#FEF3C7',

          color:
            '#D97706',
        };

    }

  };


  // =================================================
  // Loading
  // =================================================

  if (
    loading &&
    !role
  ) {

    return (

      <SafeAreaView
        style={styles.container}
      >

        <StatusBarMock />

        <View
          style={styles.loadingScreen}
        >

          <ActivityIndicator
            size="large"
            color="#3B82F6"
          />

          <Text
            style={styles.loadingText}
          >
            Loading appointments...
          </Text>

        </View>

      </SafeAreaView>

    );

  }


  // =================================================
  // Render
  // =================================================

  return (

    <SafeAreaView
      style={styles.container}
    >

      <StatusBarMock />


      {/* =================================================
          Header
      ================================================= */}

      <View
        style={styles.headerWrapper}
      >

        <Header
          title={
            role === 'Doctor'
              ? 'Patient Appointments'
              : 'My Appointments'
          }

          onBack={
            handleBack
          }
        />


        <TouchableOpacity
          style={
            styles.refreshButton
          }

          onPress={
            handleRefresh
          }

          disabled={
            refreshing
          }
        >

          {refreshing ? (

            <ActivityIndicator
              size="small"
              color="#3B82F6"
            />

          ) : (

            <RefreshCw
              size={19}
              color="#3B82F6"
            />

          )}

        </TouchableOpacity>

      </View>


      {/* =================================================
          Content
      ================================================= */}

      <ScrollView

        contentContainerStyle={
          styles.content
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
            Empty
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

              {role === 'Doctor'
                ? 'Patient appointment requests'
                : 'Your booked appointments'
              }

              {'\n'}

              will appear here.

            </Text>


            {role !== 'Doctor' && (

              <TouchableOpacity
                style={
                  styles.bookButton
                }

                onPress={() =>
                  onNavigate(
                    'Page07_DoctorsList'
                  )
                }
              >

                <Text
                  style={
                    styles.bookButtonText
                  }
                >
                  Book An Appointment
                </Text>

              </TouchableOpacity>

            )}

          </View>

        )}


        {/* =================================================
            APPOINTMENT LIST
        ================================================= */}

        {!loading &&
          appointments.map(
            appointment => {

              // =================================================
              // DOCTOR VIEW
              // =================================================

              if (
                role ===
                'Doctor'
              ) {

                const patient =
                  appointment.patient ||
                  {};

                const status =
                  appointment.status ||
                  'Pending';

                const statusStyle =
                  getStatusStyle(
                    status
                  );

                const isPending =
                  status ===
                  'Pending';

                const isUpdating =
                  actionId ===
                  appointment._id;


                return (

                  <View
                    key={
                      appointment._id
                    }

                    style={
                      styles.appointmentCard
                    }
                  >

                    {/* Patient Header */}

                    <View
                      style={
                        styles.personHeader
                      }
                    >

                      <View
                        style={
                          styles.personIcon
                        }
                      >

                        <User
                          size={22}
                          color="#3B82F6"
                        />

                      </View>


                      <View
                        style={
                          styles.personInfo
                        }
                      >

                        <Text
                          style={
                            styles.personName
                          }
                        >
                          {
                            patient.name ||
                            'Unknown Patient'
                          }
                        </Text>


                        <Text
                          style={
                            styles.personEmail
                          }
                        >
                          {
                            patient.email ||
                            ''
                          }
                        </Text>

                      </View>


                      <View
                        style={[
                          styles.statusBadge,

                          {
                            backgroundColor:
                              statusStyle.backgroundColor,
                          },
                        ]}
                      >

                        <Text
                          style={[
                            styles.statusText,

                            {
                              color:
                                statusStyle.color,
                            },
                          ]}
                        >
                          {status}
                        </Text>

                      </View>

                    </View>


                    {/* Date & Time */}

                    <View
                      style={
                        styles.detailsContainer
                      }
                    >

                      <View
                        style={
                          styles.detailCard
                        }
                      >

                        <Calendar
                          size={18}
                          color="#3B82F6"
                        />

                        <View>

                          <Text
                            style={
                              styles.detailLabel
                            }
                          >
                            Date
                          </Text>

                          <Text
                            style={
                              styles.detailValue
                            }
                          >
                            {
                              formatDate(
                                appointment.date
                              )
                            }
                          </Text>

                        </View>

                      </View>


                      <View
                        style={
                          styles.detailCard
                        }
                      >

                        <Clock
                          size={18}
                          color="#3B82F6"
                        />

                        <View>

                          <Text
                            style={
                              styles.detailLabel
                            }
                          >
                            Time
                          </Text>

                          <Text
                            style={
                              styles.detailValue
                            }
                          >
                            {
                              appointment.timeSlot ||
                              'N/A'
                            }
                          </Text>

                        </View>

                      </View>

                    </View>


                    {/* Type */}

                    <View
                      style={
                        styles.typeContainer
                      }
                    >

                      <Text
                        style={
                          styles.typeLabel
                        }
                      >
                        Appointment Type
                      </Text>

                      <Text
                        style={
                          styles.typeValue
                        }
                      >
                        {
                          appointment.appointmentType ||
                          'In-Person'
                        }
                      </Text>

                    </View>


                    {/* Symptoms */}

                    {appointment.symptoms ? (

                      <View
                        style={
                          styles.notesBox
                        }
                      >

                        <Text
                          style={
                            styles.notesLabel
                          }
                        >
                          Symptoms
                        </Text>

                        <Text
                          style={
                            styles.notesText
                          }
                        >
                          {
                            appointment.symptoms
                          }
                        </Text>

                      </View>

                    ) : null}


                    {/* Notes */}

                    {appointment.notes ? (

                      <View
                        style={
                          styles.notesBox
                        }
                      >

                        <Text
                          style={
                            styles.notesLabel
                          }
                        >
                          Notes
                        </Text>

                        <Text
                          style={
                            styles.notesText
                          }
                        >
                          {
                            appointment.notes
                          }
                        </Text>

                      </View>

                    ) : null}


                    {/* Accept / Reject */}

                    {isPending && (

                      <View
                        style={
                          styles.actionButtons
                        }
                      >

                        <TouchableOpacity
                          style={
                            styles.rejectButton
                          }

                          disabled={
                            isUpdating
                          }

                          onPress={() =>
                            handleReject(
                              appointment
                            )
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


                        <TouchableOpacity
                          style={
                            styles.acceptButton
                          }

                          disabled={
                            isUpdating
                          }

                          onPress={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              'Accepted'
                            )
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

                  </View>

                );

              }


              // =================================================
              // PATIENT VIEW
              // =================================================

              const doctor =
                appointment.doctor ||
                {};

              const status =
                appointment.status ||
                'Pending';

              const statusStyle =
                getStatusStyle(
                  status
                );

              const canCancel =
                status ===
                  'Pending' ||
                status ===
                  'Accepted';

              const isCancelling =
                actionId ===
                appointment._id;


              return (

                <View
                  key={
                    appointment._id
                  }

                  style={
                    styles.appointmentCard
                  }
                >

                  {/* Doctor Header */}

                  <View
                    style={
                      styles.personHeader
                    }
                  >

                    <View
                      style={
                        styles.personIcon
                      }
                    >

                      <User
                        size={23}
                        color="#3B82F6"
                      />

                    </View>


                    <View
                      style={
                        styles.personInfo
                      }
                    >

                      <Text
                        style={
                          styles.personName
                        }
                      >
                        {
                          doctor.name ||
                          'Doctor'
                        }
                      </Text>


                      <Text
                        style={
                          styles.personEmail
                        }
                      >
                        {
                          doctor.specialization ||
                          'Ophthalmologist'
                        }
                      </Text>

                    </View>


                    <View
                      style={[
                        styles.statusBadge,

                        {
                          backgroundColor:
                            statusStyle.backgroundColor,
                        },
                      ]}
                    >

                      <Text
                        style={[
                          styles.statusText,

                          {
                            color:
                              statusStyle.color,
                          },
                        ]}
                      >
                        {status}
                      </Text>

                    </View>

                  </View>


                  {/* Hospital */}

                  {doctor.hospital ? (

                    <View
                      style={
                        styles.infoRow
                      }
                    >

                      <MapPin
                        size={17}
                        color="#64748B"
                      />

                      <Text
                        style={
                          styles.infoText
                        }
                      >
                        {
                          doctor.hospital
                        }
                      </Text>

                    </View>

                  ) : null}


                  {/* Date & Time */}

                  <View
                    style={
                      styles.detailsContainer
                    }
                  >

                    <View
                      style={
                        styles.detailCard
                      }
                    >

                      <Calendar
                        size={19}
                        color="#3B82F6"
                      />

                      <View>

                        <Text
                          style={
                            styles.detailLabel
                          }
                        >
                          Date
                        </Text>

                        <Text
                          style={
                            styles.detailValue
                          }
                        >
                          {
                            formatDate(
                              appointment.date
                            )
                          }
                        </Text>

                      </View>

                    </View>


                    <View
                      style={
                        styles.detailCard
                      }
                    >

                      <Clock
                        size={19}
                        color="#3B82F6"
                      />

                      <View>

                        <Text
                          style={
                            styles.detailLabel
                          }
                        >
                          Time
                        </Text>

                        <Text
                          style={
                            styles.detailValue
                          }
                        >
                          {
                            appointment.timeSlot ||
                            'N/A'
                          }
                        </Text>

                      </View>

                    </View>

                  </View>


                  {/* Type */}

                  <View
                    style={
                      styles.typeContainer
                    }
                  >

                    <Text
                      style={
                        styles.typeLabel
                      }
                    >
                      Appointment Type
                    </Text>

                    <Text
                      style={
                        styles.typeValue
                      }
                    >
                      {
                        appointment.appointmentType ||
                        'In-Person'
                      }
                    </Text>

                  </View>


                  {/* Symptoms */}

                  {appointment.symptoms ? (

                    <View
                      style={
                        styles.notesBox
                      }
                    >

                      <Text
                        style={
                          styles.notesLabel
                        }
                      >
                        Symptoms
                      </Text>

                      <Text
                        style={
                          styles.notesText
                        }
                      >
                        {
                          appointment.symptoms
                        }
                      </Text>

                    </View>

                  ) : null}


                  {/* Notes */}

                  {appointment.notes ? (

                    <View
                      style={
                        styles.notesBox
                      }
                    >

                      <Text
                        style={
                          styles.notesLabel
                        }
                      >
                        Notes
                      </Text>

                      <Text
                        style={
                          styles.notesText
                        }
                      >
                        {
                          appointment.notes
                        }
                      </Text>

                    </View>

                  ) : null}


                  {/* Booking Date */}

                  <Text
                    style={
                      styles.bookingDate
                    }
                  >
                    Booked on:{' '}
                    {
                      formatDate(
                        appointment.createdAt
                      )
                    }
                  </Text>


                  {/* Cancel */}

                  {canCancel && (

                    <TouchableOpacity
                      style={
                        styles.cancelButton
                      }

                      disabled={
                        isCancelling
                      }

                      onPress={() =>
                        handleCancel(
                          appointment
                        )
                      }
                    >

                      {isCancelling ? (

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
                              styles.cancelButtonText
                            }
                          >
                            Cancel Appointment
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
        '#FFFFFF',
    },


    headerWrapper: {
      position:
        'relative',
    },


    refreshButton: {
      position:
        'absolute',

      right: 18,
      top: 12,

      width: 38,
      height: 38,

      borderRadius: 11,

      backgroundColor:
        '#F1F5F9',

      justifyContent:
        'center',

      alignItems:
        'center',
    },


    content: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 35,
    },


    loadingScreen: {
      flex: 1,

      alignItems:
        'center',

      justifyContent:
        'center',
    },


    loadingContainer: {
      alignItems:
        'center',

      justifyContent:
        'center',

      paddingVertical: 60,
    },


    loadingText: {
      marginTop: 12,

      fontSize: 14,

      color:
        '#64748B',
    },


    emptyContainer: {
      backgroundColor:
        '#FFFFFF',

      borderRadius: 18,

      paddingVertical: 50,
      paddingHorizontal: 25,

      alignItems:
        'center',

      marginTop: 20,

      borderWidth: 1,

      borderColor:
        '#E2E8F0',
    },


    emptyIcon: {
      width: 82,
      height: 82,

      borderRadius: 41,

      backgroundColor:
        '#F1F5F9',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginBottom: 16,
    },


    emptyTitle: {
      fontSize: 19,

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

      lineHeight: 19,

      marginTop: 7,
    },


    bookButton: {
      marginTop: 20,

      backgroundColor:
        '#5B92E5',

      paddingHorizontal: 22,
      paddingVertical: 12,

      borderRadius: 22,
    },


    bookButtonText: {
      color:
        '#FFFFFF',

      fontSize: 13,

      fontWeight:
        '800',
    },


    appointmentCard: {
      backgroundColor:
        '#FFFFFF',

      borderRadius: 18,

      borderWidth: 1,

      borderColor:
        '#E2E8F0',

      padding: 15,

      marginBottom: 15,

      elevation: 2,

      shadowColor:
        '#000',

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity:
        0.05,

      shadowRadius: 4,
    },


    personHeader: {
      flexDirection:
        'row',

      alignItems:
        'center',
    },


    personIcon: {
      width: 48,
      height: 48,

      borderRadius: 14,

      backgroundColor:
        '#EAF1FF',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 12,
    },


    personInfo: {
      flex: 1,
    },


    personName: {
      fontSize: 16,

      fontWeight:
        '800',

      color:
        '#0F172A',
    },


    personEmail: {
      fontSize: 11,

      color:
        '#64748B',

      marginTop: 3,
    },


    statusBadge: {
      paddingHorizontal: 9,
      paddingVertical: 6,

      borderRadius: 8,

      marginLeft: 5,
    },


    statusText: {
      fontSize: 10,

      fontWeight:
        '800',
    },


    infoRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      marginTop: 13,

      gap: 7,
    },


    infoText: {
      flex: 1,

      fontSize: 12,

      color:
        '#475569',

      fontWeight:
        '600',
    },


    detailsContainer: {
      flexDirection:
        'row',

      marginTop: 14,

      gap: 10,
    },


    detailCard: {
      flex: 1,

      backgroundColor:
        '#F8FAFC',

      borderRadius: 11,

      padding: 11,

      flexDirection:
        'row',

      alignItems:
        'center',

      gap: 8,
    },


    detailLabel: {
      fontSize: 9,

      color:
        '#94A3B8',

      marginBottom: 2,
    },


    detailValue: {
      fontSize: 11,

      color:
        '#334155',

      fontWeight:
        '700',
    },


    typeContainer: {
      marginTop: 12,

      paddingTop: 11,

      borderTopWidth: 1,

      borderTopColor:
        '#F1F5F9',
    },


    typeLabel: {
      fontSize: 10,

      color:
        '#94A3B8',
    },


    typeValue: {
      fontSize: 12,

      color:
        '#334155',

      fontWeight:
        '700',

      marginTop: 3,
    },


    notesBox: {
      backgroundColor:
        '#F8FAFC',

      borderRadius: 10,

      padding: 10,

      marginTop: 9,
    },


    notesLabel: {
      fontSize: 10,

      color:
        '#64748B',

      fontWeight:
        '800',

      marginBottom: 4,
    },


    notesText: {
      fontSize: 11,

      color:
        '#334155',

      lineHeight: 17,
    },


    bookingDate: {
      fontSize: 9,

      color:
        '#94A3B8',

      marginTop: 12,

      textAlign:
        'right',
    },


    // =================================================
    // Doctor Action Buttons
    // =================================================

    actionButtons: {
      flexDirection:
        'row',

      gap: 10,

      marginTop: 14,
    },


    rejectButton: {
      flex: 1,

      height: 44,

      borderRadius: 12,

      borderWidth: 1,

      borderColor:
        '#FCA5A5',

      backgroundColor:
        '#FFF5F5',

      flexDirection:
        'row',

      justifyContent:
        'center',

      alignItems:
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


    acceptButton: {
      flex: 1,

      height: 44,

      borderRadius: 12,

      backgroundColor:
        '#16A34A',

      flexDirection:
        'row',

      justifyContent:
        'center',

      alignItems:
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
    // Patient Cancel
    // =================================================

    cancelButton: {
      marginTop: 13,

      height: 44,

      borderRadius: 22,

      borderWidth: 1,

      borderColor:
        '#FCA5A5',

      backgroundColor:
        '#FFF5F5',

      flexDirection:
        'row',

      justifyContent:
        'center',

      alignItems:
        'center',

      gap: 7,
    },


    cancelButtonText: {
      color:
        '#DC2626',

      fontSize: 13,

      fontWeight:
        '800',
    },

  });