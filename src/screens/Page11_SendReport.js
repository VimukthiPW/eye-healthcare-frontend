import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
} from 'react-native';

import StatusBarMock from '../components/StatusBarMock';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';

import API_URL from '../config/api';


export default function Page11_SendReport({
  onNavigate,
  reportData,
}) {

  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

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
    report.date || '';


  const handleSend = async () => {

    if (!email.trim()) {

      Alert.alert(
        'Email Required',
        'Please enter the recipient email address.'
      );

      return;
    }


    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(email.trim())) {

      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.'
      );

      return;
    }


    try {

      setIsSending(true);


      console.log(
        '================================='
      );

      console.log(
        'Sending Medical Report'
      );

      console.log(
        'API URL:',
        `${API_URL}/api/reports/send`
      );

      console.log(
        'Recipient:',
        email.trim()
      );


      const requestBody = {

        email: email.trim(),

        patientName: patientName,

        patientId: patientId,

        date: reportDate,

        condition: condition,

        confidence: confidence,

        probabilities: {

          Cataract:
            Number(probabilities.Cataract ?? 0),

          Conjunctivitis:
            Number(probabilities.Conjunctivitis ?? 0),

          Healthy:
            Number(probabilities.Healthy ?? 0),

        },

      };


      console.log(
        'Request Body:',
        requestBody
      );


      const response = await fetch(
        `${API_URL}/api/reports/send`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },

          body: JSON.stringify(
            requestBody
          ),
        }
      );


      const data =
        await response.json();


      console.log(
        'Backend Response:',
        data
      );


      if (!response.ok || !data.success) {

        throw new Error(
          data.error ||
          data.message ||
          'Failed to send medical report.'
        );
      }


      Alert.alert(
        'Report Sent Successfully',
        `Medical report has been successfully sent to ${email.trim()}.`,
        [
          {
            text: 'OK',

            onPress: () => {

              onNavigate(
                'Page10_ReportDetail'
              );

            },
          },
        ]
      );


    } catch (error) {

      console.log(
        '================================='
      );

      console.log(
        'SEND REPORT ERROR:',
        error
      );

      console.log(
        '================================='
      );


      if (
        error.message ===
        'Network request failed'
      ) {

        Alert.alert(
          'Connection Error',
          'Cannot connect to the backend server. Please make sure the backend server is running.'
        );

      } else {

        Alert.alert(
          'Send Failed',
          error.message ||
          'Unable to send the medical report.'
        );

      }


    } finally {

      setIsSending(false);

    }

  };


  return (

    <SafeAreaView style={styles.container}>

      <StatusBarMock />


      <Header
        title="Report"

        onBack={() =>
          onNavigate(
            'Page10_ReportDetail'
          )
        }
      />


      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >


        <View style={styles.cardBox}>


          <Text style={styles.cardTitle}>
            Send Medical Report
          </Text>


          <View style={styles.reportPreview}>


            {imageUri && (

              <Image
                source={{
                  uri: imageUri,
                }}

                style={styles.previewImage}

                resizeMode="cover"
              />

            )}


            <Text style={styles.previewText}>

              <Text style={styles.previewLabel}>
                Patient:{' '}
              </Text>

              {patientName}

            </Text>


            <Text style={styles.previewText}>

              <Text style={styles.previewLabel}>
                Patient ID:{' '}
              </Text>

              {patientId}

            </Text>


            {reportDate !== '' && (

              <Text style={styles.previewText}>

                <Text style={styles.previewLabel}>
                  Date:{' '}
                </Text>

                {reportDate}

              </Text>

            )}


            <Text style={styles.previewText}>

              <Text style={styles.previewLabel}>
                Condition:{' '}
              </Text>

              {condition}

            </Text>


          </View>


          <Text style={styles.inputLabel}>
            Recipient Email
          </Text>


          <TextInput
            style={styles.emailInput}

            placeholder="Enter email"

            placeholderTextColor="#94A3B8"

            keyboardType="email-address"

            autoCapitalize="none"

            autoCorrect={false}

            value={email}

            onChangeText={setEmail}

            editable={!isSending}
          />


          <TouchableOpacity

            style={[
              styles.sendButton,

              isSending &&
                styles.sendButtonDisabled,
            ]}

            onPress={handleSend}

            activeOpacity={0.85}

            disabled={isSending}
          >

            <Text style={styles.sendButtonText}>

              {isSending
                ? 'SENDING...'
                : 'SEND REPORT'}

            </Text>

          </TouchableOpacity>


        </View>

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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },


  cardBox: {
    width: '100%',
    backgroundColor: '#EAEFFE',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },


  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
  },


  reportPreview: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 22,
  },


  previewImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignSelf: 'center',
    marginBottom: 14,
  },


  previewText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },


  previewLabel: {
    fontWeight: '800',
    color: '#475569',
  },


  inputLabel: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 8,
  },


  emailInput: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },


  sendButton: {
    backgroundColor: '#5B92E5',
    paddingHorizontal: 32,
    paddingVertical: 13,
    borderRadius: 22,

    shadowColor: '#5B92E5',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.3,

    shadowRadius: 6,

    elevation: 4,
  },


  sendButtonDisabled: {
    opacity: 0.6,
  },


  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

});