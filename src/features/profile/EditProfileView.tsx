import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import {
  AppButton,
  Avatar,
  BottomSheet,
  ControlledInput,
  Header,
  ScreenContainer,
  SheetOption,
} from '@/components';
import { isImagePickerAvailable, pickImageAsDataUri } from '@/lib/imagePicker';
import { api } from '@/services/api';
import { useUpdateProfile } from '@/services/mutations';
import { toast, useAuthStore } from '@/store/zustand';
import { colors } from '@/theme';
import { editProfileSchema, type EditProfileValues } from '@/validation/schemas';

export function EditProfileView() {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const { mutate, isPending } = useUpdateProfile();

  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const pickAvatar = async () => {
    setPhotoOpen(false);
    if (!(await isImagePickerAvailable())) {
      toast.error('Photo picker is unavailable in this build.');
      return;
    }
    setUploading(true);
    try {
      const dataUri = await pickImageAsDataUri();
      if (!dataUri) return; // cancelled or permission denied
      const { url } = await api.uploads.uploadImage(dataUri);
      setAvatar(url);
    } catch {
      toast.error('Could not upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const { control, handleSubmit } = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      company: user?.company ?? '',
      businessType: user?.businessType ?? '',
      address: user?.address ?? '',
      vehicle: user?.vehicle ?? '',
    },
  });

  const onSubmit = (values: EditProfileValues) => {
    const base = { name: values.name, email: values.email, phone: values.phone, avatar };
    const patch =
      role === 'driver'
        ? { ...base, vehicle: values.vehicle }
        : {
            ...base,
            company: values.company,
            businessType: values.businessType,
            address: values.address,
          };
    mutate(patch, { onSuccess: () => router.back() });
  };

  return (
    <ScreenContainer scroll keyboardAvoiding contentClassName="pb-10">
      <Header title="Edit profile" />

      {/* Profile photo */}
      <View className="items-center mt-2 mb-5">
        <Pressable onPress={() => setPhotoOpen(true)} className="relative">
          <Avatar name={user?.name ?? 'User'} uri={avatar} size={96} />
          <View
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center border-2"
            style={{ backgroundColor: colors.brandBlue, borderColor: colors.bg }}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <MaterialCommunityIcons name="camera" size={16} color={colors.white} />
            )}
          </View>
        </Pressable>
        <Pressable onPress={() => setPhotoOpen(true)} hitSlop={6} className="mt-2">
          <Text className="text-heat text-[13px] font-semibold">Change photo</Text>
        </Pressable>
      </View>

      <View className="gap-1">
        <ControlledInput
          control={control}
          name="name"
          label={role === 'driver' ? 'Full name' : 'Contact name'}
          icon="account-outline"
        />
        <ControlledInput
          control={control}
          name="email"
          label="Email"
          icon="email-outline"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <ControlledInput
          control={control}
          name="phone"
          label="Phone"
          icon="phone-outline"
          keyboardType="phone-pad"
        />

        {role === 'driver' ? (
          <ControlledInput
            control={control}
            name="vehicle"
            label="Vehicle"
            icon="truck-outline"
            placeholder="Isuzu NPR · GD-7"
          />
        ) : (
          <>
            <ControlledInput
              control={control}
              name="company"
              label="Company"
              icon="office-building-outline"
            />
            <ControlledInput
              control={control}
              name="businessType"
              label="Business type"
              icon="briefcase-outline"
              placeholder="Commercial Contractor"
            />
            <ControlledInput
              control={control}
              name="address"
              label="Business address"
              icon="map-marker-outline"
              placeholder="Street, City, State ZIP"
            />
          </>
        )}
      </View>

      <View className="mt-6">
        <AppButton
          label="Save changes"
          icon="content-save-outline"
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
        />
      </View>

      <BottomSheet visible={photoOpen} onClose={() => setPhotoOpen(false)} title="Profile photo">
        <SheetOption
          label="Choose from library"
          description="Pick a photo from your gallery"
          onPress={pickAvatar}
        />
        {avatar ? (
          <SheetOption
            label="Remove photo"
            description="Use your initials instead"
            onPress={() => {
              setAvatar(undefined);
              setPhotoOpen(false);
            }}
          />
        ) : null}
      </BottomSheet>
    </ScreenContainer>
  );
}
