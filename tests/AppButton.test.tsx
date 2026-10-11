import { fireEvent, render, screen } from '@testing-library/react-native';

import { AppButton } from '@/components/ui/AppButton';

describe('AppButton', () => {
  it('renders its label', () => {
    render(<AppButton label="Submit request" onPress={() => {}} />);
    expect(screen.getByText('Submit request')).toBeOnTheScreen();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<AppButton testID="btn" label="Tap me" onPress={onPress} />);
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress while loading', () => {
    const onPress = jest.fn();
    render(<AppButton testID="btn" label="Loading" loading onPress={onPress} />);
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
    // label is replaced by the spinner while loading
    expect(screen.queryByText('Loading')).toBeNull();
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<AppButton testID="btn" label="Disabled" disabled onPress={onPress} />);
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
