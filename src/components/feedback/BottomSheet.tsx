import { ReactNode, useEffect } from 'react';
import { Modal, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function BottomSheet({ visible, onClose, title, children }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (visible) translateY.value = 0;
  }, [visible, translateY]);

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (e.translationY > 110) {
        runOnJS(onClose)();
      }
      translateY.value = withTiming(0, { duration: 160 });
    });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View className="flex-1 justify-end">
        <AnimatedPressable
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(180)}
          onPress={onClose}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.overlay }}
        />
        <GestureDetector gesture={pan}>
          <Animated.View
            entering={SlideInDown.duration(260)}
            exiting={SlideOutDown.duration(200)}
            style={[
              sheetStyle,
              {
                paddingBottom: insets.bottom + 14,
                backgroundColor: colors.surface,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                borderTopWidth: 1,
                borderTopColor: colors.hair,
                paddingHorizontal: 20,
                paddingTop: 12,
              },
            ]}
          >
            <View className="self-center w-10 h-1.5 rounded-full bg-hair mb-4" />
            {title ? <Text className="text-ink-0 text-lg font-bold mb-3">{title}</Text> : null}
            <ScrollView
              style={{ maxHeight: height * 0.6 }}
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={{ paddingBottom: 4 }}
            >
              {children}
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

/** A single selectable row for use inside a BottomSheet. */
export function SheetOption({
  label,
  description,
  selected,
  onPress,
}: {
  label: string;
  description?: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-3.5 border-b border-hair"
    >
      <View className="flex-1">
        <Text className="text-ink-0 text-[15px] font-medium">{label}</Text>
        {description ? <Text className="text-ink-2 text-[13px] mt-0.5">{description}</Text> : null}
      </View>
      <View
        className="w-5 h-5 rounded-full border-2 items-center justify-center"
        style={{ borderColor: selected ? colors.heat : colors.hair }}
      >
        {selected ? <View className="w-2.5 h-2.5 rounded-full bg-heat" /> : null}
      </View>
    </Pressable>
  );
}
