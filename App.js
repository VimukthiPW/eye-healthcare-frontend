import React, { useState } from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';


// =================================================
// Import All 17 Screens
// =================================================

import Page01_RoleSelect from './src/screens/Page01_RoleSelect';
import Page02_Welcome from './src/screens/Page02_Welcome';
import Page03_SignUp from './src/screens/Page03_SignUp';
import Page04_SignIn from './src/screens/Page04_SignIn';
import Page05_PatientHome from './src/screens/Page05_PatientHome';
import Page06_EyeDetection from './src/screens/Page06_EyeDetection';
import Page07_DoctorsList from './src/screens/Page07_DoctorsList';
import Page08_DoctorDetailPatient from './src/screens/Page08_DoctorDetailPatient';
import Page09_ReportsList from './src/screens/Page09_ReportsList';
import Page10_ReportDetail from './src/screens/Page10_ReportDetail';
import Page11_SendReport from './src/screens/Page11_SendReport';
import Page12_EyeCareTips from './src/screens/Page12_EyeCareTips';
import Page13_EagleVisionBot from './src/screens/Page13_EagleVisionBot';
import Page14_Profile from './src/screens/Page14_Profile';
import Page15_DoctorHome from './src/screens/Page15_DoctorHome';
import Page16_DoctorDetailDoctor from './src/screens/Page16_DoctorDetailDoctor';
import Page17_PatientAppointments from './src/screens/Page17_PatientAppointments';


// =================================================
// Main App
// =================================================

