/* eslint-disable @typescript-eslint/no-var-requires */
import '@testing-library/react-native/extend-expect';

// --- react-native-reanimated -------------------------------------------------
// Reanimated ships an official Jest mock. It covers hooks + Animated.View.
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  // The mock's `call` is deprecated; silence its noop.
  Reanimated.default.call = () => {};
  return Reanimated;
});

// --- @react-native-async-storage/async-storage ------------------------------
// Native module is unavailable under Jest; use the library's official mock.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// --- expo-haptics ------------------------------------------------------------
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

// --- expo-linear-gradient ----------------------------------------------------
jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: View };
});

// --- expo-image --------------------------------------------------------------
jest.mock('expo-image', () => {
  const { Image } = require('react-native');
  return { Image };
});

// --- @sentry/react-native ----------------------------------------------------
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  setUser: jest.fn(),
}));

// Silence the native animation helper warning noise.
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
