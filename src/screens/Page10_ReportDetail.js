import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';

import { Send } from 'lucide-react-native';

import StatusBarMock from '../components/StatusBarMock';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';

export default function Page10_ReportDetail({
  onNavigate,
  reportData,
}) {

  // =================================================
  // Get Report Data
  // =================================================

  const report = reportData || {};

  const condition =
    report.condition || 'No diagnosis';

  const confidence =
    report.confidence || '0%';

  const imageUri =
    report.imageUri || null;

  const probabilities =
    report.probabilities || {};

  const patientName =
    report.patientName || 'John Doe';

  const patientId =
    report.patientId || 'P123456';

  const reportDate =
    report.date || 'Aug 24, 2026';


  // =================================================
  // Open Send Report Page
  // =================================================

  const handleShareReport = () => {

    onNavigate(
      'Page11_SendReport',
      {
        reportData: report,
      }
    );

  };


  return (
    <SafeAreaView style={styles.container}>

      <StatusBarMock />

      {/* =================================================
          Header
      ================================================= */}

      <Header
        title="Report"
        onBack={() =>
          onNavigate('Page09_ReportsList')
        }
      />


      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >


        {/* =================================================
            Report Card
        ================================================= */}

        <View style={styles.reportCard}>

          <Text style={styles.cardHeader}>
            EYE HEALTH SCREENING REPORT
          </Text>


          {/* =================================================
              Patient Name
          ================================================= */}

          <View style={styles.infoRow}>

            <Text style={styles.infoText}>

              <Text style={styles.label}>
                Patient Name :{' '}
              </Text>

              {patientName}

            </Text>

          </View>


          {/* =================================================
              Patient ID
          ================================================= */}

          <View style={styles.infoRow}>

            <Text style={styles.infoText}>

              <Text style={styles.label}>
                Patient ID :{' '}
              </Text>

              {patientId}

            </Text>

          </View>


          {/* =================================================
              Date
          ================================================= */}

          <View style={styles.infoRow}>

            <Text style={styles.infoText}>

              <Text style={styles.label}>
                Date :{' '}
              </Text>

              {reportDate}

            </Text>

          </View>


          {/* =================================================
              Selected Eye Image
          ================================================= */}

          {imageUri && (

            <View style={styles.imageSection}>

              <Text style={styles.imageLabel}>
                Analyzed Eye Image
              </Text>

              <Image
                source={{
                  uri: imageUri,
                }}

                style={styles.reportImage}

                resizeMode="cover"
              />

            </View>

          )}


          {/* =================================================
              Condition
          ================================================= */}

          <View style={styles.infoRow}>

            <Text style={styles.infoText}>

              <Text style={styles.label}>
                Condition :{' '}
              </Text>

              {condition}

            </Text>

          </View>


          {/* =================================================
              Confidence
          ================================================= */}

          <View style={styles.infoRow}>

            <Text style={styles.infoText}>

              <Text style={styles.label}>
                Confidence :{' '}
              </Text>

              {confidence}

            </Text>

          </View>


          {/* =================================================
              Prediction Probabilities
          ================================================= */}

          {Object.keys(probabilities).length > 0 && (

            <View style={styles.probabilitySection}>

              <Text style={styles.probabilityTitle}>
                Prediction Probabilities
              </Text>


              {/* Cataract */}

              <View style={styles.probabilityRow}>

                <Text style={styles.probabilityName}>
                  Cataract
                </Text>

                <Text style={styles.probabilityValue}>
                  {probabilities.Cataract ?? 0}%
                </Text>

              </View>


              {/* Conjunctivitis */}

              <View style={styles.probabilityRow}>

                <Text style={styles.probabilityName}>
                  Conjunctivitis
                </Text>

                <Text style={styles.probabilityValue}>
                  {probabilities.Conjunctivitis ?? 0}%
                </Text>

              </View>


              {/* Healthy */}

              <View style={styles.probabilityRow}>

                <Text style={styles.probabilityName}>
                  Healthy
                </Text>

                <Text style={styles.probabilityValue}>
                  {probabilities.Healthy ?? 0}%
                </Text>

              </View>

            </View>

          )}

        </View>


        {/* =================================================
            Share / Send Button
        ================================================= */}

        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareReport}
          activeOpacity={0.85}
        >

          <Send
            size={20}
            color="#FFFFFF"
            style={styles.sendIcon}
          />

          <Text style={styles.shareButtonText}>
            Share / Send
          </Text>

        </TouchableOpacity>


      </ScrollView>


      {/* =================================================
          Bottom Navigation
      ================================================= */}

      <BottomNavBar
        activeTab="Reports"

        onTabSelect={(tab) => {

          if (tab === 'Home') {

            onNavigate(
              'Page05_PatientHome'
            );

          }

          if (tab === 'Profile') {

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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },


  // =================================================
  // Report Card
  // =================================================

  reportCard: {
    width: '100%',

    backgroundColor: '#EAEFFE',

    borderRadius: 24,

    paddingHorizontal: 20,

    paddingVertical: 24,

    marginBottom: 30,
  },


  cardHeader: {
    fontSize: 16,

    fontWeight: '800',

    color: '#0F172A',

    marginBottom: 18,

    letterSpacing: 0.5,
  },


  infoRow: {
    marginBottom: 12,
  },


  infoText: {
    fontSize: 16,

    fontWeight: '700',

    color: '#334155',
  },


  label: {
    fontWeight: '800',

    color: '#475569',
  },


  // =================================================
  // Image
  // =================================================

  imageSection: {
    alignItems: 'center',

    marginVertical: 10,

    marginBottom: 18,
  },


  imageLabel: {
    fontSize: 14,

    fontWeight: '700',

    color: '#475569',

    marginBottom: 8,
  },


  reportImage: {
    width: 130,

    height: 130,

    borderRadius: 65,
  },


  // =================================================
  // Probabilities
  // =================================================

  probabilitySection: {
    backgroundColor: '#FFFFFF',

    borderRadius: 12,

    padding: 14,

    marginTop: 8,
  },


  probabilityTitle: {
    fontSize: 14,

    fontWeight: '800',

    color: '#0F172A',

    marginBottom: 10,
  },


  probabilityRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    marginVertical: 4,
  },


  probabilityName: {
    fontSize: 13,

    fontWeight: '600',

    color: '#475569',
  },


  probabilityValue: {
    fontSize: 13,

    fontWeight: '800',

    color: '#334155',
  },


  // =================================================
  // Share Button
  // =================================================

  shareButton: {
    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#5B92E5',

    paddingHorizontal: 28,

    paddingVertical: 12,

    borderRadius: 12,

    shadowColor: '#5B92E5',

    shadowOffset: {
      width: 0,

      height: 4,
    },

    shadowOpacity: 0.3,

    shadowRadius: 6,

    elevation: 4,
  },


  sendIcon: {
    marginRight: 10,
  },


  shareButtonText: {
    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: '700',
  },

});