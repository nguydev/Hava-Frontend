import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppBackground, AppButton, BrandBanner, BrandLockup, Reveal } from '@/components';
import { APP } from '@/constants';
import { BRAND_IMAGES } from '@/lib/brandImages';
import { colors } from '@/theme';
import { withAlpha } from '@/utils';

const FEATURES: { icon: keyof typeof MaterialCommunityIcons.glyphMap; title: string; sub: string }[] = [
  { icon: 'lightning-bolt', title: 'Fast equipment ordering', sub: 'Browse, price, and order HVAC gear in minutes.' },
  { icon: 'map-marker-radius', title: 'Live delivery tracking', sub: 'Real-time ETAs and photo proof of delivery.' },
  { icon: 'file-document-edit-outline', title: 'Specialized quotes', sub: 'Request pricing on rooftops, boilers & more.' },
];

export default function Welcome() {
  return (
    <View className="flex-1 bg-transparent">
      <AppBackground glow />
      <SafeAreaView edges={['top', 'bottom']} className="flex-1">
        <View className="flex-1 px-6 justify-between">
          {/* Scrollable brand + intro so content never overflows small screens */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 12 }}
            showsVerticalScrollIndicator={false}
          >
            <Reveal>
              <BrandBanner source={BRAND_IMAGES.hero} className="mb-6" />
            </Reveal>

            <Reveal index={1}>
              <BrandLockup size={44} subtitle="B2B Ordering & Delivery" className="mb-6" />
            </Reveal>

            <Reveal index={2}>
              <Text className="text-ink-0 text-[30px] font-extrabold leading-[36px]">
                HVAC equipment,{'\n'}
                <Text style={{ color: colors.brandCyan }}>delivered right.</Text>
              </Text>
              <Text className="text-ink-2 text-base mt-3 leading-6">{APP.tagline}</Text>
            </Reveal>

            <View className="mt-8 gap-4">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} index={i + 3}>
                  <View className="flex-row items-center">
                    <View
                      className="w-11 h-11 rounded-2xl items-center justify-center mr-3.5"
                      style={{ backgroundColor: withAlpha(colors.brandBlue, 0.16) }}
                    >
                      <MaterialCommunityIcons name={f.icon} size={22} color={colors.brandCyan} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-ink-0 text-[15px] font-semibold">{f.title}</Text>
                      <Text className="text-ink-2 text-[13px] mt-0.5">{f.sub}</Text>
                    </View>
                  </View>
                </Reveal>
              ))}
            </View>
          </ScrollView>

          <Reveal index={6}>
            <View className="gap-3 pt-4 pb-2">
              <AppButton
                label="Contractor Login"
                icon="account-hard-hat"
                onPress={() => router.push('/(auth)/login?role=contractor')}
              />
              <AppButton
                label="Driver Login"
                icon="truck-outline"
                variant="secondary"
                onPress={() => router.push('/(auth)/login?role=driver')}
              />
              <AppButton
                label="Create an account"
                variant="ghost"
                onPress={() => router.push('/(auth)/register')}
              />
            </View>
          </Reveal>
        </View>
      </SafeAreaView>
    </View>
  );
}
