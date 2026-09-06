import React, {
  useCallback,
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
  RefreshControl,
  Alert,
} from 'react-native';

import { Activity } from 'lucide-react-native';

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

export default function Page09_ReportsList({
  onNavigate,
}) {

  // =================================================
  // State
  // =================================================

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);


  // =================================================
  // Get Reports
  // =================================================

  const fetchReports = useCallback(
    async () => {

      try {

        console.log(
          'Fetching reports from backend...'
        );


        const response =
          await fetch(
            `${API_URL}/api/reports`,
            {
              method: 'GET',

              headers: {
                Accept:
                  'application/json',
              },
            }
          );


        console.log(
          'Reports response status:',
          response.status
        );


        const data =
          await response.json();


        console.log(
          'Reports response:',
          data
        );


        if (!response.ok) {

          throw new Error(
            data.message ||
            'Failed to load reports.'
          );

        }


        // -------------------------------------------------
        // Backend returns:
        // {
        //   success: true,
        //   count: ...,
        //   reports: [...]
        // }
        // -------------------------------------------------

        const reportList =
          Array.isArray(data)
            ? data
            : data.reports || [];


        setReports(
          reportList
        );


      } catch (error) {

        console.log(
          'FETCH REPORTS ERROR:',
          error
        );


        Alert.alert(
          'Reports Error',
          error?.message ||
          'Unable to load medical reports.'
        );


      } finally {

        setLoading(false);

        setRefreshing(false);

      }

    },
    []
  );


  // =================================================
  // Load reports when screen opens
  // =================================================

  React.useEffect(() => {

    fetchReports();

  }, [fetchReports]);


  // =================================================
  // Pull To Refresh
  // =================================================

  const handleRefresh = () => {

    setRefreshing(true);

    fetchReports();

  };


  // =================================================
  // Format Date
  // =================================================

  const formatDate = (
    date
  ) => {

    if (!date) {

      return 'Unknown date';

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

    } catch (error) {

      return 'Unknown date';

    }

  };


  // =================================================
  // Get Condition Color
  // =================================================

  const getConditionColor = (
    condition
  ) => {

    if (
      condition ===
      'Healthy'
    ) {

      return '#22C55E';

    }


    if (
      condition ===
      'Cataract'
    ) {

      return '#EF4444';

    }


    if (
      condition ===
      'Conjunctivitis'
    ) {

      return '#F59E0B';

    }


    return '#5B92E5';

  };


  // =================================================
  // Open Report
  // =================================================

  const handleOpenReport = (
    report
  ) => {

    // -------------------------------------------------
    // Convert MongoDB report into Page10 format
    // -------------------------------------------------

    const reportData = {

      reportId:
        report._id,

      condition:
        report.predictedCondition ||
        'No diagnosis',

      confidence:
        `${Number(
          report.confidenceScore || 0
        ).toFixed(2)}%`,

      imageUri:
        report.scanImageUrl ||
        null,

      probabilities:
        report.probabilities ||
        {},

      patientName:
        report.patient?.name ||
        report.patientName ||
        'John Doe',

      patientId:
        report.patient?._id ||
        report.patientId ||
        'P123456',

      date:
        formatDate(
          report.createdAt
        ),

      severity:
        report.severity ||
        'Normal',

      findings:
        report.findings ||
        [],

      recommendations:
        report.recommendations ||
        [],

      status:
        report.status ||
        'Generated',

    };


    console.log(
      'Opening report:',
      reportData
    );


    // -------------------------------------------------
    // Navigate to Page10
    // -------------------------------------------------

    onNavigate(
      'Page10_ReportDetail',
      {
        reportData:
          reportData,
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
        title="Report"
        showBack={false}
      />


      {/* =================================================
          Loading
      ================================================= */}

      {loading ? (

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
            Loading reports...
          </Text>

        </View>

      ) : (

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

              colors={[
                '#5B92E5',
              ]}

            />

          }

        >


          {/* =================================================
              No Reports
          ================================================= */}

          {reports.length === 0 ? (

            <View
              style={
                styles.emptyContainer
              }
            >

              <View
                style={
                  styles.emptyIconBox
                }
              >

                <Activity
                  size={32}
                  color="#5B92E5"
                  strokeWidth={2}
                />

              </View>


              <Text
                style={
                  styles.emptyTitle
                }
              >
                No Reports Yet
              </Text>


              <Text
                style={
                  styles.emptyText
                }
              >
                Your eye screening reports
                will appear here after you
                analyze an eye image.
              </Text>

            </View>

          ) : (

            /* =================================================
               Reports List
            ================================================= */

            reports.map(
              (report) => {

                const condition =
                  report.predictedCondition ||
                  'No diagnosis';


                const confidence =
                  Number(
                    report.confidenceScore || 0
                  ).toFixed(2);


                const conditionColor =
                  getConditionColor(
                    condition
                  );


                return (

                  <TouchableOpacity

                    key={
                      report._id
                    }

                    style={
                      styles.reportCard
                    }

                    onPress={() =>
                      handleOpenReport(
                        report
                      )
                    }

                    activeOpacity={
                      0.85
                    }

                  >


                    {/* =================================================
                        Icon
                    ================================================= */}

                    <View
                      style={
                        styles.iconBox
                      }
                    >

                      <Activity
                        size={24}
                        color={
                          conditionColor
                        }
                        strokeWidth={2.2}
                      />

                    </View>


                    {/* =================================================
                        Report Information
                    ================================================= */}

                    <View
                      style={
                        styles.reportInfo
                      }
                    >

                      <Text
                        style={
                          styles.reportTitle
                        }
                      >

                        {condition}

                      </Text>


                      <Text
                        style={
                          styles.reportDate
                        }
                      >

                        {formatDate(
                          report.createdAt
                        )}

                      </Text>


                      <Text
                        style={
                          styles.confidenceText
                        }
                      >

                        Confidence:{' '}
                        {confidence}%

                      </Text>

                    </View>


                    {/* =================================================
                        Status
                    ================================================= */}

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            conditionColor +
                            '20',
                        },
                      ]}
                    >

                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              conditionColor,
                          },
                        ]}
                      >

                        {report.status ||
                          'Generated'}

                      </Text>

                    </View>

                  </TouchableOpacity>

                );

              }
            )

          )}

        </ScrollView>

      )}


      {/* =================================================
          Bottom Navigation
      ================================================= */}

      <BottomNavBar

        activeTab="Reports"

        onTabSelect={(tab) => {

          if (
            tab === 'Home'
          ) {

            onNavigate(
              'Page05_PatientHome'
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
      paddingBottom: 30,
    },


    // =================================================
    // Loading
    // =================================================

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },


    loadingText: {
      marginTop: 12,
      fontSize: 14,
      fontWeight: '600',
      color: '#64748B',
    },


    // =================================================
    // Empty State
    // =================================================

    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 100,
      paddingHorizontal: 30,
    },


    emptyIconBox: {
      width: 72,
      height: 72,
      borderRadius: 18,
      backgroundColor: '#EAEFFE',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },


    emptyTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: '#0F172A',
      marginBottom: 8,
    },


    emptyText: {
      fontSize: 14,
      lineHeight: 21,
      color: '#64748B',
      textAlign: 'center',
    },


    // =================================================
    // Report Card
    // =================================================

    reportCard: {
      flexDirection: 'row',
      alignItems: 'center',

      backgroundColor: '#FFFFFF',

      borderRadius: 12,

      borderWidth: 1,

      borderColor: '#E2E8F0',

      padding: 14,

      marginBottom: 12,

      shadowColor: '#000',

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.03,

      shadowRadius: 4,

      elevation: 1.5,
    },


    // =================================================
    // Icon
    // =================================================

    iconBox: {
      width: 48,
      height: 48,

      borderRadius: 10,

      backgroundColor: '#EAEFFE',

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 14,
    },


    // =================================================
    // Report Info
    // =================================================

    reportInfo: {
      flex: 1,
      justifyContent: 'center',
    },


    reportTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: '#000000',
      marginBottom: 4,
    },


    reportDate: {
      fontSize: 13,
      color: '#64748B',
      fontWeight: '500',
      marginBottom: 3,
    },


    confidenceText: {
      fontSize: 12,
      color: '#475569',
      fontWeight: '600',
    },


    // =================================================
    // Status
    // =================================================

    statusBadge: {
      borderRadius: 8,
      paddingHorizontal: 7,
      paddingVertical: 5,
      marginLeft: 5,
      maxWidth: 85,
    },


    statusText: {
      fontSize: 9,
      fontWeight: '800',
      textAlign: 'center',
    },

  });
