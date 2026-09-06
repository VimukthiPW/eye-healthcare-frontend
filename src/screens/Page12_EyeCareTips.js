import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import {
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

import StatusBarMock from '../components/StatusBarMock';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';


// =================================================
// Eye Care Tips Data
// =================================================

const tipsData = [

  {
    id: '1',

    title:
      'Digital Eye Strain Prevention',

    detail:
      'Follow the 20-20-20 rule: Every 20 minutes, look at something about 20 feet away for at least 20 seconds. Remember to blink regularly and take short breaks during long screen sessions.',
  },


  {
    id: '2',

    title:
      'Healthy Diet for Vision',

    detail:
      'Include a balanced diet with leafy green vegetables, colorful fruits, eggs, fish, nuts, and other nutrient-rich foods. Vitamins and nutrients such as Vitamin C, Vitamin E, Zinc, Lutein, and Omega-3 can support overall eye health.',
  },


  {
    id: '3',

    title:
      'Environmental Protection',

    detail:
      'Wear sunglasses that provide UV protection when spending time outdoors. Avoid excessive exposure to dust, smoke, and strong wind. Keep indoor air comfortable to reduce eye dryness.',
  },


  {
    id: '4',

    title:
      'Eye Hygiene',

    detail:
      'Wash your hands before touching your eyes. Keep towels and personal eye-care products clean and avoid sharing them with others. Keep your surroundings clean to reduce irritation and infection risks.',
  },


  {
    id: '5',

    title:
      'Regular Eye Checkups',

    detail:
      'Regular eye examinations can help detect vision problems and some eye conditions early. Follow the examination schedule recommended by your eye-care professional, especially if you notice changes in your vision.',
  },


  {
    id: '6',

    title:
      'Proper Screen Distance',

    detail:
      'Keep your computer or monitor at a comfortable viewing distance and position the screen slightly below eye level. Adjust text size and screen brightness so you can read comfortably without unnecessary eye strain.',
  },


  {
    id: '7',

    title:
      'Get Enough Sleep',

    detail:
      'Getting enough quality sleep gives your eyes time to rest and recover. Try to maintain a regular sleep schedule and avoid prolonged screen use immediately before bedtime.',
  },


  {
    id: '8',

    title:
      'Contact Lens Safety',

    detail:
      'Always wash and dry your hands before handling contact lenses. Follow the cleaning, storage, and replacement instructions provided by your eye-care professional. Never share contact lenses with another person.',
  },


  {
    id: '9',

    title:
      'Avoid Rubbing Your Eyes',

    detail:
      'Avoid rubbing your eyes, especially with unwashed hands. If your eyes feel irritated or something gets into your eye, gently rinse with clean water instead of repeatedly rubbing them.',
  },


  {
    id: '10',

    title:
      'Protect Your Eyes from Injury',

    detail:
      'Use appropriate protective eyewear during activities where dust, particles, chemicals, or other hazards could reach your eyes. Take extra care during sports, laboratory work, and DIY activities.',
  },

];


// =================================================
// Page 12 - Eye Care Tips
// =================================================

export default function Page12_EyeCareTips({
  onNavigate,
}) {

  // =================================================
  // Expanded Tip
  // =================================================

  const [expandedId, setExpandedId] =
    useState(null);


  // =================================================
  // Toggle Tip
  // =================================================

  const toggleExpand = (id) => {

    setExpandedId(
      expandedId === id
        ? null
        : id
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

        title="Eye Care Tips"

        onBack={() =>
          onNavigate(
            'Page05_PatientHome'
          )
        }

      />


      {/* =================================================
          Content
      ================================================= */}

      <ScrollView

        contentContainerStyle={
          styles.content
        }

        showsVerticalScrollIndicator={
          false
        }

      >

        {/* =================================================
            Introduction
        ================================================= */}

        <View
          style={
            styles.introCard
          }
        >

          <Text
            style={
              styles.introTitle
            }
          >
            Take Care of Your Eyes 👁️
          </Text>


          <Text
            style={
              styles.introText
            }
          >
            Simple daily habits can help
            protect your vision and maintain
            healthy eyes.
          </Text>

        </View>


        {/* =================================================
            Section Title
        ================================================= */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Eye Care Tips
        </Text>


        {/* =================================================
            Tips
        ================================================= */}

        {tipsData.map((tip) => {

          const isExpanded =
            expandedId === tip.id;


          return (

            <View

              key={
                tip.id
              }

              style={
                styles.tipCardContainer
              }

            >

              {/* =================================================
                  Tip Header
              ================================================= */}

              <TouchableOpacity

                style={[
                  styles.tipCard,

                  isExpanded &&
                    styles.tipCardExpanded,
                ]}

                onPress={() =>
                  toggleExpand(
                    tip.id
                  )
                }

                activeOpacity={
                  0.85
                }

              >

                <Text
                  style={
                    styles.tipTitle
                  }
                >
                  {
                    tip.title
                  }
                </Text>


                <View
                  style={
                    styles.iconContainer
                  }
                >

                  {isExpanded ? (

                    <ChevronUp
                      size={20}
                      color="#1E293B"
                    />

                  ) : (

                    <ChevronDown
                      size={20}
                      color="#1E293B"
                    />

                  )}

                </View>

              </TouchableOpacity>


              {/* =================================================
                  Tip Detail
              ================================================= */}

              {isExpanded && (

                <View
                  style={
                    styles.detailBox
                  }
                >

                  <Text
                    style={
                      styles.detailText
                    }
                  >
                    {
                      tip.detail
                    }
                  </Text>

                </View>

              )}

            </View>

          );

        })}


       

        


      </ScrollView>


      {/* =================================================
          Bottom Navigation
      ================================================= */}

      <BottomNavBar

        activeTab="Home"

        onTabSelect={(tab) => {

          if (
            tab === 'Home'
          ) {

            onNavigate(
              'Page05_PatientHome'
            );

          }


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

    // =================================================
    // Container
    // =================================================

    container: {

      flex: 1,

      backgroundColor:
        '#FFFFFF',

    },


    // =================================================
    // Content
    // =================================================

    content: {

      paddingHorizontal: 20,

      paddingTop: 14,

      paddingBottom: 100,

    },


    // =================================================
    // Introduction
    // =================================================

    introCard: {

      backgroundColor:
        '#EAEFFE',

      borderRadius: 18,

      padding: 18,

      marginBottom: 20,

    },


    introTitle: {

      fontSize: 18,

      fontWeight: '800',

      color:
        '#0F172A',

      marginBottom: 7,

    },


    introText: {

      fontSize: 13,

      color:
        '#475569',

      lineHeight: 20,

    },


    // =================================================
    // Section Title
    // =================================================

    sectionTitle: {

      fontSize: 18,

      fontWeight: '800',

      color:
        '#0F172A',

      marginBottom: 12,

    },


    // =================================================
    // Tip Container
    // =================================================

    tipCardContainer: {

      marginBottom: 12,

    },


    // =================================================
    // Tip Card
    // =================================================

    tipCard: {

      backgroundColor:
        '#EAEFFE',

      borderRadius: 14,

      paddingHorizontal: 18,

      paddingVertical: 17,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

    },


    tipCardExpanded: {

      borderBottomLeftRadius:
        0,

      borderBottomRightRadius:
        0,

    },


    // =================================================
    // Tip Title
    // =================================================

    tipTitle: {

      fontSize: 15,

      fontWeight: '800',

      color:
        '#0F172A',

      flex: 1,

      paddingRight: 10,

    },


    // =================================================
    // Icon
    // =================================================

    iconContainer: {

      width: 30,

      height: 30,

      borderRadius: 15,

      backgroundColor:
        '#FFFFFF',

      justifyContent:
        'center',

      alignItems:
        'center',

    },


    // =================================================
    // Detail Box
    // =================================================

    detailBox: {

      backgroundColor:
        '#F8FAFC',

      borderBottomLeftRadius:
        14,

      borderBottomRightRadius:
        14,

      paddingHorizontal: 18,

      paddingVertical: 16,

      borderWidth: 1,

      borderColor:
        '#EAEFFE',

      borderTopWidth: 0,

    },


    // =================================================
    // Detail Text
    // =================================================

    detailText: {

      fontSize: 13,

      color:
        '#475569',

      lineHeight: 21,

    },


    // =================================================
    // Important Note
    // =================================================

    noteCard: {

      backgroundColor:
        '#F8FAFC',

      borderRadius: 14,

      padding: 16,

      marginTop: 8,

      borderWidth: 1,

      borderColor:
        '#E2E8F0',

    },


    noteTitle: {

      fontSize: 14,

      fontWeight: '800',

      color:
        '#334155',

      marginBottom: 6,

    },


    noteText: {

      fontSize: 12,

      color:
        '#64748B',

      lineHeight: 19,

    },

  });