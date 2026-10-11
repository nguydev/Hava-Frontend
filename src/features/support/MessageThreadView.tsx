import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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

import { AppBackground, Avatar } from '@/components';
import { useSendMessage } from '@/services/mutations';
import { useMessageThread } from '@/services/queries';
import { useChatSocket } from '@/services/socket/socketService';
import { colors } from '@/theme';
import type { DeliveryMessage } from '@/types';
import { withAlpha } from '@/utils';

function clock(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function Bubble({ msg }: { msg: DeliveryMessage }) {
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
        <Text className={isUser ? 'text-white text-[14px] leading-5' : 'text-ink-0 text-[14px] leading-5'}>
          {msg.text}
        </Text>
      </View>
      <Text className="text-ink-3 text-[10px] mt-1 px-1">{clock(msg.at)}</Text>
    </View>
  );
}

export function MessageThreadView() {
  const params = useLocalSearchParams<{ thread?: string; peer?: string; phone?: string; role?: string }>();
  const threadId = params.thread ?? 'thread';
  const peer = params.peer ?? 'Contact';
  const role = params.role ?? 'the recipient';

  const { data: thread } = useMessageThread(threadId, peer);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  const [liveMessages, setLiveMessages] = useState<DeliveryMessage[]>([]);
  const [text, setText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  // Sync initial query thread messages into liveMessages state
  useEffect(() => {
    if (thread?.messages) {
      setLiveMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newFromThread = thread.messages.filter((m) => !existingIds.has(m.id));
        return [...prev, ...newFromThread];
      });
    }
  }, [thread?.messages]);

  // Connect Socket.io real-time chat for driver-contractor messaging
  const { sendRealtimeMessage } = useChatSocket(threadId, (incomingMsg) => {
    setLiveMessages((prev) => {
      if (prev.some((m) => m.id === incomingMsg.id)) return prev;
      return [...prev, incomingMsg];
    });
  });

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(t);
  }, [liveMessages.length]);

  const submit = () => {
    const clean = text.trim();
    if (!clean) return;

    const newMsg: DeliveryMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: clean,
      at: new Date().toISOString(),
    };

    setLiveMessages((prev) => [...prev, newMsg]);
    sendMessage({ threadId, text: clean });
    sendRealtimeMessage({ threadId, text: clean, sender: 'user' });
    setText('');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-transparent">
      <AppBackground />
      <View className="flex-row items-center px-4 pt-1 pb-3 border-b border-hair">
        <Pressable onPress={() => router.back()} hitSlop={10} className="w-9 h-9 -ml-1 items-center justify-center">
          <MaterialCommunityIcons name="chevron-left" size={30} color={colors.brandBlue} />
        </Pressable>
        <Avatar name={peer} size={40} />
        <View className="flex-1 ml-3">
          <Text className="text-ink-0 text-[15px] font-bold">{peer}</Text>
          <Text className="text-ink-2 text-[12px]">{isSending ? 'sending…' : role}</Text>
        </View>
        {params.phone ? (
          <Pressable
            onPress={() => Linking.openURL(`tel:${params.phone!.replace(/[^0-9]/g, '')}`)}
            hitSlop={8}
            className="w-9 h-9 rounded-xl items-center justify-center"
            style={{ backgroundColor: withAlpha(colors.ok, 0.16) }}
          >
            <MaterialCommunityIcons name="phone" size={18} color={colors.ok} />
          </Pressable>
        ) : null}
      </View>

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
          {liveMessages.map((m) => (
            <Bubble key={m.id} msg={m} />
          ))}
        </ScrollView>

        <View className="flex-row items-end px-4 pt-2 pb-3 border-t border-hair bg-surface">
          <View className="flex-1 flex-row items-center rounded-3xl bg-card border border-hair px-4 min-h-[46px]">
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={`Message ${peer.split(' ')[0]}…`}
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
            style={{ backgroundColor: text.trim() ? colors.brandBlue : colors.card2 }}
          >
            <MaterialCommunityIcons name="send" size={20} color={text.trim() ? colors.white : colors.ink3} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
