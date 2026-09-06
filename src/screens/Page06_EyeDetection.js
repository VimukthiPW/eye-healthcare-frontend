import React, { useState } from 'react';

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

import StatusBarMock from '../components/StatusBarMock';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';


// =================================================
// Backend API
// =================================================

const API_URL = 'https://eye-healthcare-backend.vercel.app';


// =================================================
// Page
// =================================================

export default function Page06_EyeDetection({
  onNavigate,
}) {

  // =================================================
  // State
  // =================================================

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [isSavingReport, setIsSavingReport] =
    useState(false);

  const [result, setResult] =
    useState(null);


  // =================================================
  // Choose Image
  // =================================================

  const handleChooseFile = async () => {

    try {

      console.log(
        'Opening image picker...'
      );


      // -------------------------------------------------
      // Permission
      // -------------------------------------------------

      const permission =
        await ImagePicker
          .requestMediaLibraryPermissionsAsync();


      if (!permission.granted) {

        Alert.alert(
          'Permission Required',
          'Please allow photo access to select an eye image.'
        );

        return;
      }


      // -------------------------------------------------
      // Open Gallery
      // -------------------------------------------------

      const pickerResult =
        await ImagePicker
          .launchImageLibraryAsync({

            mediaTypes:
              ImagePicker.MediaTypeOptions.Images,

            allowsEditing: false,

            quality: 1,

          });


      console.log(
        'Image picker result:',
        pickerResult
      );


      // -------------------------------------------------
      // Cancelled
      // -------------------------------------------------

      if (pickerResult.canceled) {

        return;
      }


      // -------------------------------------------------
      // Check Asset
      // -------------------------------------------------

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


      const asset =
        pickerResult.assets[0];


      // -------------------------------------------------
      // Save Image
      // -------------------------------------------------

      setSelectedFile({

        name:
          asset.fileName ||
          'selected_eye_image.jpg',

        uri:
          asset.uri,

        type:
          asset.mimeType ||
          'image/jpeg',

      });


      // Clear old result
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


  // =================================================
  // Save Report To MongoDB
  // =================================================

  const saveReportToDatabase = async (
    prediction
  ) => {

    try {

      setIsSavingReport(true);


      console.log(
        '================================='
      );

      console.log(
        'Saving report to MongoDB...'
      );


      // -------------------------------------------------
      // Prepare data
      // -------------------------------------------------

      const reportData = {

        patientName:
          'John Doe',

        patientId:
          'P123456',

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
        'Report data:',
        reportData
      );


      // -------------------------------------------------
      // Send to Backend
      // -------------------------------------------------

      const response =
        await fetch(
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
              JSON.stringify(
                reportData
              ),

          }
        );


      console.log(
        'Report save status:',
        response.status
      );


      // -------------------------------------------------
      // Read response
      // -------------------------------------------------

      const data =
        await response.json();


      console.log(
        'Report save response:',
        data
      );


      // -------------------------------------------------
      // Check response
      // -------------------------------------------------

      if (!response.ok) {

        throw new Error(
          data.message ||
          data.error ||
          'Failed to save report.'
        );

      }


      console.log(
        'Report saved successfully.'
      );


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


  // =================================================
  // Analyze Image
  // =================================================

  const handleAnalyze = async () => {

    // -------------------------------------------------
    // Check Image
    // -------------------------------------------------

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

      console.log(
        'Preparing image for upload...'
      );


      // -------------------------------------------------
      // FormData
      // -------------------------------------------------

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


      // -------------------------------------------------
      // ML Prediction API
      // -------------------------------------------------

      console.log(
        'Sending image to ML backend...'
      );


      const response =
        await fetch(
          `${API_URL}/api/eye-disease/predict`,
          {

            method: 'POST',

            body: formData,

          }
        );


      console.log(
        'Prediction HTTP status:',
        response.status
      );


      const data =
        await response.json();


      console.log(
        'Prediction response:',
        data
      );


      // -------------------------------------------------
      // Check Prediction
      // -------------------------------------------------

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


      // =================================================
      // INVALID IMAGE
      // =================================================

      if (
        prediction.condition ===
        'Invalid Image'
      ) {

        setResult({

          condition:
            'Invalid Image',

          confidence:
            `${prediction.confidence}%`,

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


      // =================================================
      // UNCLEAR IMAGE
      // =================================================

      if (
        prediction.condition ===
        'Unclear Image'
      ) {

        setResult({

          condition:
            'Unclear Image',

          confidence:
            `${prediction.confidence}%`,

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


      // =================================================
      // VALID EYE IMAGE
      // =================================================

      let statusColor =
        '#22C55E';


      if (
        prediction.condition ===
        'Cataract'
      ) {

        statusColor =
          '#EF4444';

      }


      else if (
        prediction.condition ===
        'Conjunctivitis'
      ) {

        statusColor =
          '#F59E0B';

      }


      else if (
        prediction.condition ===
        'Healthy'
      ) {

        statusColor =
          '#22C55E';

      }


      // -------------------------------------------------
      // Save Result On Screen
      // -------------------------------------------------

      const predictionResult = {

        condition:
          prediction.condition,

        confidence:
          `${prediction.confidence}%`,

        message:
          prediction.message ||
          'Prediction completed successfully.',

        statusColor:
          statusColor,

        isInvalid:
          false,

        probabilities:
          prediction.probabilities || {},

        validation:
          prediction.validation || null,

      };


      setResult(
        predictionResult
      );


      // =================================================
      // SAVE REPORT TO MONGODB
      // =================================================

      try {

        await saveReportToDatabase(
          prediction
        );


        console.log(
          'MongoDB report save completed.'
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


  // =================================================
  // View Full Report
  // =================================================

  const handleViewReport = () => {

    // -------------------------------------------------
    // Check result
    // -------------------------------------------------

    if (!result) {

      Alert.alert(
        'No Report',
        'Please analyze an image first.'
      );

      return;
    }


    // -------------------------------------------------
    // Invalid image
    // -------------------------------------------------

    if (result.isInvalid) {

      Alert.alert(
        'Invalid Image',
        'A valid eye image is required to create a report.'
      );

      return;
    }


    // -------------------------------------------------
    // Navigate to Page10
    // -------------------------------------------------

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
            'John Doe',

          patientId:
            'P123456',

          date:
            new Date()
              .toLocaleDateString(),

        },

      }
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


      {/* =================================================
          Header
      ================================================= */}

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


        {/* =================================================
            Upload Box
        ================================================= */}

        <View
          style={styles.uploadBox}
        >

          <View
            style={styles.filePickerRow}
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


          {/* Analyze Button */}

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


        {/* =================================================
            Result Header
        ================================================= */}

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


        {/* =================================================
            Legend
        ================================================= */}

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


        {/* =================================================
            Result Display
        ================================================= */}

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


              {/* Selected Image */}

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


              {/* =================================================
                  INVALID IMAGE
              ================================================= */}

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


                  <Text
                    style={
                      styles.confidenceText
                    }
                  >
                    Confidence:{' '}
                    {result.confidence}
                  </Text>


                  {result.validation && (

                    <Text
                      style={
                        styles.validationText
                      }
                    >

                      Eye Confidence:{' '}
                      {
                        result.validation
                          .eye_confidence
                      }%

                      {'\n'}

                      Non-Eye Confidence:{' '}
                      {
                        result.validation
                          .non_eye_confidence
                      }%

                    </Text>

                  )}

                </>

              ) : (

                <>
                  {/* =================================================
                      VALID RESULT
                  ================================================= */}

                  <Text
                    style={
                      styles.detectedTitle
                    }
                  >
                    Diagnosis Result:
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
                    {' '}Detected

                  </Text>


                  <Text
                    style={
                      styles.confidenceText
                    }
                  >

                    Confidence:{' '}
                    {result.confidence}

                  </Text>


                  {/* =================================================
                      Prediction Probabilities
                  ================================================= */}

                  {result.probabilities && (

                    <View
                      style={
                        styles.probabilityBox
                      }
                    >

                      <Text
                        style={
                          styles.probabilityText
                        }
                      >

                        Cataract:{' '}
                        {
                          result
                            .probabilities
                            .Cataract ?? 0
                        }%

                      </Text>


                      <Text
                        style={
                          styles.probabilityText
                        }
                      >

                        Conjunctivitis:{' '}
                        {
                          result
                            .probabilities
                            .Conjunctivitis ?? 0
                        }%

                      </Text>


                      <Text
                        style={
                          styles.probabilityText
                        }
                      >

                        Healthy:{' '}
                        {
                          result
                            .probabilities
                            .Healthy ?? 0
                        }%

                      </Text>

                    </View>

                  )}


                  {/* =================================================
                      MongoDB Status
                  ================================================= */}

                  {isSavingReport && (

                    <Text
                      style={
                        styles.savingText
                      }
                    >
                      Saving report...
                    </Text>

                  )}


                  {/* =================================================
                      View Full Report
                  ================================================= */}

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

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },


    content: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 24,
    },


    uploadBox: {
      backgroundColor: '#EAEFFE',
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
      marginBottom: 20,
    },


    filePickerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#828FA3',
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 8,
      width: '90%',
      marginBottom: 20,
    },


    chooseFileButton: {
      backgroundColor: '#FFFFFF',
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
      backgroundColor: '#5B92E5',
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 24,

      shadowColor: '#5B92E5',

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
      backgroundColor: '#EAEFFE',
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
      justifyContent: 'space-around',
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
      backgroundColor: '#EAEFFE',
      borderRadius: 12,
      minHeight: 250,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },


    noResultText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#000000',
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
    },


    detectedCondition: {
      fontSize: 20,
      fontWeight: '800',
      marginVertical: 4,
      textAlign: 'center',
    },


    confidenceText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#334155',
      marginBottom: 12,
      textAlign: 'center',
    },


    invalidMessage: {
      fontSize: 13,
      fontWeight: '600',
      color: '#475569',
      textAlign: 'center',
      marginBottom: 8,
    },


    validationText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#64748B',
      textAlign: 'center',
      marginBottom: 10,
      lineHeight: 18,
    },


    probabilityBox: {
      width: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: 8,
      padding: 10,
      marginBottom: 12,
    },


    probabilityText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#475569',
      textAlign: 'center',
      marginVertical: 2,
    },


    savingText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#5B92E5',
      marginBottom: 10,
    },


    viewReportButton: {
      backgroundColor: '#5B92E5',
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 16,
    },


    viewReportText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '700',
    },

  });
