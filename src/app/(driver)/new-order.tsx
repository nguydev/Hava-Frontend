import { useState } from 'react';
import { Keyboard, Pressable, View } from 'react-native';
import { router } from 'expo-router';

import { AppButton, Header, ScreenContainer, AppTextInput } from '@/components';
import { useCreateDelivery } from '@/services/mutations';
import type { Address } from '@/types';

export default function DriverNewOrder() {
  const { mutate: createDelivery, isPending } = useCreateDelivery();

  const [jobSite, setJobSite] = useState('');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!pickup || !dropoff) return;

    const mockAddress: Address = {
      id: `addr-${Date.now()}`,
      label: jobSite || 'Job Site Dropoff',
      line1: dropoff,
      city: 'Denver',
      state: 'CO',
      zip: '80202',
      contactName: contactName || 'Site Contact',
      contactPhone: contactPhone || '(555) 000-0000',
    };

    createDelivery(
      {
        jobSite: jobSite || pickup,
        company: 'GOODR Logistics Courier',
        contactName: contactName || 'Site Contact',
        contactPhone: contactPhone || '(555) 000-0000',
        address: mockAddress,
        preferredDate: date || new Date().toLocaleDateString(),
        timeWindow: time || 'Morning (8AM-12PM)',
        notes: `Pickup: ${pickup}\nNotes: ${notes}`,
        items: [
          {
            productId: 'custom-freight',
            name: `Courier Freight: ${pickup} → ${dropoff}`,
            brand: 'GOODR',
            quantity: 1,
            unitPrice: 0,
          },
        ],
      },
      {
        onSuccess: () => {
          router.replace('/(driver)/(tabs)/today');
        },
      }
    );
  };

  return (
    <ScreenContainer scroll keyboardAvoiding contentClassName="pb-10">
      <Header title="Add New Delivery Order" showBack />
      
      <Pressable onPress={Keyboard.dismiss} className="flex-1 mt-4">
        <View className="gap-3">
          <AppTextInput
            label="Job Site / Title"
            placeholder="e.g. Apex Medical Center or Site B"
            value={jobSite}
            onChangeText={setJobSite}
            icon="office-building-marker-outline"
          />
          <AppTextInput
            label="Pickup Location"
            placeholder="e.g. Supplier Warehouse Depot A"
            value={pickup}
            onChangeText={setPickup}
            icon="map-marker-outline"
          />
          <AppTextInput
            label="Dropoff Address / Location"
            placeholder="e.g. 14200 E Colfax Ave"
            value={dropoff}
            onChangeText={setDropoff}
            icon="map-marker-check-outline"
          />
          <AppTextInput
            label="Contact Person Name"
            placeholder="e.g. Michael Reyes"
            value={contactName}
            onChangeText={setContactName}
            icon="account-outline"
          />
          <AppTextInput
            label="Contact Phone"
            placeholder="e.g. (303) 555-0100"
            value={contactPhone}
            onChangeText={setContactPhone}
            icon="phone-outline"
            keyboardType="phone-pad"
          />
          <AppTextInput
            label="Preferred Date"
            placeholder="e.g. Today"
            value={date}
            onChangeText={setDate}
            icon="calendar-outline"
          />
          <AppTextInput
            label="Time Window"
            placeholder="e.g. 10:00 AM - 12:00 PM"
            value={time}
            onChangeText={setTime}
            icon="clock-outline"
          />
          <AppTextInput
            label="Additional Notes"
            placeholder="Gate codes, crane details, loading dock #..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            containerClassName="h-24"
          />

          <View className="mt-4">
            <AppButton
              label="Add Delivery to Route"
              loading={isPending}
              disabled={!pickup || !dropoff}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </Pressable>
    </ScreenContainer>
  );
}
