import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { ChevronDown, Stethoscope, Pill } from 'lucide-react-native';
import StatusBarMock from '../components/StatusBarMock';

const { width } = Dimensions.get('window');

export default function Page01_RoleSelect({ onNavigate, userRole, setUserRole }) {
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const [selectedRole, setSelectedRole] = useState(userRole || 'Please Select');

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setUserRole(role);
  };

  const handleEnter = () => {
    if (selectedRole === 'Patient') {
      onNavigate('Page02_Welcome', { role: 'Patient' });
    } else if (selectedRole === 'Doctor') {
      onNavigate('Page02_Welcome', { role: 'Doctor' });
    } else {
      // Default fallback
      onNavigate('Page02_Welcome', { role: 'Patient' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarMock />

      {/* Decorative Background Elements */}
      <View style={styles.backgroundDecoration}>
        <View style={[styles.pillTopLeft, { transform: [{ rotate: '45deg' }] }]}>
          <Pill size={24} color="#CBD5E1" opacity={0.6} />
        </View>
        <View style={styles.pillTopRight}>
          <Pill size={32} color="#CBD5E1" opacity={0.6} />
          <Pill size={28} color="#CBD5E1" opacity={0.4} style={{ marginTop: 8 }} />
        </View>
        
        {/* Large Stethoscope graphic bottom */}
        <View style={styles.stethoscopeContainer}>
          <Stethoscope size={280} color="#CBD5E1" opacity={0.5} strokeWidth={1.2} />
        </View>
      </View>

      <View style={styles.content}>
        {/* Logo and Title */}
        <View style={styles.logoSection}>
          <Image
            source={require('../../assets/logo_eye.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Healthcare</Text>
          <Text style={styles.appSubname}>Medical app</Text>
        </View>

        {/* SELECT Label */}
        <Text style={styles.selectHeader}>SELECT</Text>

        {/* Role Picker Card */}
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            style={styles.pickerHeader}
            onPress={() => setDropdownOpen(!dropdownOpen)}
            activeOpacity={0.8}
          >
            <Text style={styles.pickerHeaderText}>{selectedRole}</Text>
            <ChevronDown size={22} color="#FFFFFF" />
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.optionsList}>
              <TouchableOpacity
                style={[
                  styles.optionItem,
                  selectedRole === 'Patient' && styles.optionSelected,
                ]}
                onPress={() => handleSelectRole('Patient')}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedRole === 'Patient' && styles.optionTextSelected,
                  ]}
                >
                  Patient
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionItem,
                  selectedRole === 'Doctor' && styles.optionSelected,
                ]}
                onPress={() => handleSelectRole('Doctor')}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedRole === 'Doctor' && styles.optionTextSelected,
                  ]}
                >
                  Doctor
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ENTER Button */}
        <TouchableOpacity
          style={styles.enterButton}
          onPress={handleEnter}
          activeOpacity={0.85}
        >
          <Text style={styles.enterButtonText}>ENTER</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF3FC',
  },
  backgroundDecoration: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  pillTopLeft: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  pillTopRight: {
    position: 'absolute',
    top: 60,
    right: 20,
    alignItems: 'center',
  },
  stethoscopeContainer: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    transform: [{ rotate: '-15deg' }],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 40,
    zIndex: 10,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 140,
    height: 110,
    marginBottom: 10,
  },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1E3A8A',
    letterSpacing: -0.5,
  },
  appSubname: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
    marginTop: 2,
  },
  selectHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  pickerContainer: {
    width: '100%',
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  pickerHeader: {
    backgroundColor: '#6095E6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pickerHeaderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  optionsList: {
    backgroundColor: '#D1D5DB',
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#9CA3AF',
  },
  optionSelected: {
    backgroundColor: '#9CA3AF',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  optionTextSelected: {
    color: '#111827',
    fontWeight: '700',
  },
  enterButton: {
    backgroundColor: '#6095E6',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#4C84E6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
