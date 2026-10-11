/**
 * Opens the device photo library and returns the chosen image as a base64
 * data URI (ready for POST /uploads/base64), or null if the user cancels /
 * denies permission.
 *
 * expo-image-picker is imported dynamically so the app still runs if the native
 * module isn't installed yet (mirrors src/lib/push.ts); callers should treat a
 * null result as "no image selected".
 */
export async function pickImageAsDataUri(): Promise<string | null> {
  let ImagePicker: any;
  try {
    // @ts-ignore — optional native dep, may not be installed in this workspace yet
    ImagePicker = await import('expo-image-picker');
  } catch {
    return null; // native module not installed yet
  }

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (permission?.status !== 'granted') return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    quality: 0.6,
    base64: true,
  });

  if (result?.canceled) return null;
  const asset = result?.assets?.[0];
  if (!asset?.base64) return null;

  const mimeType = asset.mimeType ?? 'image/jpeg';
  return `data:${mimeType};base64,${asset.base64}`;
}

/** True when the native image-picker module is available in this build. */
export async function isImagePickerAvailable(): Promise<boolean> {
  try {
    // @ts-ignore — optional native dep
    await import('expo-image-picker');
    return true;
  } catch {
    return false;
  }
}
