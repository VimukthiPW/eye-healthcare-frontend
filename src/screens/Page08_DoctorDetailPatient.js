import React, { useEffect, useMemo, useState } from 'react';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import StatusBarMock from '../components/StatusBarMock';
import Header from '../components/Header';

import API_URL from '../config/api';


// =================================================
// Page 08 - Doctor Detail Patient
// =================================================

export default function Page08_DoctorDetailPatient({
  onNavigate,
  selectedDoctor,
}) {

  // =================================================
  // Doctor State
  // =================================================

  const [doctor, setDoctor] = useState(
    selectedDoctor || {
      name: 'Dr. Rishi',
      image: require('../../assets/dr_rishi.png'),
    }
  );


  // =================================================
  // Doctor ID
  // =================================================

  const doctorId =
    selectedDoctor?._id ||
    selectedDoctor?.id ||
    selectedDoctor?.userId;


  // =================================================
  // Doctor Image
  // =================================================

  const doctorImage =
    doctor?.avatar ||
    doctor?.image;


  // =================================================
  // EXACT Available Dates
  // =================================================

  const [availableDates, setAvailableDates] =
    useState([]);


  // =================================================
  // Available Time Slots
  // =================================================

  const [availableTimeSlots, setAvailableTimeSlots] =
    useState([]);


  // =================================================
  // Selected Date
  // =================================================

  const [selectedDate, setSelectedDate] =
    useState(null);


  // =================================================
  // Selected Time
  // =================================================

  const [selectedTime, setSelectedTime] =
    useState(null);


  // =================================================
  // Loading
  // =================================================

  const [loadingDoctor, setLoadingDoctor] =
    useState(true);


  // =================================================
  // Booking Loading
  // =================================================

  const [booking, setBooking] =
    useState(false);


  // =================================================
  // Normalize Time Slot
  // =================================================

  const normalizeTimeSlot = (time) => {

    if (!time) {
      return '';
    }


    if (typeof time === 'object') {

      time =
        time.time ||
        time.label ||
        time.value ||
        '';

    }


    return String(time).trim();

  };


  // =================================================
  // Format Exact Date
  // =================================================

  const formatExactDate = (dateString) => {

    if (!dateString) {
      return null;
    }


    const value =
      String(dateString).trim();


    // Expected:
    // YYYY-MM-DD

    const parts =
      value.split('-');


    if (parts.length !== 3) {
      return null;
    }


    const year =
      Number(parts[0]);

    const month =
      Number(parts[1]);

    const day =
      Number(parts[2]);


    if (
      !year ||
      !month ||
      !day
    ) {

      return null;

    }


    const date =
      new Date(
        year,
        month - 1,
        day
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return null;

    }


    const weekdayNames = [
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ];


    return {

      day:
        weekdayNames[
          date.getDay()
        ],

      date:
        String(day),

      month:
        month,

      year:
        year,

      fullDate:
        `${year}-${String(
          month
        ).padStart(2, '0')}-${String(
          day
        ).padStart(2, '0')}`,

    };

  };


  // =================================================
  // Load Latest Doctor Data
  // =================================================

  useEffect(() => {

    const loadDoctorAvailability =
      async () => {

        try {

          setLoadingDoctor(true);


          // -------------------------------------------------
          // Check Doctor ID
          // -------------------------------------------------

          if (!doctorId) {

            console.log(
              '❌ Doctor ID not found'
            );


            Alert.alert(
              'Doctor Information Missing',
              'Doctor ID was not found. Please go back and select the doctor again.'
            );


            return;

          }


          console.log(
            '================================='
          );

          console.log(
            'Loading Latest Doctor Data'
          );

          console.log(
            'Doctor ID:',
            doctorId
          );

          console.log(
            '================================='
          );


          // -------------------------------------------------
          // Get latest doctor data
          // -------------------------------------------------

          const response =
            await fetch(
              `${API_URL}/api/doctors/${doctorId}?_t=${Date.now()}`,
              {
                method: 'GET',

                headers: {
                  'Content-Type':
                    'application/json',

                  'Cache-Control':
                    'no-cache',

                  Pragma:
                    'no-cache',
                },

                cache: 'no-store',
              }
            );


          const data =
            await response.json();


          console.log(
            '================================='
          );

          console.log(
            'Doctor API Response:',
            data
          );

          console.log(
            'Database Available Dates:',
            data?.availableDates
          );

          console.log(
            'Database Available Time Slots:',
            data?.availableTimeSlots
          );

          console.log(
            '================================='
          );


          // -------------------------------------------------
          // API Error
          // -------------------------------------------------

          if (!response.ok) {

            throw new Error(
              data?.message ||
              'Failed to load doctor'
            );

          }


          // -------------------------------------------------
          // Doctor Object
          // -------------------------------------------------

          const apiDoctor =
            data?.doctor ||
            data;


          setDoctor(apiDoctor);


          // =================================================
          // EXACT AVAILABLE DATES
          // IMPORTANT:
          // Do NOT use availableDays here.
          // =================================================

          const dates =
            Array.isArray(
              apiDoctor?.availableDates
            )

              ? apiDoctor.availableDates
                  .map(
                    (date) =>
                      formatExactDate(date)
                  )
                  .filter(Boolean)

              : [];


          // -------------------------------------------------
          // Remove duplicate dates
          // -------------------------------------------------

          const uniqueDates = [];

          dates.forEach(
            (item) => {

              const alreadyExists =
                uniqueDates.some(
                  (existing) =>
                    existing.fullDate ===
                    item.fullDate
                );


              if (!alreadyExists) {

                uniqueDates.push(
                  item
                );

              }

            }
          );


          // -------------------------------------------------
          // Sort dates
          // -------------------------------------------------

          uniqueDates.sort(
            (a, b) =>
              a.fullDate.localeCompare(
                b.fullDate
              )
          );


          // =================================================
          // Available Time Slots
          // =================================================

          const times =
            Array.isArray(
              apiDoctor?.availableTimeSlots
            )

              ? apiDoctor.availableTimeSlots
                  .map(
                    (time) =>
                      normalizeTimeSlot(time)
                  )
                  .filter(Boolean)

              : [];


          // -------------------------------------------------
          // Remove duplicate time slots
          // -------------------------------------------------

          const uniqueTimes = [
            ...new Set(times),
          ];


          // =================================================
          // Update State
          // =================================================

          setAvailableDates(
            uniqueDates
          );


          setAvailableTimeSlots(
            uniqueTimes
          );


          // -------------------------------------------------
          // Reset Selected Date
          // -------------------------------------------------

          setSelectedDate(null);


          // -------------------------------------------------
          // Automatically select first exact date
          // -------------------------------------------------

          if (
            uniqueDates.length > 0
          ) {

            setSelectedDate(
              uniqueDates[0].fullDate
            );

          } else {

            setSelectedDate(
              null
            );

          }


          // -------------------------------------------------
          // Automatically select first time
          // -------------------------------------------------

          if (
            uniqueTimes.length > 0
          ) {

            setSelectedTime(
              uniqueTimes[0]
            );

          } else {

            setSelectedTime(
              null
            );

          }


          console.log(
            '================================='
          );

          console.log(
            'Final Exact Available Dates:',
            uniqueDates
          );

          console.log(
            'Final Available Times:',
            uniqueTimes
          );

          console.log(
            '================================='
          );


        } catch (error) {

          console.error(
            '❌ Load doctor availability error:',
            error
          );


          Alert.alert(
            'Error',
            'Unable to load doctor availability.'
          );


          setAvailableDates([]);

          setAvailableTimeSlots([]);

          setSelectedDate(null);

          setSelectedTime(null);


        } finally {

          setLoadingDoctor(false);

        }

      };


    loadDoctorAvailability();

  }, [doctorId]);


  // =================================================
  // Selected Date Object
  // =================================================

  const selectedDateObject =
    useMemo(() => {

      return availableDates.find(
        (item) =>
          item.fullDate ===
          selectedDate
      );

    }, [
      availableDates,
      selectedDate,
    ]);


  // =================================================
  // Select Date
  // =================================================

  const handleDateSelect =
    (fullDate) => {

      setSelectedDate(
        fullDate
      );

    };


  // =================================================
  // Select Time
  // =================================================

  const handleTimeSelect =
    (time) => {

      setSelectedTime(
        time
      );

    };


  // =================================================
  // Book Appointment
  // =================================================

  const handleBook =
    async () => {

      // -------------------------------------------------
      // Check Doctor ID
      // -------------------------------------------------

      if (!doctorId) {

        Alert.alert(
          'Doctor Information Missing',
          'Doctor ID was not found. Please go back and select the doctor again.'
        );

        return;

      }


      // -------------------------------------------------
      // Check Date
      // -------------------------------------------------

      if (!selectedDate) {

        Alert.alert(
          'Select Date',
          'Please select an available appointment date.'
        );

        return;

      }


      // -------------------------------------------------
      // Check Time
      // -------------------------------------------------

      if (!selectedTime) {

        Alert.alert(
          'Select Time',
          'Please select an available appointment time.'
        );

        return;

      }


      try {

        setBooking(true);


        // =================================================
        // Get Patient Token
        // =================================================

        const token =
          await AsyncStorage.getItem(
            'token'
          );


        if (!token) {

          Alert.alert(
            'Login Required',
            'Please login as a patient before booking an appointment.',
            [
              {
                text: 'OK',

                onPress: () =>
                  onNavigate(
                    'Page04_SignIn'
                  ),

              },
            ]
          );


          return;

        }


        // =================================================
        // Appointment Date
        // =================================================

        const appointmentDate =
          selectedDate;


        console.log(
          '================================='
        );

        console.log(
          'Booking Appointment'
        );

        console.log(
          'Doctor ID:',
          doctorId
        );

        console.log(
          'Date:',
          appointmentDate
        );

        console.log(
          'Time:',
          selectedTime
        );

        console.log(
          '================================='
        );


        // =================================================
        // POST Appointment
        // =================================================

        const response =
          await fetch(
            `${API_URL}/api/appointments`,
            {

              method: 'POST',

              headers: {

                Authorization:
                  `Bearer ${token}`,

                'Content-Type':
                  'application/json',

              },

              body:
                JSON.stringify({

                  doctorId:
                    doctorId,

                  date:
                    appointmentDate,

                  timeSlot:
                    selectedTime,

                  appointmentType:
                    'In-Person',

                  symptoms:
                    '',

                  notes:
                    'Appointment booked from mobile application',

                }),

            }
          );


        const data =
          await response.json();


        console.log(
          'Booking Response:',
          data
        );


        // =================================================
        // Booking Failed
        // =================================================

        if (!response.ok) {

          if (
            response.status === 409
          ) {

            Alert.alert(
              'Time Slot Unavailable',
              'This time slot has already been booked. Please select another time.'
            );

          } else {

            Alert.alert(
              'Booking Failed',
              data?.message ||
              'Unable to book the appointment.'
            );

          }


          return;

        }


        // =================================================
        // Booking Success
        // =================================================

        Alert.alert(

          'Appointment Booked!',

          `Your appointment with ${
            doctor?.name ||
            'the doctor'
          } on ${appointmentDate} at ${selectedTime} has been sent successfully.`,

          [
            {

              text: 'OK',

              onPress: () => {

                onNavigate(
                  'Page05_PatientHome'
                );

              },

            },
          ]

        );


      } catch (error) {

        console.error(
          'Booking error:',
          error
        );


        Alert.alert(
          'Connection Error',
          'Cannot connect to the backend server. Please make sure the backend is running.'
        );


      } finally {

        setBooking(false);

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

      <Header

        title="Doctor Detail"

        onBack={() =>
          onNavigate(
            'Page07_DoctorsList'
          )
        }

      />


      <ScrollView

        contentContainerStyle={
          styles.content
        }

        showsVerticalScrollIndicator={
          false
        }

      >

        {/* =================================================
            Doctor Header
        ================================================= */}

        <View
          style={
            styles.doctorHeader
          }
        >

          <Image

            source={

              doctorImage

                ? typeof doctorImage ===
                  'string'

                  ? {
                      uri:
                        doctorImage,
                    }

                  : doctorImage

                : require(
                    '../../assets/dr_rishi.png'
                  )

            }

            style={
              styles.doctorImage
            }

            resizeMode="cover"

          />


          <Text
            style={
              styles.doctorName
            }
          >

            {
              doctor?.name ||
              'Doctor'
            }

          </Text>

        </View>


        {/* =================================================
            About
        ================================================= */}

        <View
          style={
            styles.aboutSection
          }
        >

          <Text
            style={
              styles.aboutTitle
            }
          >
            About
          </Text>


          <Text
            style={
              styles.aboutText
            }
          >

            {
              doctor?.about ||
              'Ophthalmologist with experience in diagnosing and treating eye diseases. Passionate about early detection, advanced eye care, and preserving healthy vision through personalized treatment.'
            }

          </Text>

        </View>


        {/* =================================================
            Loading
        ================================================= */}

        {loadingDoctor ? (

          <View
            style={
              styles.loadingContainer
            }
          >

            <ActivityIndicator
              size="large"
              color="#5B92E5"
            />


            <Text
              style={
                styles.loadingText
              }
            >
              Loading doctor availability...
            </Text>

          </View>

        ) : (

          <>


            {/* =================================================
                Available Dates
            ================================================= */}

            <Text
              style={
                styles.sectionTitle
              }
            >
              Available Dates
            </Text>


            {availableDates.length === 0 ? (

              <View
                style={
                  styles.emptyBox
                }
              >

                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  No Available Dates
                </Text>


                <Text
                  style={
                    styles.emptyText
                  }
                >
                  This doctor has not added any available dates yet.
                </Text>

              </View>

            ) : (

              <ScrollView

                horizontal

                showsHorizontalScrollIndicator={
                  false
                }

                style={
                  styles.dateScrollView
                }

                contentContainerStyle={
                  styles.dateContainer
                }

              >

                {availableDates.map(
                  (item) => {

                    const isSelected =
                      selectedDate ===
                      item.fullDate;


                    return (

                      <TouchableOpacity

                        key={
                          item.fullDate
                        }

                        style={[

                          styles.datePill,

                          isSelected &&
                            styles.selectedDatePill,

                        ]}

                        onPress={() =>
                          handleDateSelect(
                            item.fullDate
                          )
                        }

                        activeOpacity={
                          0.8
                        }

                      >

                        <Text

                          style={[

                            styles.dayText,

                            isSelected &&
                              styles.selectedDayText,

                          ]}

                        >

                          {
                            item.day
                          }

                        </Text>


                        <Text

                          style={[

                            styles.dateNumberText,

                            isSelected &&
                              styles.selectedDateNumberText,

                          ]}

                        >

                          {
                            item.date
                          }

                        </Text>

                      </TouchableOpacity>

                    );

                  }
                )}

              </ScrollView>

            )}


            <View
              style={
                styles.divider
              }
            />


            {/* =================================================
                Available Time Slots
            ================================================= */}

            <Text
              style={
                styles.sectionTitle
              }
            >
              Available Time Slots
            </Text>


            {availableTimeSlots.length === 0 ? (

              <View
                style={
                  styles.emptyBox
                }
              >

                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  No Available Time Slots
                </Text>


                <Text
                  style={
                    styles.emptyText
                  }
                >
                  This doctor has not added any available time slots yet.
                </Text>

              </View>

            ) : (

              <View
                style={
                  styles.timeGrid
                }
              >

                {availableTimeSlots.map(
                  (time) => {

                    const isSelected =
                      selectedTime ===
                      time;


                    return (

                      <TouchableOpacity

                        key={
                          time
                        }

                        style={[

                          styles.timeSlot,

                          isSelected &&
                            styles.selectedTimeSlot,

                        ]}

                        onPress={() =>
                          handleTimeSelect(
                            time
                          )
                        }

                        activeOpacity={
                          0.8
                        }

                      >

                        <Text

                          style={[

                            styles.timeText,

                            isSelected &&
                              styles.selectedTimeText,

                          ]}

                        >

                          {
                            time
                          }

                        </Text>

                      </TouchableOpacity>

                    );

                  }
                )}

              </View>

            )}


            {/* =================================================
                Appointment Summary
            ================================================= */}

            <View
              style={
                styles.summaryCard
              }
            >

              <Text
                style={
                  styles.summaryTitle
                }
              >
                Appointment Summary
              </Text>


              <View
                style={
                  styles.summaryRow
                }
              >

                <Text
                  style={
                    styles.summaryLabel
                  }
                >
                  Doctor
                </Text>


                <Text
                  style={
                    styles.summaryValue
                  }
                >

                  {
                    doctor?.name ||
                    'Doctor'
                  }

                </Text>

              </View>


              <View
                style={
                  styles.summaryRow
                }
              >

                <Text
                  style={
                    styles.summaryLabel
                  }
                >
                  Date
                </Text>


                <Text
                  style={
                    styles.summaryValue
                  }
                >

                  {
                    selectedDateObject

                      ? `${selectedDateObject.day}, ${selectedDateObject.date}/${selectedDateObject.month}/${selectedDateObject.year}`

                      : 'Not selected'
                  }

                </Text>

              </View>


              <View
                style={
                  styles.summaryRow
                }
              >

                <Text
                  style={
                    styles.summaryLabel
                  }
                >
                  Time
                </Text>


                <Text
                  style={
                    styles.summaryValue
                  }
                >

                  {
                    selectedTime ||
                    'Not selected'
                  }

                </Text>

              </View>


              <View
                style={
                  styles.summaryRow
                }
              >

                <Text
                  style={
                    styles.summaryLabel
                  }
                >
                  Type
                </Text>


                <Text
                  style={
                    styles.summaryValue
                  }
                >
                  In-Person
                </Text>

              </View>

            </View>


            {/* =================================================
                Book Appointment
            ================================================= */}

            <TouchableOpacity

              style={[

                styles.bookButton,

                (
                  booking ||
                  !selectedDate ||
                  !selectedTime ||
                  availableDates.length === 0 ||
                  availableTimeSlots.length === 0
                ) &&
                  styles.disabledButton,

              ]}

              onPress={
                handleBook
              }

              disabled={

                booking ||
                !selectedDate ||
                !selectedTime ||
                availableDates.length === 0 ||
                availableTimeSlots.length === 0

              }

              activeOpacity={
                0.85
              }

            >

              {booking ? (

                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

              ) : (

                <Text
                  style={
                    styles.bookButtonText
                  }
                >
                  Book Appointment
                </Text>

              )}

            </TouchableOpacity>


          </>

        )}

      </ScrollView>

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
      '#FFFFFF',

  },


  content: {

    paddingHorizontal: 20,

    paddingTop: 10,

    paddingBottom: 30,

  },


  // =================================================
  // Doctor Header
  // =================================================

  doctorHeader: {

    flexDirection:
      'row',

    alignItems:
      'center',

    marginBottom: 20,

  },


  doctorImage: {

    width: 100,

    height: 100,

    borderRadius: 16,

    marginRight: 16,

  },


  doctorName: {

    fontSize: 22,

    fontWeight:
      '800',

    color:
      '#000000',

    flex: 1,

  },


  // =================================================
  // About
  // =================================================

  aboutSection: {

    marginBottom: 20,

  },


  aboutTitle: {

    fontSize: 18,

    fontWeight:
      '800',

    color:
      '#000000',

    marginBottom: 7,

  },


  aboutText: {

    fontSize: 13,

    color:
      '#64748B',

    lineHeight: 20,

  },


  // =================================================
  // Loading
  // =================================================

  loadingContainer: {

    alignItems:
      'center',

    justifyContent:
      'center',

    paddingVertical: 40,

  },


  loadingText: {

    marginTop: 12,

    fontSize: 13,

    color:
      '#64748B',

  },


  // =================================================
  // Section Title
  // =================================================

  sectionTitle: {

    fontSize: 17,

    fontWeight:
      '800',

    color:
      '#000000',

    marginBottom: 10,

  },


  // =================================================
  // Empty Box
  // =================================================

  emptyBox: {

    backgroundColor:
      '#F8FAFC',

    borderRadius: 14,

    padding: 18,

    marginBottom: 15,

    alignItems:
      'center',

  },


  emptyTitle: {

    fontSize: 14,

    fontWeight:
      '800',

    color:
      '#334155',

  },


  emptyText: {

    fontSize: 12,

    color:
      '#64748B',

    textAlign:
      'center',

    marginTop: 5,

  },


  // =================================================
  // Dates
  // =================================================

  dateScrollView: {

    marginBottom: 16,

  },


  dateContainer: {

    flexDirection:
      'row',

    alignItems:
      'center',

  },


  datePill: {

    width: 58,

    height: 74,

    borderRadius: 20,

    borderWidth: 1,

    borderColor:
      '#E2E8F0',

    justifyContent:
      'center',

    alignItems:
      'center',

    marginRight: 10,

    backgroundColor:
      '#FFFFFF',

  },


  selectedDatePill: {

    backgroundColor:
      '#5B92E5',

    borderColor:
      '#5B92E5',

  },


  dayText: {

    fontSize: 12,

    color:
      '#64748B',

    marginBottom: 4,

  },


  selectedDayText: {

    color:
      '#FFFFFF',

    fontWeight:
      '600',

  },


  dateNumberText: {

    fontSize: 18,

    fontWeight:
      '800',

    color:
      '#1E293B',

  },


  selectedDateNumberText: {

    color:
      '#FFFFFF',

  },


  // =================================================
  // Divider
  // =================================================

  divider: {

    height: 1,

    backgroundColor:
      '#E2E8F0',

    marginVertical: 12,

  },


  // =================================================
  // Time Grid
  // =================================================

  timeGrid: {

    flexDirection:
      'row',

    flexWrap:
      'wrap',

    justifyContent:
      'space-between',

    marginBottom: 20,

  },


  timeSlot: {

    width: '30%',

    height: 44,

    borderRadius: 22,

    borderWidth: 1,

    borderColor:
      '#93C5FD',

    justifyContent:
      'center',

    alignItems:
      'center',

    marginBottom: 14,

    backgroundColor:
      '#FFFFFF',

  },


  selectedTimeSlot: {

    backgroundColor:
      '#5B92E5',

    borderColor:
      '#5B92E5',

  },


  timeText: {

    fontSize: 12,

    fontWeight:
      '600',

    color:
      '#3B82F6',

  },


  selectedTimeText: {

    color:
      '#FFFFFF',

    fontWeight:
      '700',

  },


  // =================================================
  // Summary
  // =================================================

  summaryCard: {

    backgroundColor:
      '#EAEFFE',

    borderRadius: 18,

    padding: 16,

    marginBottom: 20,

  },


  summaryTitle: {

    fontSize: 16,

    fontWeight:
      '800',

    color:
      '#000000',

    marginBottom: 12,

  },


  summaryRow: {

    flexDirection:
      'row',

    justifyContent:
      'space-between',

    alignItems:
      'center',

    marginBottom: 8,

  },


  summaryLabel: {

    fontSize: 12,

    color:
      '#64748B',

  },


  summaryValue: {

    fontSize: 12,

    fontWeight:
      '700',

    color:
      '#1E293B',

    maxWidth:
      '65%',

    textAlign:
      'right',

  },


  // =================================================
  // Book Button
  // =================================================

  bookButton: {

    backgroundColor:
      '#5B92E5',

    height: 52,

    borderRadius: 26,

    justifyContent:
      'center',

    alignItems:
      'center',

    shadowColor:
      '#5B92E5',

    shadowOffset: {

      width: 0,

      height: 4,

    },

    shadowOpacity:
      0.3,

    shadowRadius: 6,

    elevation: 4,

  },


  disabledButton: {

    opacity: 0.5,

  },


  bookButtonText: {

    color:
      '#FFFFFF',

    fontSize: 16,

    fontWeight:
      '700',

  },

});