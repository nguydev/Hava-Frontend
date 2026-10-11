import { Text } from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';

import { colors } from '@/theme';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel} style={{ backgroundColor: colors.card }}>
        <Dialog.Title style={{ color: colors.ink0, fontWeight: '700' }}>{title}</Dialog.Title>
        <Dialog.Content>
          <Text style={{ color: colors.ink2, lineHeight: 20 }}>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel} textColor={colors.ink2} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            onPress={onConfirm}
            textColor={destructive ? colors.alert : colors.heat}
            loading={loading}
            disabled={loading}
          >
            {confirmLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
