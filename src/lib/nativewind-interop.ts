/**
 * NativeWind auto-applies `className` to core React Native components, but NOT
 * to third-party components. We use `className` on a few of those (most
 * importantly `SafeAreaView`, which is the root of nearly every screen), so we
 * register them with cssInterop once, before anything renders.
 *
 * This module is imported for its side effects at the very top of the root
 * layout — keep that import first.
 */
import { cssInterop } from 'nativewind';
import { KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

cssInterop(SafeAreaView, { className: 'style' });
cssInterop(KeyboardAvoidingView, { className: 'style' });
