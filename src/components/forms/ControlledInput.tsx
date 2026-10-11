import { Control, FieldValues, Path, useController } from 'react-hook-form';

import { AppTextInput, AppTextInputProps } from '../ui/AppTextInput';

export interface ControlledInputProps<T extends FieldValues> extends AppTextInputProps {
  control: Control<T>;
  name: Path<T>;
}

export function ControlledInput<T extends FieldValues>({
  control,
  name,
  ...rest
}: ControlledInputProps<T>) {
  const { field, fieldState } = useController({ control, name });
  return (
    <AppTextInput
      value={field.value == null ? '' : String(field.value)}
      onChangeText={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
      {...rest}
    />
  );
}