export default function App() {

  // =================================================
  // Navigation State
  // =================================================

  const [currentScreen, setCurrentScreen] =
    useState('Page01_RoleSelect');


  // =================================================
  // User Role
  // =================================================

  const [userRole, setUserRole] =
    useState('Patient');


  // =================================================
  // Selected Doctor
  // =================================================

  const [selectedDoctor, setSelectedDoctor] =
    useState(null);


  // =================================================
  // Selected Doctor ID
  // =================================================

  const [selectedDoctorId, setSelectedDoctorId] =
    useState(null);


  // =================================================
  // Eye Disease Report Data
  // =================================================

  const [reportData, setReportData] =
    useState(null);


  // =================================================
  // Navigation Function
  // =================================================

  const navigateTo = (
    screenId,
    params = {}
  ) => {

    // -------------------------------------------------
    // Update User Role
    // -------------------------------------------------

    if (params.role) {

      setUserRole(params.role);

    }


    // -------------------------------------------------
    // Save Selected Doctor
    // -------------------------------------------------

    if (params.selectedDoctor) {

      setSelectedDoctor(
        params.selectedDoctor
      );

    }


    // -------------------------------------------------
    // Save Doctor ID
    // -------------------------------------------------

    if (params.doctorId) {

      console.log(
        'Saving Doctor ID:',
        params.doctorId
      );

      setSelectedDoctorId(
        params.doctorId
      );

    }


    // -------------------------------------------------
    // Save Eye Disease Report
    // -------------------------------------------------

    if (params.reportData) {

      console.log(
        'Saving Report Data:',
        params.reportData
      );

      setReportData(
        params.reportData
      );

    }


    // -------------------------------------------------
    // Navigate to Screen
    // -------------------------------------------------

    setCurrentScreen(
      screenId
    );

  };


  // =================================================
  // Render Screens
  // =================================================

  const renderScreen = () => {

    switch (currentScreen) {


      // =================================================
      // PAGE 01
      // Role Select
      // =================================================

      case 'Page01_RoleSelect':

        return (
          <Page01_RoleSelect
            onNavigate={navigateTo}
            userRole={userRole}
            setUserRole={setUserRole}
          />
        );


      // =================================================
      // PAGE 02
      // Welcome
      // =================================================

      case 'Page02_Welcome':

        return (
          <Page02_Welcome
            onNavigate={navigateTo}
          />
        );


      // =================================================
      // PAGE 03
      // Sign Up
      // =================================================

      case 'Page03_SignUp':

        return (
          <Page03_SignUp
            onNavigate={navigateTo}
            userRole={userRole}
          />
        );


      // =================================================
      // PAGE 04
      // Sign In
      // =================================================

      case 'Page04_SignIn':

        return (
          <Page04_SignIn
            onNavigate={navigateTo}
            userRole={userRole}
          />
        );


      // =================================================
      // PAGE 05
      // Patient Home
      // =================================================

      case 'Page05_PatientHome':

        return (
          <Page05_PatientHome
            onNavigate={navigateTo}
          />
        );


      // =================================================
      // PAGE 06
      // Eye Disease Detection
      // =================================================

      case 'Page06_EyeDetection':

        return (
          <Page06_EyeDetection
            onNavigate={navigateTo}
          />
        );


      // =================================================
      // PAGE 07
      // Doctors List
      // =================================================

      case 'Page07_DoctorsList':

        return (
          <Page07_DoctorsList
            onNavigate={navigateTo}
            setSelectedDoctor={setSelectedDoctor}
          />
        );


      // =================================================
      // PAGE 08
      // Doctor Detail - Patient
      // =================================================

      case 'Page08_DoctorDetailPatient':

        return (
          <Page08_DoctorDetailPatient
            onNavigate={navigateTo}
            selectedDoctor={selectedDoctor}
          />
        );


      // =================================================
      // PAGE 09
      // Reports List
      // =================================================

      case 'Page09_ReportsList':

        return (
          <Page09_ReportsList
            onNavigate={navigateTo}
          />
        );


      // =================================================
      // PAGE 10
      // Report Detail
      // =================================================

      case 'Page10_ReportDetail':

        return (
          <Page10_ReportDetail
            onNavigate={navigateTo}
            reportData={reportData}
          />
        );


      // =================================================
      // PAGE 11
      // Send Report
      // =================================================

      case 'Page11_SendReport':

        return (
          <Page11_SendReport
            onNavigate={navigateTo}
            reportData={reportData}
          />
        );


      // =================================================
      // PAGE 12
      // Eye Care Tips
      // =================================================

      case 'Page12_EyeCareTips':

        return (
          <Page12_EyeCareTips
            onNavigate={navigateTo}
          />
        );


      // =================================================
      // PAGE 13
      // Eagle Vision Bot
      // =================================================

      case 'Page13_EagleVisionBot':

        return (
          <Page13_EagleVisionBot
            onNavigate={navigateTo}
          />
        );


      // =================================================
      // PAGE 14
      // Profile
      // =================================================

      case 'Page14_Profile':

        return (
          <Page14_Profile
            onNavigate={navigateTo}
          />
        );


      // =================================================
      // PAGE 15
      // Doctor Home
      // =================================================

      case 'Page15_DoctorHome':

        return (
          <Page15_DoctorHome
            onNavigate={navigateTo}
            doctorId={selectedDoctorId}
          />
        );


      // =================================================
      // PAGE 16
      // Doctor Detail
      // =================================================

      case 'Page16_DoctorDetailDoctor':

        return (
          <Page16_DoctorDetailDoctor
            onNavigate={navigateTo}
            doctorId={selectedDoctorId}
          />
        );


      // =================================================
      // PAGE 17
      // Patient Appointments
      // =================================================

      case 'Page17_PatientAppointments':

        return (
          <Page17_PatientAppointments
            onNavigate={navigateTo}
          />
        );


      // =================================================
      // Default Screen
      // =================================================

      default:

        return (
          <Page01_RoleSelect
            onNavigate={navigateTo}
            userRole={userRole}
            setUserRole={setUserRole}
          />
        );

    }

  };


  // =================================================
  // Main App UI
  // =================================================

  return (

    <View style={styles.appOuterContainer}>

      <StatusBar style="dark" />


      {/* =================================================
          Mobile Device Container
      ================================================= */}

      <View style={styles.mobileScreenContainer}>

        {renderScreen()}

      </View>

    </View>

  );

}


// =================================================
// Styles
// =================================================

const styles = StyleSheet.create({

  appOuterContainer: {

    flex: 1,

    backgroundColor: '#0F172A',

    alignItems: 'center',

    justifyContent: 'flex-start',

  },


  mobileScreenContainer: {

    flex: 1,

    width: '100%',

    maxWidth: 440,

    backgroundColor: '#FFFFFF',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 10,
    },

    shadowOpacity: 0.4,

    shadowRadius: 16,

    elevation: 10,

  },

});