import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { User, Edit3, LogOut, ChevronRight } from 'lucide-react-native';
import StatusBarMock from '../components/StatusBarMock';
import BottomNavBar from '../components/BottomNavBar';

export default function Page14_Profile({ onNavigate }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBarMock />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Avatar with Edit Badge */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <User size={54} color="#D97706" />
            <TouchableOpacity style={styles.avatarEditBadge}>
              <Edit3 size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>K.K.Priyadarshana</Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <TouchableOpacity style={styles.cardEditIcon}>
            <Edit3 size={18} color="#1E293B" />
          </TouchableOpacity>

          <View style={styles.infoLine}>
            <Text style={styles.infoText}>Name : K.K.Priyadarshana</Text>
          </View>

          <View style={styles.infoLine}>
            <Text style={styles.infoText}>Email : Priyadarshana@gmail.com</Text>
          </View>

          <View style={styles.infoLine}>
            <Text style={styles.infoText}>Age : 49</Text>
          </View>

          <View style={styles.infoLine}>
            <Text style={styles.infoText}>Gender : Male</Text>
          </View>

          <View style={styles.infoLine}>
            <Text style={styles.infoText}>Date : Aug 11, 2026</Text>
          </View>
        </View>

        {/* Logout Option Row */}
        <TouchableOpacity
          style={styles.logoutRow}
          onPress={() => onNavigate('Page01_RoleSelect')}
          activeOpacity={0.8}
        >
          <View style={styles.logoutIconCircle}>
            <LogOut size={20} color="#3B82F6" />
          </View>
          <Text style={styles.logoutText}>Logout</Text>
          <ChevronRight size={22} color="#64748B" />
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation (Profile Active) */}
      <BottomNavBar
        activeTab="Profile"
        onTabSelect={(tab) => {
          if (tab === 'Home') onNavigate('Page05_PatientHome');
          if (tab === 'Reports') onNavigate('Page09_ReportsList');
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
    paddingTop: 30,
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FED7AA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#475569',
    position: 'relative',
    marginBottom: 12,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#EAEFFE',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 120,
    position: 'relative',
  },
  cardEditIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  infoLine: {
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  logoutRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EAEFFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoutText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
});
