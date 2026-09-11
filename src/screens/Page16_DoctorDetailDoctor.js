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
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import {
  Edit3,
  Camera,
  Check,
} from 'lucide-react-native';

import StatusBarMock from '../components/StatusBarMock';
import Header from '../components/Header';


// =================================================
// API URL
// =================================================

// Android Emulator -> Local Windows Backend
const API_URL = 'http://10.0.2.2:5000';


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
// Time Slots
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

    date.setDate(
      today.getDate() + i
    );

    result.push({
      day: weekDays[date.getDay()],

      date: String(
        date.getDate()
      ),

      month:
        date.getMonth() + 1,

      year:
        date.getFullYear(),

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
// Page
// =================================================

export default function Page16_DoctorDetailDoctor({
  onNavigate,
  doctorId,
}) {

  // =================================================
  // Next 7 Days
  // =================================================

  const [daysData] = useState(
    generateNextSevenDays()
  );


  // =================================================
  // Doctor Data
  // =================================================

  const [doctor, setDoctor] =
    useState(null);

  const [about, setAbout] =
    useState('');


  // =================================================
  // Selected Profile Image
  // =================================================

  const [selectedAvatarUri, setSelectedAvatarUri] =
    useState(null);


  // =================================================
  // Availability
  // =================================================

  const [availableDays, setAvailableDays] =
    useState([]);

  const [availableDates, setAvailableDates] =
    useState([]);

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
  // About Modal
  // =================================================

  const [aboutModalVisible, setAboutModalVisible] =
    useState(false);

  const [aboutDraft, setAboutDraft] =
    useState('');


  // =================================================
  // Edit Modes
  // =================================================

  const [dateEditMode, setDateEditMode] =
    useState(false);

  const [timeEditMode, setTimeEditMode] =
    useState(false);


  // =================================================
  // Load Doctor
  // =================================================

  useEffect(() => {

    if (!doctorId) {

      Alert.alert(
        'Doctor ID Missing',
        'Doctor information was not passed to this page.'
      );

      return;
    }


    const loadDoctor = async () => {

      try {

        setLoading(true);


        const response =
          await fetch(
            `${API_URL}/api/doctors/${doctorId}?_t=${Date.now()}`,
            {
              headers: {
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache',
              },
            }
          );


        const data =
          await response.json();


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
        // Available Days
        // =================================================

        const doctorDays =
          Array.isArray(
            data.availableDays
          )
            ? data.availableDays
                .map((day) =>
                  String(day).trim()
                )
                .filter(Boolean)
            : [];


        setAvailableDays([
          ...new Set(
            doctorDays
          ),
        ]);


        // =================================================
        // Available Dates
        // =================================================

        const doctorDates =
          Array.isArray(
            data.availableDates
          )
            ? data.availableDates
                .map((date) =>
                  String(date).trim()
                )
                .filter(Boolean)
            : [];


        const allowedDates =
          new Set(
            daysData.map(
              (item) =>
                item.fullDate
            )
          );


        const validDates = [
          ...new Set(
            doctorDates.filter(
              (date) =>
                allowedDates.has(
                  date
                )
            )
          ),
        ];


        setAvailableDates(
          validDates
        );


        // =================================================
        // Available Times
        // =================================================

        const doctorTimes =
          Array.isArray(
            data.availableTimeSlots
          )
            ? data.availableTimeSlots
                .map((time) =>
                  String(time).trim()
                )
                .filter(Boolean)
            : [];


        const uniqueTimes = [
          ...new Set(
            doctorTimes
          ),
        ];


        setAvailableTimeSlots(
          uniqueTimes
        );


        setSelectedTime(
          uniqueTimes.length > 0
            ? uniqueTimes[0]
            : null
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

  }, [doctorId, daysData]);


  // =================================================
  // Date Selection
  // =================================================

  const handleDatePress = (
    fullDate
  ) => {

    if (!dateEditMode) {
      return;
    }


    setAvailableDates(
      (previousDates) => {

        if (
          previousDates.includes(
            fullDate
          )
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
  // Time Selection
  // =================================================

  const handleTimePress = (
    time
  ) => {

    if (!timeEditMode) {
      return;
    }


    setAvailableTimeSlots(
      (previousSlots) => {

        if (
          previousSlots.includes(
            time
          )
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


        setSelectedTime(time);


        return [
          ...previousSlots,
          time,
        ];

      }
    );

  };


  // =================================================
  // Open About Editor
  // =================================================

  const handleOpenAboutEditor =
    () => {

      setAboutDraft(
        about
      );

      setAboutModalVisible(
        true
      );

    };


  // =================================================
  // Save About Draft
  // =================================================

  const handleSaveAboutDraft =
    () => {

      const value =
        aboutDraft.trim();


      if (!value) {

        Alert.alert(
          'About Required',
          'Please enter information about the doctor.'
        );

        return;
      }


      setAbout(value);

      setAboutModalVisible(
        false
      );

    };


  // =================================================
  // Pick Doctor Profile Image
  // =================================================

  const handlePickProfileImage =
    async () => {

      try {

        const permission =
          await ImagePicker
            .requestMediaLibraryPermissionsAsync();


        if (!permission.granted) {

          Alert.alert(
            'Permission Required',
            'Please allow gallery access to change the profile picture.'
          );

          return;
        }


        // =================================================
        // Open Gallery
        // =================================================

        const result =
          await ImagePicker
            .launchImageLibraryAsync({

              mediaTypes:
                ImagePicker
                  .MediaTypeOptions
                  .Images,

              allowsEditing:
                true,

              aspect:
                [1, 1],

              quality:
                0.8,

              // IMPORTANT
              // No Base64
              base64:
                false,

            });


        if (
          result.canceled ||
          !result.assets ||
          result.assets.length === 0
        ) {

          return;

        }


        const asset =
          result.assets[0];


        // =================================================
        // Store Local URI
        // =================================================

        setSelectedAvatarUri(
          asset.uri
        );


        // =================================================
        // Show Image Immediately
        // =================================================

        setDoctor(
          (previous) => ({
            ...(previous || {}),
            avatar:
              asset.uri,
          })
        );


      } catch (error) {

        console.log(
          'Profile image picker error:',
          error
        );


        Alert.alert(
          'Image Error',
          error?.message ||
            'Unable to select profile picture.'
        );

      }

    };


  // =================================================
  // Save Doctor Changes
  // =================================================

  const handleSaveChanges =
    async () => {

      if (!doctorId) {

        Alert.alert(
          'Doctor ID Missing',
          'Doctor information was not passed to this page.'
        );

        return;
      }


      if (
        availableDates.length === 0
      ) {

        Alert.alert(
          'Select Available Dates',
          'Please select at least one available date.'
        );

        return;
      }


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
        // Allowed Current 7 Days
        // =================================================

        const allowedDates =
          new Set(
            daysData.map(
              (item) =>
                item.fullDate
            )
          );


        // =================================================
        // Clean Dates
        // =================================================

        const cleanDates = [
          ...new Set(
            availableDates
              .map((date) =>
                String(date).trim()
              )
              .filter(
                (date) =>
                  date &&
                  allowedDates.has(
                    date
                  )
              )
          ),
        ];


        // =================================================
        // Clean Time Slots
        // =================================================

        const cleanTimeSlots = [
          ...new Set(
            availableTimeSlots
              .map((time) =>
                String(time).trim()
              )
              .filter(Boolean)
          ),
        ];


        if (
          cleanDates.length === 0
        ) {

          Alert.alert(
            'Select Available Dates',
            'Please select at least one date from the current 7 days.'
          );

          return;
        }


        // =================================================
        // Generate Days
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


        // =================================================
        // Upload Profile Image
        // =================================================

        if (
          selectedAvatarUri
        ) {

          try {

            const formData =
              new FormData();


            const filename =
              selectedAvatarUri
                .split('/')
                .pop() ||
              `doctor-${Date.now()}.jpg`;


            const extension =
              filename
                .split('.')
                .pop()
                ?.toLowerCase();


            let mimeType =
              'image/jpeg';


            if (
              extension === 'png'
            ) {

              mimeType =
                'image/png';

            } else if (
              extension === 'webp'
            ) {

              mimeType =
                'image/webp';

            }


            formData.append(
              'avatar',
              {
                uri:
                  selectedAvatarUri,

                name:
                  filename,

                type:
                  mimeType,
              }
            );


            console.log(
              'Uploading doctor profile image...'
            );


            const imageResponse =
              await fetch(
                `${API_URL}/api/doctors/${doctorId}/avatar`,
                {
                  method:
                    'POST',

                  // IMPORTANT:
                  // Do NOT manually set Content-Type.
                  // React Native adds multipart boundary.

                  body:
                    formData,
                }
              );


            const imageData =
              await imageResponse.json();


            if (
              !imageResponse.ok
            ) {

              Alert.alert(
                'Image Upload Failed',
                imageData.message ||
                  'Unable to upload profile image.'
              );

              return;
            }


            console.log(
              'Doctor image uploaded:',
              imageData.avatar
            );


            // =================================================
            // Update Doctor With Server URL
            // =================================================

            if (
              imageData.avatar
            ) {

              setDoctor(
                (previous) => ({
                  ...(previous || {}),
                  avatar:
                    imageData.avatar,
                })
              );

            }


            // =================================================
            // Clear Temporary URI
            // =================================================

            setSelectedAvatarUri(
              null
            );


          } catch (
            imageError
          ) {

            console.log(
              'Profile image upload error:',
              imageError
            );


            Alert.alert(
              'Image Upload Failed',
              imageError?.message ||
                'Unable to upload doctor profile image.'
            );


            return;

          }

        }


        // =================================================
        // Save Doctor Details
        // =================================================

        const response =
          await fetch(
            `${API_URL}/api/doctors/${doctorId}`,
            {
              method:
                'PUT',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify({

                  about,

                  availableDays:
                    cleanDays,

                  availableDates:
                    cleanDates,

                  availableTimeSlots:
                    cleanTimeSlots,

                }),

            }
          );


        const data =
          await response.json();


        if (
          !response.ok
        ) {

          Alert.alert(
            'Update Failed',
            data.message ||
              'Unable to update doctor details.'
          );

          return;
        }


        // =================================================
        // Update Local State
        // =================================================

        if (
          data.doctor
        ) {

          setDoctor(
            data.doctor
          );


          const responseDates =
            Array.isArray(
              data.doctor
                .availableDates
            )
              ? data.doctor
                  .availableDates
                  .map((date) =>
                    String(date).trim()
                  )
                  .filter(
                    (date) =>
                      allowedDates.has(
                        date
                      )
                  )
              : cleanDates;


          setAvailableDates([
            ...new Set(
              responseDates
            ),
          ]);


          setAvailableDays(
            Array.isArray(
              data.doctor
                .availableDays
            )
              ? data.doctor
                  .availableDays
              : cleanDays
          );


          setAvailableTimeSlots(
            Array.isArray(
              data.doctor
                .availableTimeSlots
            )
              ? data.doctor
                  .availableTimeSlots
              : cleanTimeSlots
          );


          setAbout(
            data.doctor.about ||
              about
          );

        }


        // =================================================
        // Exit Edit Modes
        // =================================================

        setDateEditMode(
          false
        );

        setTimeEditMode(
          false
        );


        // =================================================
        // Success
        // =================================================

        Alert.alert(
          'Success',
          'Doctor profile and availability updated successfully.',
          [
            {
              text:
                'OK',

              onPress:
                () =>
                  onNavigate(
                    'Page15_DoctorHome'
                  ),
            },
          ]
        );


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

  // IMPORTANT:
  // No default Dr. Rishi image here.
  // If doctor avatar is unavailable,
  // the UI will show a neutral placeholder.

  const doctorImage =
    doctor?.avatar ||
    null;


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


      <Header
        title="Doctor Detail"
        onBack={() =>
          onNavigate(
            'Page15_DoctorHome'
          )
        }
      />


      {/* =================================================
          Loading Indicator
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
            Updating...
          </Text>

        </View>

      )}


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

            {/* =================================================
                IMPORTANT CHANGE:
                No dr_rishi.png fallback
            ================================================= */}

            {doctorImage ? (

              <Image
                source={{
                  uri:
                    doctorImage,
                }}

                style={
                  styles.doctorImage
                }

                resizeMode="cover"
              />

            ) : (

              <View
                style={
                  styles.emptyDoctorImage
                }
              >

                <Text
                  style={
                    styles.emptyDoctorImageText
                  }
                >
                  👤
                </Text>

              </View>

            )}


            {/* Camera */}

            <TouchableOpacity
              style={
                styles.cameraBadge
              }

              onPress={
                handlePickProfileImage
              }

              activeOpacity={0.8}
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

          <TouchableOpacity
            style={
              styles.editIconBtn
            }

            onPress={
              handleOpenAboutEditor
            }

            activeOpacity={0.7}
          >

            <Edit3
              size={18}
              color="#1E293B"
            />

          </TouchableOpacity>


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
            {about ||
              'Loading doctor information...'}
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

          <TouchableOpacity
            style={
              styles.editIconBtn
            }

            onPress={() =>
              setDateEditMode(
                (value) =>
                  !value
              )
            }

            activeOpacity={0.7}
          >

            {dateEditMode ? (

              <Check
                size={18}
                color="#1E293B"
              />

            ) : (

              <Edit3
                size={18}
                color="#1E293B"
              />

            )}

          </TouchableOpacity>


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

                        !dateEditMode &&
                          styles.disabledDatePill,
                      ]}

                      onPress={() =>
                        handleDatePress(
                          item.fullDate
                        )
                      }

                      disabled={
                        !dateEditMode
                      }

                      activeOpacity={0.8}
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


          {dateEditMode && (

            <Text
              style={
                styles.editHint
              }
            >
              Select or remove available
              dates, then tap ✓.
            </Text>

          )}

        </View>


        {/* =================================================
            Available Time Slots
        ================================================= */}

        <View
          style={
            styles.cardSection
          }
        >

          <TouchableOpacity
            style={
              styles.editIconBtn
            }

            onPress={() =>
              setTimeEditMode(
                (value) =>
                  !value
              )
            }

            activeOpacity={0.7}
          >

            {timeEditMode ? (

              <Check
                size={18}
                color="#1E293B"
              />

            ) : (

              <Edit3
                size={18}
                color="#1E293B"
              />

            )}

          </TouchableOpacity>


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

                      !timeEditMode &&
                        styles.disabledTimeSlot,
                    ]}

                    onPress={() =>
                      handleTimePress(
                        time
                      )
                    }

                    disabled={
                      !timeEditMode
                    }

                    activeOpacity={0.8}
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


          {timeEditMode && (

            <Text
              style={
                styles.editHint
              }
            >
              Select or remove available
              time slots, then tap ✓.
            </Text>

          )}

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

          activeOpacity={0.85}
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


      {/* =================================================
          About Modal
      ================================================= */}

      <Modal
        visible={
          aboutModalVisible
        }

        transparent

        animationType="fade"

        onRequestClose={() =>
          setAboutModalVisible(
            false
          )
        }
      >

        <KeyboardAvoidingView
          style={
            styles.modalOverlay
          }

          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >

          <View
            style={
              styles.modalCard
            }
          >

            <Text
              style={
                styles.modalTitle
              }
            >
              Edit About
            </Text>


            <TextInput
              value={
                aboutDraft
              }

              onChangeText={
                setAboutDraft
              }

              multiline

              textAlignVertical="top"

              placeholder="Enter information about the doctor"

              placeholderTextColor="#94A3B8"

              style={
                styles.aboutInput
              }

              maxLength={500}
            />


            <View
              style={
                styles.modalActions
              }
            >

              <TouchableOpacity
                style={
                  styles.cancelButton
                }

                onPress={() =>
                  setAboutModalVisible(
                    false
                  )
                }
              >

                <Text
                  style={
                    styles.cancelButtonText
                  }
                >
                  Cancel
                </Text>

              </TouchableOpacity>


              <TouchableOpacity
                style={
                  styles.modalSaveButton
                }

                onPress={
                  handleSaveAboutDraft
                }
              >

                <Text
                  style={
                    styles.modalSaveButtonText
                  }
                >
                  Save
                </Text>

              </TouchableOpacity>

            </View>

          </View>

        </KeyboardAvoidingView>

      </Modal>

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
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 30,
    },


    loadingContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },


    loadingText: {
      marginLeft: 8,
      fontSize: 12,
      color: '#64748B',
    },


    doctorHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },


    imageWrapper: {
      position: 'relative',
      marginRight: 16,
    },


    doctorImage: {
      width: 100,
      height: 100,
      borderRadius: 16,
    },


    // =================================================
    // Empty Image Placeholder
    // =================================================

    emptyDoctorImage: {
      width: 100,
      height: 100,
      borderRadius: 16,
      backgroundColor: '#E2E8F0',
      justifyContent: 'center',
      alignItems: 'center',
    },


    emptyDoctorImageText: {
      fontSize: 38,
      opacity: 0.5,
    },


    cameraBadge: {
      position: 'absolute',
      bottom: -4,
      right: -4,
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: '#1E293B',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },


    doctorName: {
      fontSize: 22,
      fontWeight: '800',
      color: '#000000',
    },


    cardSection: {
      backgroundColor: '#EAEFFE',
      borderRadius: 20,
      padding: 16,
      marginBottom: 16,
      position: 'relative',
    },


    editIconBtn: {
      position: 'absolute',
      top: 14,
      right: 14,
      zIndex: 10,
      width: 28,
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },


    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: '#000000',
      marginBottom: 12,
    },


    aboutText: {
      fontSize: 12,
      color: '#475569',
      lineHeight: 18,
      paddingRight: 20,
    },


    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
    },


    datePill: {
      width: 54,
      height: 68,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },


    selectedDatePill: {
      backgroundColor: '#5B92E5',
      borderColor: '#5B92E5',
    },


    disabledDatePill: {
      opacity: 1,
    },


    dayText: {
      fontSize: 11,
      color: '#64748B',
      marginBottom: 2,
    },


    selectedDayText: {
      color: '#FFFFFF',
      fontWeight: '600',
    },


    dateNumberText: {
      fontSize: 17,
      fontWeight: '800',
      color: '#1E293B',
    },


    selectedDateNumberText: {
      color: '#FFFFFF',
    },


    timeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingTop: 8,
    },


    timeSlot: {
      width: '30%',
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#93C5FD',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      backgroundColor: '#FFFFFF',
    },


    selectedTimeSlot: {
      backgroundColor: '#5B92E5',
      borderColor: '#5B92E5',
    },


    disabledTimeSlot: {
      opacity: 1,
    },


    timeText: {
      fontSize: 11,
      fontWeight: '600',
      color: '#3B82F6',
    },


    selectedTimeText: {
      color: '#FFFFFF',
      fontWeight: '700',
    },


    editHint: {
      marginTop: 2,
      fontSize: 10,
      color: '#64748B',
    },


    saveButton: {
      backgroundColor: '#5B92E5',
      height: 52,
      borderRadius: 26,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
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


    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },


    modalOverlay: {
      flex: 1,
      backgroundColor:
        'rgba(0,0,0,0.45)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },


    modalCard: {
      width: '100%',
      maxWidth: 420,
      backgroundColor: '#FFFFFF',
      borderRadius: 22,
      padding: 20,
    },


    modalTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: '#0F172A',
      marginBottom: 14,
    },


    aboutInput: {
      minHeight: 140,
      borderWidth: 1,
      borderColor: '#CBD5E1',
      borderRadius: 14,
      padding: 14,
      fontSize: 14,
      color: '#0F172A',
      backgroundColor: '#F8FAFC',
    },


    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 16,
    },


    cancelButton: {
      height: 44,
      paddingHorizontal: 18,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E2E8F0',
    },


    cancelButtonText: {
      color: '#334155',
      fontSize: 14,
      fontWeight: '700',
    },


    modalSaveButton: {
      height: 44,
      paddingHorizontal: 22,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#5B92E5',
    },


    modalSaveButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },

  });