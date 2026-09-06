import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import {
  Send,
  Bot,
  User,
} from 'lucide-react-native';

import StatusBarMock from '../components/StatusBarMock';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';

import API_URL from '../config/api';


// =================================================
// Page 13 - Eagle Vision Bot
// =================================================

export default function Page13_EagleVisionBot({
  onNavigate,
}) {

  // =================================================
  // Messages
  // =================================================

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text:
        'Hello! I am Eagle Vision Bot. How can I assist you with your eye health today?',
      time: getCurrentTime(),
    },
  ]);


  // =================================================
  // Input
  // =================================================

  const [inputMessage, setInputMessage] =
    useState('');


  // =================================================
  // Loading
  // =================================================

  const [loading, setLoading] =
    useState(false);


  // =================================================
  // Get Current Time
  // =================================================

  function getCurrentTime() {

    return new Date().toLocaleTimeString(
      [],
      {
        hour: 'numeric',
        minute: '2-digit',
      }
    );

  }


  // =================================================
  // Send Message
  // =================================================

  const handleSend = async () => {

    // -------------------------------------------------
    // Prevent Empty Message
    // -------------------------------------------------

    if (
      !inputMessage.trim() ||
      loading
    ) {
      return;
    }


    // -------------------------------------------------
    // User Message
    // -------------------------------------------------

    const userText =
      inputMessage.trim();


    const userMsg = {

      id:
        Date.now().toString(),

      sender:
        'user',

      text:
        userText,

      time:
        getCurrentTime(),

    };


    // -------------------------------------------------
    // Add User Message
    // -------------------------------------------------

    setMessages(
      (previousMessages) => [
        ...previousMessages,
        userMsg,
      ]
    );


    // -------------------------------------------------
    // Clear Input
    // -------------------------------------------------

    setInputMessage('');


    // -------------------------------------------------
    // Start Loading
    // -------------------------------------------------

    setLoading(true);


    try {

      console.log(
        '================================='
      );

      console.log(
        'EAGLE VISION BOT REQUEST'
      );

      console.log(
        'Message:',
        userText
      );

      console.log(
        'API:',
        `${API_URL}/api/bot/chat`
      );

      console.log(
        '================================='
      );


      // =================================================
      // Send To Backend
      // =================================================

      const response =
        await fetch(
          `${API_URL}/api/bot/chat`,
          {

            method:
              'POST',

            headers: {

              'Content-Type':
                'application/json',

            },

            body:
              JSON.stringify({

                message:
                  userText,

              }),

          }
        );


      // =================================================
      // Read Response
      // =================================================

      const data =
        await response.json();


      console.log(
        'Bot API Response:',
        data
      );


      // =================================================
      // Backend Error
      // =================================================

      if (!response.ok) {

        throw new Error(
          data?.message ||
          'Unable to get chatbot response.'
        );

      }


      // =================================================
      // Bot Reply
      // =================================================

      const botText =
        data?.reply ||
        'Sorry, I could not generate a response. Please try again.';


      const botMsg = {

        id:
          `${Date.now()}-bot`,

        sender:
          'bot',

        text:
          botText,

        time:
          getCurrentTime(),

      };


      // =================================================
      // Add Bot Message
      // =================================================

      setMessages(
        (previousMessages) => [
          ...previousMessages,
          botMsg,
        ]
      );


    } catch (error) {

      console.error(
        '❌ Eagle Vision Bot Error:',
        error
      );


      // =================================================
      // Error Message
      // =================================================

      const errorMsg = {

        id:
          `${Date.now()}-error`,

        sender:
          'bot',

        text:
          'Sorry, I am unable to connect to Eagle Vision Bot right now. Please make sure the backend server is running and try again.',

        time:
          getCurrentTime(),

      };


      setMessages(
        (previousMessages) => [
          ...previousMessages,
          errorMsg,
        ]
      );


    } finally {

      setLoading(false);

    }

  };


  // =================================================
  // Render
  // =================================================

  return (

    <SafeAreaView
      style={
        styles.container
      }
    >

      <StatusBarMock />


      {/* =================================================
          Header
      ================================================= */}

      <Header

        title="Eagle Vision Bot"

        onBack={() =>
          onNavigate(
            'Page05_PatientHome'
          )
        }

      />


      {/* =================================================
          Keyboard Area
      ================================================= */}

      <KeyboardAvoidingView

        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }

        style={
          styles.keyboardAvoid
        }

      >

        {/* =================================================
            Chat Messages
        ================================================= */}

        <ScrollView

          contentContainerStyle={
            styles.chatContent
          }

          showsVerticalScrollIndicator={
            false
          }

          keyboardShouldPersistTaps="handled"

        >

          {messages.map(
            (msg) => (

              <View

                key={
                  msg.id
                }

                style={[

                  styles.messageRow,

                  msg.sender === 'user'
                    ? styles.userRow
                    : styles.botRow,

                ]}

              >

                {/* =================================================
                    Bot Avatar
                ================================================= */}

                {msg.sender === 'bot' && (

                  <View
                    style={
                      styles.botAvatar
                    }
                  >

                    <Bot
                      size={18}
                      color="#FFFFFF"
                    />

                  </View>

                )}


                {/* =================================================
                    Message Bubble
                ================================================= */}

                <View

                  style={[

                    styles.messageBubble,

                    msg.sender === 'user'
                      ? styles.userBubble
                      : styles.botBubble,

                  ]}

                >

                  <Text

                    style={[

                      styles.messageText,

                      msg.sender === 'user'
                        ? styles.userText
                        : styles.botText,

                    ]}

                  >

                    {
                      msg.text
                    }

                  </Text>


                  <Text
                    style={
                      styles.timeText
                    }
                  >

                    {
                      msg.time
                    }

                  </Text>

                </View>


                {/* =================================================
                    User Avatar
                ================================================= */}

                {msg.sender === 'user' && (

                  <View
                    style={
                      styles.userAvatar
                    }
                  >

                    <User
                      size={18}
                      color="#FFFFFF"
                    />

                  </View>

                )}

              </View>

            )
          )}


          {/* =================================================
              AI Thinking Indicator
          ================================================= */}

          {loading && (

            <View
              style={
                styles.messageRow
              }
            >

              <View
                style={
                  styles.botAvatar
                }
              >

                <Bot
                  size={18}
                  color="#FFFFFF"
                />

              </View>


              <View
                style={
                  styles.typingBubble
                }
              >

                <ActivityIndicator
                  size="small"
                  color="#5B92E5"
                />

                <Text
                  style={
                    styles.typingText
                  }
                >
                  Eagle Vision Bot is thinking...
                </Text>

              </View>

            </View>

          )}

        </ScrollView>


        {/* =================================================
            Input Bar
        ================================================= */}

        <View
          style={
            styles.inputBar
          }
        >

          <TextInput

            style={
              styles.textInput
            }

            placeholder="Type your message..."

            placeholderTextColor="#94A3B8"

            value={
              inputMessage
            }

            onChangeText={
              setInputMessage
            }

            onSubmitEditing={
              handleSend
            }

            editable={
              !loading
            }

            multiline

          />


          <TouchableOpacity

            style={[

              styles.sendButton,

              loading &&
                styles.disabledSendButton,

            ]}

            onPress={
              handleSend
            }

            disabled={
              loading
            }

            activeOpacity={
              0.85
            }

          >

            {loading ? (

              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />

            ) : (

              <Send
                size={18}
                color="#FFFFFF"
              />

            )}

          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>


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

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor:
      '#FFFFFF',

  },


  keyboardAvoid: {

    flex: 1,

  },


  chatContent: {

    paddingHorizontal: 16,

    paddingTop: 16,

    paddingBottom: 20,

  },


  // =================================================
  // Message Row
  // =================================================

  messageRow: {

    flexDirection:
      'row',

    marginBottom: 16,

    alignItems:
      'flex-end',

  },


  botRow: {

    justifyContent:
      'flex-start',

  },


  userRow: {

    justifyContent:
      'flex-end',

  },


  // =================================================
  // Bot Avatar
  // =================================================

  botAvatar: {

    width: 32,

    height: 32,

    borderRadius: 16,

    backgroundColor:
      '#5B92E5',

    justifyContent:
      'center',

    alignItems:
      'center',

    marginRight: 8,

  },


  // =================================================
  // User Avatar
  // =================================================

  userAvatar: {

    width: 32,

    height: 32,

    borderRadius: 16,

    backgroundColor:
      '#0F172A',

    justifyContent:
      'center',

    alignItems:
      'center',

    marginLeft: 8,

  },


  // =================================================
  // Message Bubble
  // =================================================

  messageBubble: {

    maxWidth:
      '75%',

    borderRadius:
      16,

    paddingHorizontal:
      16,

    paddingVertical:
      10,

  },


  botBubble: {

    backgroundColor:
      '#EAEFFE',

    borderBottomLeftRadius:
      4,

  },


  userBubble: {

    backgroundColor:
      '#5B92E5',

    borderBottomRightRadius:
      4,

  },


  // =================================================
  // Message Text
  // =================================================

  messageText: {

    fontSize:
      14,

    lineHeight:
      20,

  },


  botText: {

    color:
      '#0F172A',

  },


  userText: {

    color:
      '#FFFFFF',

  },


  // =================================================
  // Time
  // =================================================

  timeText: {

    fontSize:
      10,

    color:
      '#94A3B8',

    marginTop:
      4,

    alignSelf:
      'flex-end',

  },


  // =================================================
  // Typing Indicator
  // =================================================

  typingBubble: {

    flexDirection:
      'row',

    alignItems:
      'center',

    backgroundColor:
      '#EAEFFE',

    borderRadius:
      16,

    borderBottomLeftRadius:
      4,

    paddingHorizontal:
      14,

    paddingVertical:
      10,

  },


  typingText: {

    marginLeft:
      8,

    fontSize:
      12,

    color:
      '#64748B',

  },


  // =================================================
  // Input Bar
  // =================================================

  inputBar: {

    flexDirection:
      'row',

    alignItems:
      'center',

    paddingHorizontal:
      16,

    paddingVertical:
      10,

    borderTopWidth:
      1,

    borderTopColor:
      '#F1F5F9',

    backgroundColor:
      '#FFFFFF',

  },


  // =================================================
  // Text Input
  // =================================================

  textInput: {

    flex: 1,

    minHeight:
      44,

    maxHeight:
      100,

    backgroundColor:
      '#F8FAFC',

    borderRadius:
      22,

    paddingHorizontal:
      18,

    paddingVertical:
      10,

    fontSize:
      14,

    color:
      '#1E293B',

    marginRight:
      10,

  },


  // =================================================
  // Send Button
  // =================================================

  sendButton: {

    width:
      44,

    height:
      44,

    borderRadius:
      22,

    backgroundColor:
      '#5B92E5',

    justifyContent:
      'center',

    alignItems:
      'center',

  },


  disabledSendButton: {

    opacity:
      0.6,

  },

});