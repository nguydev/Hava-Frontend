import { ReactElement, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControlProps,
  ScrollView,
  View,
} from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/utils';

import { AppBackground } from './AppBackground';

export interface ScreenContainerProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  className?: string;
  contentClassName?: string;
  footer?: ReactNode;
  keyboardAvoiding?: boolean;
  keyboardVerticalOffset?: number;
  /** Set false to skip the brand gradient backdrop (e.g. inside another gradient). */
  background?: boolean;
  refreshControl?: ReactElement<RefreshControlProps>;
  testID?: string;
}

/**
 * Base screen wrapper: safe-area aware, dark background, optional scroll,
 * keyboard avoidance, and a sticky footer slot.
 */
export function ScreenContainer({
  children,
  scroll = false,
  padded = true,
  edges = ['top'],
  className,
  contentClassName,
  footer,
  keyboardAvoiding = false,
  keyboardVerticalOffset,
  background = true,
  refreshControl,
  testID,
}: ScreenContainerProps) {
  const pad = padded ? 'px-5' : '';

  const body = scroll ? (
    <ScrollView
      testID={testID}
      className={cn('flex-1', pad)}
      contentContainerClassName={cn('pb-24', contentClassName)}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  ) : (
    <View testID={testID} className={cn('flex-1', pad, contentClassName)}>
      {children}
    </View>
  );

  const content = (
    <>
      {body}
      {footer ? (
        <View className="border-t border-hair bg-surface px-5 pt-3 pb-1">{footer}</View>
      ) : null}
    </>
  );

  return (
    <SafeAreaView edges={edges} className={cn('flex-1 bg-transparent', className)}>
      {background ? <AppBackground /> : null}
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={keyboardVerticalOffset ?? 0}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
