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
  const report = reportData || {};

  const condition =
    report.condition || 'No diagnosis';

  const imageUri =
    report.imageUri || null;

  const patientName =
    report.patientName || 'John Doe';

  const patientId =
    report.patientId || 'P123456';

  const reportDate =
    report.date || new Date().toLocaleDateString();

  const getMeaningText = () => {
    if (condition === 'Cataract') {
      return 'The result may indicate signs associated with cataract. Please consult an eye care professional for a complete examination and confirmation.';
    }

    if (condition === 'Conjunctivitis') {
      return 'The result may indicate signs associated with conjunctivitis. Please consult an eye care professional for proper examination and advice.';
    }

    if (condition === 'Healthy') {
      return 'The image appears consistent with a healthy eye based on the AI screening result.';
    }

    return 'The screening result could not be clearly determined. Please upload a clear eye image or consult an eye care professional.';
  };

  const getConditionColor = () => {
    if (condition === 'Cataract') {
      return '#EF4444';
    }

    if (condition === 'Conjunctivitis') {
      return '#F59E0B';
    }

    if (condition === 'Healthy') {
      return '#22C55E';
    }

    return '#64748B';
  };

  const getNextSteps = () => {
    if (condition === 'Cataract') {
      return [
        'Book an appointment with an eye specialist.',
        'Have a complete eye examination.',
        'Follow the advice given by your healthcare professional.',
      ];
    }

    if (condition === 'Conjunctivitis') {
      return [
        'Consult an eye care professional.',
        'Avoid touching or rubbing your eyes.',
        'Follow professional medical advice if treatment is required.',
      ];
    }

    if (condition === 'Healthy') {
      return [
        'Continue regular eye care.',
        'Maintain good eye hygiene.',
        'Have regular eye examinations when recommended.',
      ];
    }

    return [
      'Upload a clear eye image for screening.',
      'If you have eye symptoms, consult an eye care professional.',
    ];
  };

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

        <View style={styles.reportCard}>

          <Text style={styles.cardHeader}>
            EYE HEALTH REPORT
          </Text>

          <View style={styles.patientSection}>

            <Text style={styles.sectionTitle}>
              Patient Information
            </Text>

            <View style={styles.infoRow}>

              <Text style={styles.infoLabel}>
                Patient Name
              </Text>

              <Text style={styles.infoValue}>
                {patientName}
              </Text>

            </View>

            <View style={styles.infoRow}>

              <Text style={styles.infoLabel}>
                Patient ID
              </Text>

              <Text style={styles.infoValue}>
                {patientId}
              </Text>

            </View>

            <View style={styles.infoRow}>

              <Text style={styles.infoLabel}>
                Date
              </Text>

              <Text style={styles.infoValue}>
                {reportDate}
              </Text>

            </View>

          </View>

          {imageUri && (
            <View style={styles.imageSection}>

              <Text style={styles.sectionTitle}>
                Examined Eye Image
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

          <View style={styles.diagnosisSection}>

            <Text style={styles.sectionTitle}>
              Diagnosis Result
            </Text>

            <View
              style={[
                styles.conditionBox,
                {
                  borderLeftColor:
                    getConditionColor(),
                },
              ]}
            >

              <Text
                style={[
                  styles.conditionText,
                  {
                    color:
                      getConditionColor(),
                  },
                ]}
              >
                {condition}
              </Text>

            </View>

          </View>

          <View style={styles.infoBox}>

            <Text style={styles.infoTitle}>
              What does this mean?
            </Text>

            <Text style={styles.infoText}>
              {getMeaningText()}
            </Text>

          </View>

          <View style={styles.nextStepsBox}>

            <Text style={styles.infoTitle}>
              Recommended Next Steps
            </Text>

            {getNextSteps().map(
              (step, index) => (

                <View
                  key={index}
                  style={styles.stepRow}
                >

                  <Text
                    style={styles.stepBullet}
                  >
                    •
                  </Text>

                  <Text
                    style={styles.stepText}
                  >
                    {step}
                  </Text>

                </View>

              )
            )}

          </View>

        </View>

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


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    alignItems: 'center',
  },

  reportCard: {
    width: '100%',
    backgroundColor: '#EAEFFE',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginBottom: 20,
  },

  cardHeader: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
  },

  patientSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },

  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    maxWidth: '60%',
    textAlign: 'right',
  },

  imageSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 14,
  },

  reportImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },

  diagnosisSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },

  conditionBox: {
    borderLeftWidth: 5,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  conditionText: {
    fontSize: 20,
    fontWeight: '800',
  },

  infoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },

  infoText: {
    fontSize: 13,
    lineHeight: 21,
    fontWeight: '500',
    color: '#475569',
  },

  nextStepsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 7,
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

  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B92E5',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
    width: '65%',
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