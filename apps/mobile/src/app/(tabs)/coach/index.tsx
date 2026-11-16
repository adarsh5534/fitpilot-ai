import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { useAuthStore } from '@/stores/auth.store';

const C = Colors.dark;

const QUICK_PROMPTS = [
  "Optimize today's workout",
  "What should I eat before?",
  "How's my progress?",
];

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  planCard?: {
    title: string;
    meta: string;
  };
}

export default function CoachScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);

  const userName = profile?.display_name || user?.email?.split('@')[0] || 'Alex';

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Good morning, ${userName}. You're well recovered today — your sleep score is 84 and soreness is low.\n\nYou're scheduled for Chest & Triceps. Want me to adjust anything before you train?`,
      time: '8:32 AM',
    },
    {
      id: '2',
      sender: 'user',
      text: 'What weight should I use for bench press?',
      time: '8:33 AM',
    },
    {
      id: '3',
      sender: 'ai',
      text: "Based on last week's 77.5 kg × 8 and today's readiness, start at 80 kg for 6–8 reps.\n\nIf set one feels above RPE 8, drop to 77.5 kg. I'll adapt the next sets with you.",
      time: '8:34 AM',
      planCard: {
        title: 'Bench Press · 80 kg',
        meta: '4 sets × 6–8 reps · 2 min rest',
      },
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    // Simulated AI response (Phase 5 will connect directly to OpenAI API endpoint)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: `Got it! For "${text}", I've analyzed your current volume and recovery. Keep your rest periods at 90s and maintain strict form on eccentric phases.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 800);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Coach Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Icon name="back" size={20} color="#DFE3DD" />
          </TouchableOpacity>

          <View style={styles.headerTitleCenter}>
            <View style={styles.aiMarkSmall}>
              <Icon name="spark" size={16} color="#101210" />
            </View>
            <View>
              <Text style={styles.headerTitle}>FitPilot AI</Text>
              <View style={styles.statusRow}>
                <View style={styles.greenDot} />
                <Text style={styles.statusText}>Online · Knows your plan</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Icon name="more" size={20} color="#DFE3DD" />
          </TouchableOpacity>
        </View>

        {/* Message Thread */}
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.chatDate}>TODAY, 8:32 AM</Text>

            {messages.map((m) => {
              if (m.sender === 'user') {
                return (
                  <View key={m.id} style={styles.userBubble}>
                    <Text style={styles.userBubbleText}>{m.text}</Text>
                  </View>
                );
              }

              return (
                <View key={m.id} style={styles.aiBubbleRow}>
                  <View style={styles.aiAvatar}>
                    <Icon name="spark" size={15} color="#101210" />
                  </View>
                  <View style={styles.aiBubble}>
                    <Text style={styles.aiBubbleText}>{m.text}</Text>

                    {m.planCard ? (
                      <View style={styles.coachPlanCard}>
                        <View style={styles.planCardIcon}>
                          <Icon name="workouts" size={18} color={C.accent} />
                        </View>
                        <View style={styles.planCardInfo}>
                          <Text style={styles.planCardKicker}>RECOMMENDED</Text>
                          <Text style={styles.planCardTitle}>{m.planCard.title}</Text>
                          <Text style={styles.planCardMeta}>{m.planCard.meta}</Text>
                        </View>
                      </View>
                    ) : null}

                    <Text style={styles.bubbleTime}>{m.time}</Text>
                  </View>
                </View>
              );
            })}

            {/* Quick Prompts */}
            <View style={styles.quickPrompts}>
              {QUICK_PROMPTS.map((prompt) => (
                <TouchableOpacity
                  key={prompt}
                  style={styles.promptChip}
                  onPress={() => handleSend(prompt)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.promptChipText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Chat Input Bar */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachmentBtn} activeOpacity={0.7}>
              <Icon name="plus" size={18} color="#777F78" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Ask your coach anything..."
              placeholderTextColor="#777F78"
              value={inputMessage}
              onChangeText={setInputMessage}
              onSubmitEditing={() => handleSend()}
            />

            <TouchableOpacity
              style={styles.sendBtn}
              onPress={() => handleSend()}
              activeOpacity={0.8}
            >
              <Icon name="send" size={18} color="#101210" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.background,
  },
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1D1B',
    borderWidth: 1,
    borderColor: C.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiMarkSmall: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: C.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.accent,
  },
  statusText: {
    fontSize: 10,
    color: '#8A918B',
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 14,
  },
  chatDate: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: '#6F766F',
    letterSpacing: 1,
    marginVertical: 4,
  },
  aiBubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    maxWidth: '90%',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  aiBubble: {
    backgroundColor: '#191C1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.075)',
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  aiBubbleText: {
    color: C.text,
    fontSize: 13,
    lineHeight: 19,
  },
  coachPlanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#202521',
    borderWidth: 1,
    borderColor: 'rgba(184, 243, 74, 0.2)',
    borderRadius: 14,
    padding: 12,
    marginVertical: 4,
  },
  planCardIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#282F2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planCardInfo: {
    flex: 1,
  },
  planCardKicker: {
    fontSize: 8,
    fontWeight: FontWeight.bold,
    color: C.accent,
    letterSpacing: 1,
  },
  planCardTitle: {
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: C.text,
    marginTop: 1,
  },
  planCardMeta: {
    fontSize: 10,
    color: '#8A918B',
    marginTop: 1,
  },
  bubbleTime: {
    fontSize: 9,
    color: '#6F766F',
    alignSelf: 'flex-end',
  },
  userBubble: {
    backgroundColor: '#242A25',
    borderWidth: 1,
    borderColor: 'rgba(184, 243, 74, 0.15)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '85%',
    alignSelf: 'flex-end',
  },
  userBubbleText: {
    color: C.text,
    fontSize: 13,
    lineHeight: 18,
  },
  quickPrompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  promptChip: {
    backgroundColor: '#191C1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.075)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  promptChipText: {
    color: '#8F9690',
    fontSize: 11,
    fontWeight: FontWeight.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191C1A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.075)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  attachmentBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#242824',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#242824',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    color: C.text,
    fontSize: 13,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
