import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { isImagePickerAvailable, pickImageAsDataUri } from '@/lib/imagePicker';
import { api } from '@/services/api';
import { toast } from '@/store/zustand';
import { colors } from '@/theme';
import { cn, haptics } from '@/utils';

/**
 * Photo uploader. Opens the device gallery via expo-image-picker, uploads the
 * chosen image to the backend (POST /uploads/base64) and appends the returned
 * server URL to `value`.
 */
export interface PhotoUploadBoxProps {
  value: string[];
  onChange: (photos: string[]) => void;
  label?: string;
  error?: string;
  max?: number;
}

export function PhotoUploadBox({
  value,
  onChange,
  label,
  error,
  max = 4,
}: PhotoUploadBoxProps) {
  const [uploading, setUploading] = useState(false);

  const add = async () => {
    if (uploading || value.length >= max) return;
    haptics.tap();

    if (!(await isImagePickerAvailable())) {
      toast.error('Image picker is unavailable in this build.');
      return;
    }

    setUploading(true);
    try {
      const dataUri = await pickImageAsDataUri();
      if (!dataUri) return; // cancelled or permission denied
      const { url } = await api.uploads.uploadImage(dataUri);
      onChange([...value, url]);
    } catch {
      toast.error('Could not upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const remove = (idx: number) => {
    haptics.select();
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <View className="mb-1">
      {label ? <Text className="text-ink-1 text-[13px] font-semibold mb-2">{label}</Text> : null}
      <View className="flex-row flex-wrap gap-3">
        {value.map((uri, i) => (
          <View key={`${uri}-${i}`} className="relative">
            <Image
              source={{ uri }}
              style={{ width: 84, height: 84, borderRadius: 14 }}
              contentFit="cover"
              transition={150}
            />
            <Pressable
              onPress={() => remove(i)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-alert items-center justify-center"
              hitSlop={6}
            >
              <MaterialCommunityIcons name="close" size={14} color={colors.white} />
            </Pressable>
          </View>
        ))}
        {value.length < max ? (
          <Pressable
            onPress={add}
            disabled={uploading}
            className={cn(
              'w-[84px] h-[84px] rounded-2xl items-center justify-center bg-card',
              'border-2 border-dashed',
            )}
            style={{ borderColor: error ? colors.alert : colors.hair }}
          >
            {uploading ? (
              <ActivityIndicator color={colors.heat} />
            ) : (
              <>
                <MaterialCommunityIcons name="camera-plus-outline" size={24} color={colors.heat} />
                <Text className="text-ink-3 text-[11px] mt-1">Add photo</Text>
              </>
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <View className="flex-row items-center mt-2">
          <MaterialCommunityIcons name="alert-circle" size={13} color={colors.alert} />
          <Text className="text-alert text-xs ml-1">{error}</Text>
        </View>
      ) : (
        <Text className="text-ink-3 text-xs mt-2">
          Tap to attach up to {max} photos from your gallery.
        </Text>
      )}
    </View>
  );
}
