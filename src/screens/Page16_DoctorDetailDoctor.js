import React, { useEffect, useState } from 'react';

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

import { Edit3, Camera } from 'lucide-react-native';

import StatusBarMock from '../components/StatusBarMock';
import Header from '../components/Header';


// =================================================
// API
// =================================================

const API_URL = 'https://eye-healthcare-backend.vercel.app';


// =================================================
// Week Days
// =================================================

const weekDays = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];


// =================================================
// Available Time Slots
// =================================================

const timeSlotsData = [
  '09:00 AM',
  '10:30 AM',
  '11:00 AM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '07:00 PM',
  '08:00 PM',
];


// =================================================
// Generate Next 7 Days
// =================================================

const generateNextSevenDays = () => {
  const result = [];

  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);

    date.setDate(today.getDate() + i);

    result.push({
      day: weekDays[date.getDay()],

      date: String(date.getDate()),

      month: date.getMonth() + 1,

      year: date.getFullYear(),

      fullDate:
        `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}-${String(
          date.getDate()
        ).padStart(2, '0')}`,
    });
  }

  return result;
};


// =================================================
// Page 16
// =================================================

export default function Page16_DoctorDetailDoctor({
  onNavigate,
  doctorId,
}) {

  // =================================================
  // Dates
  // =================================================

  const [daysData] = useState(
    generateNextSevenDays()
  );


  // =================================================
  // Doctor
  // =================================================

  const [doctor, setDoctor] =
    useState(null);


  // =================================================
  // About
  // =================================================

  const [about, setAbout] =
    useState('');


  // =================================================
  // OLD Available Days
  // Keep for compatibility
  // =================================================

  const [availableDays, setAvailableDays] =
    useState([]);


  // =================================================
  // NEW Exact Available Dates
  // =================================================

  const [availableDates, setAvailableDates] =
    useState([]);


  // =================================================
  // Available Time Slots
  // =================================================

  const [availableTimeSlots, setAvailableTimeSlots] =
    useState([]);


  // =================================================
  // Selected Time
  // =================================================

  const [selectedTime, setSelectedTime] =
    useState(null);


  // =================================================
  // Loading
  // =================================================

  const [loading, setLoading] =
    useState(false);


  // =================================================
  // Load Doctor
  // =================================================

  useEffect(() => {

    if (!doctorId) {

      console.log(
        '❌ Page16: Doctor ID not received'
      );

      Alert.alert(
        'Doctor ID Missing',
        'Doctor information was not passed to this page.'
      );

      return;
    }


    const loadDoctor = async () => {

      try {

        setLoading(true);

        console.log(
          '================================='
        );

        console.log(
          'Loading Doctor Details'
        );

        console.log(
          'Doctor ID:',
          doctorId
        );

        console.log(
          '================================='
        );


        // =================================================
        // GET Doctor
        // =================================================

        const response =
          await fetch(
            `${API_URL}/api/doctors/${doctorId}`
          );


        const data =
          await response.json();


        console.log(
          'Doctor API Response:',
          data
        );


        if (!response.ok) {

          Alert.alert(
            'Error',
            data.message ||
              'Unable to load doctor details.'
          );

          return;
        }


        // =================================================
        // Doctor
        // =================================================

        setDoctor(data);


        // =================================================
        // About
        // =================================================

        setAbout(
          data.about ||
            'No doctor information available.'
        );


        // =================================================
        // Old Available Days
        // =================================================

        const doctorDays =
          Array.isArray(
            data.availableDays
          )
            ? data.availableDays
                .map(
                  (day) =>
                    String(day).trim()
                )
                .filter(Boolean)
            : [];


        const uniqueDays = [
          ...new Set(doctorDays),
        ];


        setAvailableDays(
          uniqueDays
        );


        // =================================================
        // NEW Available Dates
        // =================================================

        const doctorDates =
          Array.isArray(
            data.availableDates
          )
            ? data.availableDates
                .map(
                  (date) =>
                    String(date).trim()
                )
                .filter(Boolean)
            : [];


        const uniqueDates = [
          ...new Set(doctorDates),
        ];


        setAvailableDates(
          uniqueDates
        );


        // =================================================
        // Available Time Slots
        // =================================================

        const doctorTimes =
          Array.isArray(
            data.availableTimeSlots
          )
            ? data.availableTimeSlots
                .map(
                  (time) =>
                    String(time).trim()
                )
                .filter(Boolean)
            : [];


        const uniqueTimes = [
          ...new Set(doctorTimes),
        ];


        setAvailableTimeSlots(
          uniqueTimes
        );


        // =================================================
        // First Available Time
        // =================================================

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
          'Doctor loaded successfully'
        );

        console.log(
          'Doctor Name:',
          data.name
        );

        console.log(
          'Available Days:',
          uniqueDays
        );

        console.log(
          'Available Dates:',
          uniqueDates
        );

        console.log(
          'Available Time Slots:',
          uniqueTimes
        );

        console.log(
          '================================='
        );


      } catch (error) {

        console.log(
          'Load doctor error:',
          error
        );


        Alert.alert(
          'Connection Error',
          'Cannot connect to the backend server. Make sure the backend is running.'
        );

      } finally {

        setLoading(false);

      }

    };


    loadDoctor();

  }, [doctorId]);


  // =================================================
  // Select / Unselect EXACT DATE
  // =================================================

  const handleDatePress = (fullDate) => {

    setAvailableDates(
      (previousDates) => {

        if (
          previousDates.includes(fullDate)
        ) {

          return previousDates.filter(
            (date) =>
              date !== fullDate
          );

        }


        return [
          ...previousDates,
          fullDate,
        ];

      }
    );

  };


  // =================================================
  // Select / Unselect Time
  // =================================================

  const handleTimePress = (time) => {

    setAvailableTimeSlots(
      (previousSlots) => {

        if (
          previousSlots.includes(time)
        ) {

          const updatedSlots =
            previousSlots.filter(
              (item) =>
                item !== time
            );


          if (
            selectedTime === time
          ) {

            setSelectedTime(
              updatedSlots.length > 0
                ? updatedSlots[0]
                : null
            );

          }


          return updatedSlots;

        }


        return [
          ...previousSlots,
          time,
        ];

      }
    );


    setSelectedTime(time);

  };


  // =================================================
  // Save Changes
  // =================================================

  const handleSaveChanges =
    async () => {

      // =================================================
      // Doctor ID
      // =================================================

      if (!doctorId) {

        Alert.alert(
          'Doctor ID Missing',
          'Doctor information was not passed to this page.'
        );

        return;
      }


      // =================================================
      // Exact Dates
      // =================================================

      if (
        availableDates.length === 0
      ) {

        Alert.alert(
          'Select Available Dates',
          'Please select at least one available date.'
        );

        return;
      }


      // =================================================
      // Time Slots
      // =================================================

      if (
        availableTimeSlots.length === 0
      ) {

        Alert.alert(
          'Select Time Slots',
          'Please select at least one available time slot.'
        );

        return;
      }


      try {

        setLoading(true);


        // =================================================
        // Clean Exact Dates
        // =================================================

        const cleanDates = [
          ...new Set(
            availableDates
              .map(
                (date) =>
                  String(date).trim()
              )
              .filter(Boolean)
          ),
        ];


        // =================================================
        // Clean Time Slots
        // =================================================

        const cleanTimeSlots = [
          ...new Set(
            availableTimeSlots
              .map(
                (time) =>
                  String(time).trim()
              )
              .filter(Boolean)
          ),
        ];


        // =================================================
        // Create Days From Exact Dates
        // For compatibility with old code
        // =================================================

        const cleanDays = [
          ...new Set(
            cleanDates.map(
              (dateString) => {

                const date =
                  new Date(
                    `${dateString}T00:00:00`
                  );

                return weekDays[
                  date.getDay()
                ];

              }
            )
          ),
        ];


        console.log(
          '================================='
        );

        console.log(
          'Saving Doctor Details'
        );

        console.log(
          'Doctor ID:',
          doctorId
        );

        console.log(
          'About:',
          about
        );

        console.log(
          'Available Dates:',
          cleanDates
        );

        console.log(
          'Available Days:',
          cleanDays
        );

        console.log(
          'Available Time Slots:',
          cleanTimeSlots
        );

        console.log(
          '================================='
        );


        // =================================================
        // PUT Request
        // =================================================

        const response =
          await fetch(
            `${API_URL}/api/doctors/${doctorId}`,
            {

              method: 'PUT',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify({

                  about:
                    about,

                  // Keep old field
                  availableDays:
                    cleanDays,

                  // NEW exact dates
                  availableDates:
                    cleanDates,

                  // Existing time slots
                  availableTimeSlots:
                    cleanTimeSlots,

                }),

            }
          );


        const data =
          await response.json();


        console.log(
          'Save Response:',
          data
        );


        // =================================================
        // Success
        // =================================================

        if (response.ok) {

          if (data.doctor) {

            setDoctor(
              data.doctor
            );


            // Update exact dates

            setAvailableDates(
              Array.isArray(
                data.doctor.availableDates
              )
                ? data.doctor.availableDates
                : []
            );


            // Update old days

            setAvailableDays(
              Array.isArray(
                data.doctor.availableDays
              )
                ? data.doctor.availableDays
                : []
            );


            // Update times

            setAvailableTimeSlots(
              Array.isArray(
                data.doctor.availableTimeSlots
              )
                ? data.doctor.availableTimeSlots
                : []
            );

          }


          Alert.alert(
            'Success',
            'Doctor profile and availability updated successfully.',
            [
              {
                text: 'OK',

                onPress: () => {

                  onNavigate(
                    'Page15_DoctorHome'
                  );

                },

              },
            ]
          );


        } else {

          Alert.alert(
            'Update Failed',
            data.message ||
              'Unable to update doctor details.'
          );

        }


      } catch (error) {

        console.log(
          'Save doctor error:',
          error
        );


        Alert.alert(
          'Connection Error',
          'Cannot connect to the backend server. Make sure the backend is running.'
        );

      } finally {

        setLoading(false);

      }

    };


  // =================================================
  // Doctor Name
  // =================================================

  const doctorName =
    doctor?.name ||
    'Loading...';


  // =================================================
  // Doctor Image
  // =================================================

  const doctorImage =
    doctor?.avatar ||
    null;


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
            'Page15_DoctorHome'
          )
        }

      />


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
            size="small"
            color="#5B92E5"
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading...
          </Text>

        </View>

      )}


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

      >


        {/* =================================================
            Doctor Header
        ================================================= */}

        <View
          style={
            styles.doctorHeader
          }
        >

          <View
            style={
              styles.imageWrapper
            }
          >

            <Image

              source={
                doctorImage
                  ? {
                      uri:
                        doctorImage,
                    }
                  : require(
                      '../../assets/dr_rishi.png'
                    )
              }

              style={
                styles.doctorImage
              }

              resizeMode="cover"

            />


            <TouchableOpacity
              style={
                styles.cameraBadge
              }
            >

              <Camera
                size={14}
                color="#FFFFFF"
              />

            </TouchableOpacity>

          </View>


          <Text
            style={
              styles.doctorName
            }
          >
            {doctorName}
          </Text>

        </View>


        {/* =================================================
            About
        ================================================= */}

        <View
          style={
            styles.cardSection
          }
        >

          <View
            style={
              styles.editIconBtn
            }
          >

            <Edit3
              size={18}
              color="#1E293B"
            />

          </View>


          <Text
            style={
              styles.sectionTitle
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
              about ||
              'Loading doctor information...'
            }

          </Text>

        </View>


        {/* =================================================
            Available Dates
        ================================================= */}

        <View
          style={
            styles.cardSection
          }
        >

          <View
            style={
              styles.editIconBtn
            }
          >

            <Edit3
              size={18}
              color="#1E293B"
            />

          </View>


          <Text
            style={
              styles.sectionTitle
            }
          >
            Available Dates
          </Text>


          <ScrollView

            horizontal

            showsHorizontalScrollIndicator={
              false
            }

          >

            <View
              style={
                styles.dateContainer
              }
            >

              {daysData.map(
                (item) => {

                  const isSelected =
                    availableDates.includes(
                      item.fullDate
                    );


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
                        handleDatePress(
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

            </View>

          </ScrollView>

        </View>


        {/* =================================================
            Available Time Slots
        ================================================= */}

        <View
          style={
            styles.cardSection
          }
        >

          <View
            style={
              styles.editIconBtn
            }
          >

            <Edit3
              size={18}
              color="#1E293B"
            />

          </View>


          <Text
            style={
              styles.sectionTitle
            }
          >
            Available Time Slots
          </Text>


          <View
            style={
              styles.timeGrid
            }
          >

            {timeSlotsData.map(
              (time) => {

                const isSelected =
                  availableTimeSlots.includes(
                    time
                  );


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
                      handleTimePress(
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

                      {time}

                    </Text>

                  </TouchableOpacity>

                );

              }
            )}

          </View>

        </View>


        {/* =================================================
            Save Button
        ================================================= */}

        <TouchableOpacity

          style={[

            styles.saveButton,

            loading &&
              styles.disabledButton,

          ]}

          onPress={
            handleSaveChanges
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
                styles.saveButtonText
              }
            >
              Save Changes
            </Text>

          )}

        </TouchableOpacity>


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


  loadingContainer: {

    flexDirection:
      'row',

    justifyContent:
      'center',

    alignItems:
      'center',

    paddingVertical: 8,

  },


  loadingText: {

    marginLeft: 8,

    fontSize: 12,

    color:
      '#64748B',

  },


  doctorHeader: {

    flexDirection:
      'row',

    alignItems:
      'center',

    marginBottom: 20,

  },


  imageWrapper: {

    position:
      'relative',

    marginRight: 16,

  },


  doctorImage: {

    width: 100,

    height: 100,

    borderRadius: 16,

  },


  cameraBadge: {

    position:
      'absolute',

    bottom: -4,

    right: -4,

    width: 26,

    height: 26,

    borderRadius: 13,

    backgroundColor:
      '#1E293B',

    justifyContent:
      'center',

    alignItems:
      'center',

    borderWidth: 2,

    borderColor:
      '#FFFFFF',

  },


  doctorName: {

    fontSize: 22,

    fontWeight:
      '800',

    color:
      '#000000',

  },


  cardSection: {

    backgroundColor:
      '#EAEFFE',

    borderRadius: 20,

    padding: 16,

    marginBottom: 16,

    position:
      'relative',

  },


  editIconBtn: {

    position:
      'absolute',

    top: 14,

    right: 14,

    zIndex: 10,

  },


  sectionTitle: {

    fontSize: 18,

    fontWeight:
      '800',

    color:
      '#000000',

    marginBottom: 12,

  },


  aboutText: {

    fontSize: 12,

    color:
      '#475569',

    lineHeight: 18,

    paddingRight: 20,

  },


  dateContainer: {

    flexDirection:
      'row',

    alignItems:
      'center',

    paddingVertical: 4,

  },


  datePill: {

    width: 54,

    height: 68,

    borderRadius: 16,

    justifyContent:
      'center',

    alignItems:
      'center',

    marginRight: 8,

    backgroundColor:
      '#FFFFFF',

    borderWidth: 1,

    borderColor:
      '#E2E8F0',

  },


  selectedDatePill: {

    backgroundColor:
      '#5B92E5',

    borderColor:
      '#5B92E5',

  },


  dayText: {

    fontSize: 11,

    color:
      '#64748B',

    marginBottom: 2,

  },


  selectedDayText: {

    color:
      '#FFFFFF',

    fontWeight:
      '600',

  },


  dateNumberText: {

    fontSize: 17,

    fontWeight:
      '800',

    color:
      '#1E293B',

  },


  selectedDateNumberText: {

    color:
      '#FFFFFF',

  },


  timeGrid: {

    flexDirection:
      'row',

    flexWrap:
      'wrap',

    justifyContent:
      'space-between',

    paddingTop: 8,

  },


  timeSlot: {

    width: '30%',

    height: 40,

    borderRadius: 20,

    borderWidth: 1,

    borderColor:
      '#93C5FD',

    justifyContent:
      'center',

    alignItems:
      'center',

    marginBottom: 10,

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

    fontSize: 11,

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


  saveButton: {

    backgroundColor:
      '#5B92E5',

    height: 52,

    borderRadius: 26,

    justifyContent:
      'center',

    alignItems:
      'center',

    marginTop: 10,

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

    opacity: 0.7,

  },


  saveButtonText: {

    color:
      '#FFFFFF',

    fontSize: 16,

    fontWeight:
      '700',

  },

});
