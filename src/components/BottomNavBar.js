import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Activity, User } from 'lucide-react-native';

export default function BottomNavBar({ activeTab = 'Home', onTabSelect }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabSelect && onTabSelect('Home')}
        activeOpacity={0.7}
      >
        <Home
          size={24}
          color={activeTab === 'Home' ? '#4C84E6' : '#94A3B8'}
          strokeWidth={activeTab === 'Home' ? 2.5 : 1.8}
        />
        <Text style={[styles.tabLabel, activeTab === 'Home' && styles.activeTabLabel]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabSelect && onTabSelect('Reports')}
        activeOpacity={0.7}
      >
        <Activity
          size={24}
          color={activeTab === 'Reports' ? '#4C84E6' : '#94A3B8'}
          strokeWidth={activeTab === 'Reports' ? 2.5 : 1.8}
        />
        <Text style={[styles.tabLabel, activeTab === 'Reports' && styles.activeTabLabel]}>
          Reports
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabSelect && onTabSelect('Profile')}
        activeOpacity={0.7}
      >
        <User
          size={24}
          color={activeTab === 'Profile' ? '#4C84E6' : '#94A3B8'}
          strokeWidth={activeTab === 'Profile' ? 2.5 : 1.8}
        />
        <Text style={[styles.tabLabel, activeTab === 'Profile' && styles.activeTabLabel]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#4C84E6',
    fontWeight: '700',
  },
});
