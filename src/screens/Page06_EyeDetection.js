import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StatusBarMock from '../components/StatusBarMock';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';

const API_URL = 'https://eye-healthcare-backend.vercel.app';

export default function Page06_EyeDetection({ onNavigate }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSavingReport, setIsSavingReport] = useState(false);
  const [result, setResult] = useState(null);

  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');

  useEffect(() => {
    const loadPatientDetails = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');

        if (!storedUser) {
          console.log('No stored patient found.');
          return;
        }

        const user = JSON.parse(storedUser);

        const actualName =
          user.name ||
          user.fullName ||
          user.username ||
          'Patient';

        const actualId =
          user._id ||
          user.id ||
          user.userId ||
          '';

        setPatientName(actualName);
        setPatientId(actualId);

        console.log('Patient Name:', actualName);
        console.log('Patient ID:', actualId);
      } catch (error) {
        console.log(
          'PATIENT DETAILS ERROR:',
          error
        );
      }
    };

    loadPatientDetails();
  }, []);

  const handleChooseFile = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow photo access to select an eye image.'
        );
        return;
      }

      const pickerResult =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        });

      if (pickerResult.canceled) {
        return;
      }

      if (
        !pickerResult.assets ||
        pickerResult.assets.length === 0
      ) {
        Alert.alert(
          'No Image',
          'No image was selected.'
        );
        return;
      }

      const asset = pickerResult.assets[0];

      setSelectedFile({
        name:
          asset.fileName ||
          'selected_eye_image.jpg',
        uri: asset.uri,
        type:
          asset.mimeType ||
          'image/jpeg',
      });

      setResult(null);
    } catch (error) {
      console.log(
        'IMAGE PICKER ERROR:',
        error
      );

      Alert.alert(
        'Image Picker Error',
        error?.message ||
          'Unable to select image.'
      );
    }
  };

  const saveReportToDatabase = async (prediction) => {
    try {
      setIsSavingReport(true);

      const reportData = {
        patientName:
          patientName || 'Patient',

        patientId:
          patientId || '',

        title:
          'Eye Health Screening Report',

        imageUrl:
          selectedFile?.uri || '',

        predictedCondition:
          prediction.condition,

        confidenceScore:
          Number(prediction.confidence) || 0,

        probabilities: {
          Cataract:
            Number(
              prediction.probabilities?.Cataract || 0
            ),

          Conjunctivitis:
            Number(
              prediction.probabilities?.Conjunctivitis || 0
            ),

          Healthy:
            Number(
              prediction.probabilities?.Healthy || 0
            ),
        },
      };

      console.log(
        'Saving report for patient:',
        patientName
      );

      const response = await fetch(
        `${API_URL}/api/reports/analyze`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Accept:
              'application/json',
          },

          body:
            JSON.stringify(reportData),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          'Failed to save report.'
        );
      }

      return data.report || data;

    } catch (error) {
      console.log(
        'SAVE REPORT ERROR:',
        error
      );

      throw error;

    } finally {
      setIsSavingReport(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      Alert.alert(
        'Select Image',
        'Please choose an eye image first.'
      );
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const formData =
        new FormData();

      formData.append(
        'image',
        {
          uri:
            selectedFile.uri,

          name:
            selectedFile.name,

          type:
            selectedFile.type ||
            'image/jpeg',
        }
      );

      const response =
        await fetch(
          `${API_URL}/api/eye-disease/predict`,
          {
            method: 'POST',
            body: formData,
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
          'Prediction failed.'
        );
      }

      const prediction =
        data.result;

      if (
        prediction.condition ===
        'Invalid Image'
      ) {
        setResult({
          condition:
            'Invalid Image',

          message:
            prediction.message ||
            'Please upload a clear eye image.',

          statusColor:
            '#EF4444',

          isInvalid:
            true,

          validation:
            prediction.validation,
        });

        return;
      }

      if (
        prediction.condition ===
        'Unclear Image'
      ) {
        setResult({
          condition:
            'Unclear Image',

          message:
            prediction.message ||
            'Please upload a clear eye image.',

          statusColor:
            '#F59E0B',

          isInvalid:
            true,

          validation:
            prediction.validation,
        });

        return;
      }

      let statusColor =
        '#22C55E';

      if (
        prediction.condition ===
        'Cataract'
      ) {
        statusColor =
          '#EF4444';

      } else if (
        prediction.condition ===
        'Conjunctivitis'
      ) {
        statusColor =
          '#F59E0B';

      } else if (
        prediction.condition ===
        'Healthy'
      ) {
        statusColor =
          '#22C55E';
      }

      const predictionResult = {
        condition:
          prediction.condition,

        confidence:
          `${prediction.confidence}%`,

        message:
          prediction.message ||
          'Prediction completed successfully.',

        statusColor,

        isInvalid:
          false,

        probabilities:
          prediction.probabilities ||
          {},

        validation:
          prediction.validation ||
          null,
      };

      setResult(
        predictionResult
      );

      try {
        await saveReportToDatabase(
          prediction
        );

      } catch (saveError) {
        console.log(
          'MongoDB save failed:',
          saveError
        );

        Alert.alert(
          'Report Save Warning',
          'Prediction completed, but the report could not be saved to the database.'
        );
      }

    } catch (error) {
      console.log(
        'PREDICTION ERROR:',
        error
      );

      Alert.alert(
        'Prediction Error',
        error?.message ||
        'Unable to connect to the backend.'
      );

    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewReport = () => {
    if (!result) {
      Alert.alert(
        'No Report',
        'Please analyze an image first.'
      );
      return;
    }

    if (result.isInvalid) {
      Alert.alert(
        'Invalid Image',
        'A valid eye image is required to create a report.'
      );
      return;
    }

    onNavigate(
      'Page10_ReportDetail',
      {
        reportData: {
          condition:
            result.condition,

          confidence:
            result.confidence,

          imageUri:
            selectedFile?.uri ||
            null,

          probabilities:
            result.probabilities ||
            {},

          validation:
            result.validation ||
            null,

          patientName:
            patientName ||
            'Patient',

          patientId:
            patientId ||
            '',

          date:
            new Date().toLocaleDateString(),
        },
      }
    );
  };

  const getMeaningText = () => {
    if (!result) {
      return '';
    }

    if (
      result.condition ===
      'Cataract'
    ) {
      return 'The result may indicate signs associated with cataract. Please consult an eye care professional for proper examination and confirmation.';
    }

    if (
      result.condition ===
      'Conjunctivitis'
    ) {
      return 'The result may indicate signs associated with conjunctivitis. Please consult an eye care professional for proper examination and confirmation.';
    }

    if (
      result.condition ===
      'Healthy'
    ) {
      return 'The image appears consistent with a healthy eye based on the AI screening model.';
    }

    return result.message || '';
  };

  const getNextSteps = () => {
    if (!result) {
      return [];
    }

    if (
      result.condition ===
      'Cataract'
    ) {
      return [
        'Book an appointment with an eye specialist.',
        'Have a complete eye examination.',
        'Follow the advice given by your healthcare professional.',
      ];
    }

    if (
      result.condition ===
      'Conjunctivitis'
    ) {
      return [
        'Consult an eye care professional.',
        'Avoid touching or rubbing your eyes.',
        'Follow professional medical advice if treatment is required.',
      ];
    }

    if (
      result.condition ===
      'Healthy'
    ) {
      return [
        'Continue regular eye care.',
        'Maintain good eye hygiene.',
        'Have regular eye examinations when recommended.',
      ];
    }

    return [];
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBarMock />

      <Header
        title="Eye Disease Detection"
        onBack={() =>
          onNavigate(
            'Page05_PatientHome'
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

        <View
          style={
            styles.uploadBox
          }
        >

          <View
            style={
              styles.filePickerRow
            }
          >

            <TouchableOpacity
              style={
                styles.chooseFileButton
              }
              onPress={
                handleChooseFile
              }
              disabled={
                isAnalyzing ||
                isSavingReport
              }
            >

              <Text
                style={
                  styles.chooseFileText
                }
              >
                Choose File
              </Text>

            </TouchableOpacity>

            <Text
              style={
                styles.fileNameText
              }
              numberOfLines={1}
            >
              {selectedFile
                ? selectedFile.name
                : 'No file chosen'}
            </Text>

          </View>

          <TouchableOpacity
            style={
              styles.analyzeButton
            }
            onPress={
              handleAnalyze
            }
            activeOpacity={0.85}
            disabled={
              isAnalyzing ||
              isSavingReport
            }
          >

            {isAnalyzing ? (

              <View
                style={
                  styles.loadingRow
                }
              >

                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.analyzeButtonText
                  }
                >
                  Analyzing...
                </Text>

              </View>

            ) : isSavingReport ? (

              <View
                style={
                  styles.loadingRow
                }
              >

                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.analyzeButtonText
                  }
                >
                  Saving Report...
                </Text>

              </View>

            ) : (

              <Text
                style={
                  styles.analyzeButtonText
                }
              >
                Analyze Image
              </Text>

            )}

          </TouchableOpacity>

        </View>

        <View
          style={
            styles.resultBanner
          }
        >
          <Text
            style={
              styles.resultBannerText
            }
          >
            RESULT
          </Text>
        </View>

        <View
          style={
            styles.legendRow
          }
        >

          <View
            style={
              styles.legendItem
            }
          >
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    '#22C55E',
                },
              ]}
            />

            <Text
              style={
                styles.legendText
              }
            >
              Healthy
            </Text>
          </View>

          <View
            style={
              styles.legendItem
            }
          >
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    '#EF4444',
                },
              ]}
            />

            <Text
              style={
                styles.legendText
              }
            >
              Cataract
            </Text>
          </View>

          <View
            style={
              styles.legendItem
            }
          >
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    '#F59E0B',
                },
              ]}
            />

            <Text
              style={
                styles.legendText
              }
            >
              Conjunctivitis
            </Text>
          </View>

        </View>

        <View
          style={
            styles.resultContainer
          }
        >

          {result ? (

            <View
              style={
                styles.resultDetails
              }
            >

              {selectedFile && (
                <Image
                  source={{
                    uri:
                      selectedFile.uri,
                  }}
                  style={
                    styles.previewImage
                  }
                  resizeMode="cover"
                />
              )}

              {result.isInvalid ? (

                <>

                  <Text
                    style={
                      styles.detectedTitle
                    }
                  >
                    Image Validation:
                  </Text>

                  <Text
                    style={[
                      styles.detectedCondition,
                      {
                        color:
                          result.statusColor,
                      },
                    ]}
                  >
                    {result.condition}
                  </Text>

                  <Text
                    style={
                      styles.invalidMessage
                    }
                  >
                    {result.message}
                  </Text>

                </>

              ) : (

                <>

                  <Text
                    style={
                      styles.detectedTitle
                    }
                  >
                    Diagnosis Result
                  </Text>

                  <Text
                    style={[
                      styles.detectedCondition,
                      {
                        color:
                          result.statusColor,
                      },
                    ]}
                  >
                    {result.condition}
                  </Text>

                  <View
                    style={
                      styles.infoBox
                    }
                  >

                    <Text
                      style={
                        styles.infoTitle
                      }
                    >
                      What does this mean?
                    </Text>

                    <Text
                      style={
                        styles.infoText
                      }
                    >
                      {getMeaningText()}
                    </Text>

                  </View>

                  <View
                    style={
                      styles.nextStepsBox
                    }
                  >

                    <Text
                      style={
                        styles.infoTitle
                      }
                    >
                      Recommended Next Steps
                    </Text>

                    {getNextSteps().map(
                      (step, index) => (

                        <View
                          key={index}
                          style={
                            styles.stepRow
                          }
                        >

                          <Text
                            style={
                              styles.stepBullet
                            }
                          >
                            •
                          </Text>

                          <Text
                            style={
                              styles.stepText
                            }
                          >
                            {step}
                          </Text>

                        </View>

                      )
                    )}

                  </View>

                  {isSavingReport && (
                    <Text
                      style={
                        styles.savingText
                      }
                    >
                      Saving report...
                    </Text>
                  )}

                  <TouchableOpacity
                    style={
                      styles.viewReportButton
                    }
                    onPress={
                      handleViewReport
                    }
                    disabled={
                      isSavingReport
                    }
                  >

                    <Text
                      style={
                        styles.viewReportText
                      }
                    >
                      View Full Report
                    </Text>

                  </TouchableOpacity>

                </>

              )}

            </View>

          ) : (

            <Text
              style={
                styles.noResultText
              }
            >
              No result
            </Text>

          )}

        </View>

      </ScrollView>

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

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        '#FFFFFF',
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 24,
    },

    uploadBox: {
      backgroundColor:
        '#EAEFFE',
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
      marginBottom: 20,
    },

    filePickerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor:
        '#828FA3',
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 8,
      width: '90%',
      marginBottom: 20,
    },

    chooseFileButton: {
      backgroundColor:
        '#FFFFFF',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 4,
      marginRight: 10,
    },

    chooseFileText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#000000',
    },

    fileNameText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '600',
      flex: 1,
    },

    analyzeButton: {
      backgroundColor:
        '#5B92E5',
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 24,
      shadowColor:
        '#5B92E5',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 3,
    },

    analyzeButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },

    loadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    resultBanner: {
      backgroundColor:
        '#EAEFFE',
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: 'center',
      marginBottom: 16,
    },

    resultBannerText: {
      fontSize: 16,
      fontWeight: '800',
      color: '#1E293B',
      letterSpacing: 1,
    },

    legendRow: {
      flexDirection: 'row',
      justifyContent:
        'space-around',
      alignItems: 'center',
      marginBottom: 20,
    },

    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 6,
    },

    legendText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#000000',
    },

    resultContainer: {
      backgroundColor:
        '#EAEFFE',
      borderRadius: 12,
      minHeight: 250,
      justifyContent:
        'center',
      alignItems: 'center',
      padding: 16,
    },

    resultDetails: {
      alignItems: 'center',
      width: '100%',
    },

    previewImage: {
      width: 90,
      height: 90,
      borderRadius: 45,
      marginBottom: 10,
    },

    detectedTitle: {
      fontSize: 14,
      color: '#475569',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 4,
    },

    detectedCondition: {
      fontSize: 20,
      fontWeight: '800',
      marginVertical: 6,
      textAlign: 'center',
    },

    invalidMessage: {
      fontSize: 13,
      fontWeight: '600',
      color: '#475569',
      textAlign: 'center',
      marginBottom: 8,
      lineHeight: 20,
    },

    infoBox: {
      width: '100%',
      backgroundColor:
        '#FFFFFF',
      borderRadius: 10,
      padding: 14,
      marginTop: 12,
      marginBottom: 10,
    },

    nextStepsBox: {
      width: '100%',
      backgroundColor:
        '#FFFFFF',
      borderRadius: 10,
      padding: 14,
      marginBottom: 12,
    },

    infoTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: '#1E293B',
      marginBottom: 8,
    },

    infoText: {
      fontSize: 13,
      lineHeight: 20,
      fontWeight: '500',
      color: '#475569',
    },

    stepRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 6,
    },

    stepBullet: {
      fontSize: 18,
      lineHeight: 20,
      fontWeight: '800',
      color: '#5B92E5',
      marginRight: 8,
    },

    stepText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 20,
      fontWeight: '500',
      color: '#475569',
    },

    savingText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#5B92E5',
      marginBottom: 10,
    },

    viewReportButton: {
      backgroundColor:
        '#5B92E5',
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 16,
    },

    viewReportText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '700',
    },

    noResultText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#000000',
    },

  });