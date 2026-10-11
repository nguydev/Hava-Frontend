import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppBackground, Avatar, BottomSheet, SheetOption } from '@/components';
import { APP } from '@/constants';
import { useSendSupportMessage } from '@/services/mutations';
import { useSupportThread } from '@/services/queries';
import { toast } from '@/store/zustand';
import { colors } from '@/theme';
import type { ChatAgent, ChatMessage } from '@/types';
import { withAlpha } from '@/utils';

const QUICK_REPLIES = [
  'Track my delivery',
  'Request a quote',
  'Billing question',
  'Talk to a specialist',
];

const DEFAULT_AGENT: ChatAgent = {
  name: 'GOODR Support',
  title: 'Support Specialist',
  online: true,
};

function clock(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/* ------------------------------ typing dots ------------------------------- */

function Dot({ delay }: { delay: number }) {
  const v = useSharedValue(0.3);
  useEffect(() => {
    v.value = withRepeat(withTiming(1, { duration: 500 }), -1, true);
  }, [v]);
  const style = useAnimatedStyle(() => ({ opacity: v.value }));
  return (
    <Animated.View
      style={[
        { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.ink2, marginHorizontal: 2 },
        style,
      ]}
    />
  );
}

function TypingBubble() {
  return (
    <Animated.View entering={FadeIn} className="self-start mb-2.5">
      <View
        className="flex-row items-center rounded-2xl rounded-bl-md px-4 py-3 bg-card border border-hair"
      >
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </View>
    </Animated.View>
  );
}

/* -------------------------------- bubbles --------------------------------- */

function Bubble({ msg }: { msg: ChatMessage }) {
  if (msg.sender === 'system') {
    return (
      <View className="items-center my-2">
        <View className="rounded-pill bg-card-2 px-3 py-1">
          <Text className="text-ink-3 text-[11px]">{msg.text}</Text>
        </View>
      </View>
    );
  }

  const isUser = msg.sender === 'user';
  return (
    <View
      className={isUser ? 'self-end items-end mb-2.5' : 'self-start items-start mb-2.5'}
      style={{ maxWidth: '82%' }}
    >
      <View
        className={
          isUser
            ? 'rounded-2xl rounded-br-md px-4 py-2.5'
            : 'rounded-2xl rounded-bl-md px-4 py-2.5 bg-card border border-hair'
        }
        style={isUser ? { backgroundColor: colors.brandBlue } : undefined}
      >
        <Text
          className={isUser ? 'text-white text-[14px] leading-5' : 'text-ink-0 text-[14px] leading-5'}
        >
          {msg.text}
        </Text>
      </View>
      <View className="flex-row items-center mt-1 px-1">
        <Text className="text-ink-3 text-[10px]">{clock(msg.at)}</Text>
        {isUser ? (
          <MaterialCommunityIcons
            name="check-all"
            size={12}
            color={colors.brandCyan}
            style={{ marginLeft: 3 }}
          />
        ) : null}
      </View>
    </View>
  );
}

/* --------------------------------- screen --------------------------------- */

export function ChatView() {
  const { data: thread, refetch } = useSupportThread();
  const { mutate: sendMessage, isPending: agentTyping } = useSendSupportMessage();
  const messages = thread?.messages ?? [];
  const agent = thread?.agent ?? DEFAULT_AGENT;
  const [text, setText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(t);
  }, [messages.length, agentTyping]);

  const send = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    sendMessage(clean);
  };

  const submit = () => {
    if (!text.trim()) return;
    send(text);
    setText('');
  };

  const showQuick = messages.filter((m) => m.sender === 'user').length === 0;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      {/* Header */}
      <View className="flex-row items-center px-4 pt-1 pb-3 border-b border-hair">
        <Pressable onPress={() => router.back()} hitSlop={10} className="w-9 h-9 -ml-1 items-center justify-center">
          <MaterialCommunityIcons name="chevron-left" size={30} color={colors.brandBlue} />
        </Pressable>
        <View className="ml-1">
          <Avatar name={agent.name} size={40} />
          {agent.online ? (
            <View
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
              style={{ backgroundColor: colors.ok, borderColor: colors.bg }}
            />
          ) : null}
        </View>
        <View className="flex-1 ml-3">
          <Text className="text-ink-0 text-[15px] font-bold">{agent.name}</Text>
          <View className="flex-row items-center">
            <View
              style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: agent.online ? colors.ok : colors.ink3, marginRight: 5 }}
            />
            <Text className="text-ink-2 text-[12px]">
              {agentTyping ? 'typing…' : agent.online ? 'Online · replies in ~1 min' : 'Offline'}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => setMenuOpen(true)}
          hitSlop={8}
          accessibilityLabel="Support options"
          className="w-9 h-9 rounded-xl items-center justify-center"
          style={{ backgroundColor: withAlpha(colors.brandCyan, 0.14) }}
        >
          <MaterialCommunityIcons name="headset" size={18} color={colors.brandCyan} />
        </Pressable>
      </View>

      <BottomSheet visible={menuOpen} onClose={() => setMenuOpen(false)} title="Support options">
        <SheetOption
          label="Call support"
          description={APP.supportPhone}
          onPress={() => {
            setMenuOpen(false);
            Linking.openURL(`tel:${APP.supportPhone.replace(/[^0-9]/g, '')}`);
          }}
        />
        <SheetOption
          label="Email support"
          description={APP.supportEmail}
          onPress={() => {
            setMenuOpen(false);
            Linking.openURL(`mailto:${APP.supportEmail}`);
          }}
        />
        <SheetOption
          label="Refresh conversation"
          description="Reload the latest messages"
          onPress={() => {
            setMenuOpen(false);
            refetch();
            toast.success('Conversation refreshed.');
          }}
        />
      </BottomSheet>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m) => (
            <Bubble key={m.id} msg={m} />
          ))}
          {agentTyping ? <TypingBubble /> : null}
        </ScrollView>

        {/* Quick replies — fixed-height row so the horizontal list doesn't
            expand vertically and stretch the pills. */}
        {showQuick ? (
          <View style={{ height: 52 }} className="pb-2">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingHorizontal: 16, alignItems: 'center' }}
            >
              {QUICK_REPLIES.map((q) => (
                <Pressable
                  key={q}
                  onPress={() => send(q)}
                  className="rounded-pill border border-hair px-3.5 py-2 self-center"
                  style={{ backgroundColor: withAlpha(colors.brandBlue, 0.08) }}
                >
                  <Text className="text-heat text-[13px] font-semibold">{q}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Composer */}
        <View className="flex-row items-end px-4 pt-2 pb-3 border-t border-hair bg-surface">
          <View className="flex-1 flex-row items-center rounded-3xl bg-card border border-hair px-4 min-h-[46px]">
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a message…"
              placeholderTextColor={colors.ink3}
              className="flex-1 text-ink-0 text-[15px]"
              style={{ paddingVertical: 10, maxHeight: 110 }}
              multiline
              onSubmitEditing={submit}
            />
          </View>
          <Pressable
            onPress={submit}
            disabled={!text.trim()}
            className="w-12 h-12 rounded-full items-center justify-center ml-2"
            style={{
              backgroundColor: text.trim() ? colors.brandBlue : colors.card2,
              shadowColor: colors.brandBlue,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: text.trim() ? 0.4 : 0,
              shadowRadius: 10,
              elevation: text.trim() ? 6 : 0,
            }}
          >
            <MaterialCommunityIcons
              name="send"
              size={20}
              color={text.trim() ? colors.white : colors.ink3}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
