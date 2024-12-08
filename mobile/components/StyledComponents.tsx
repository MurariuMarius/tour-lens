import { Text as RNText, TextInput as RNTextInput, TextProps, TextInputProps, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export const Text = ({ style, ...props }: TextProps) => {
  const { textStyle } = useTheme();
  return <RNText style={[textStyle, style]} {...props} />;
};

type StyledButtonProps = {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export const Button = ({ title, onPress, style }: StyledButtonProps) => {
  const { textStyle } = useTheme();
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[{ padding: 10, backgroundColor: '#007AFF', borderRadius: 5 }, style]}
    >
      <Text style={[textStyle, { color: 'white', textAlign: 'center' }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
export const TextInput = ({ style, ...props }: TextInputProps) => {
  const { textStyle } = useTheme();
  return <RNTextInput style={[textStyle, style]} {...props} />;
};
