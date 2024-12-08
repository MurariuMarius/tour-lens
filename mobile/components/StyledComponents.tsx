import { Text as RNText, TextInput as RNTextInput, TextProps, TextInputProps, TouchableOpacity, StyleProp, ViewStyle, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/contexts/ThemeContext';

export const Text = ({ style, ...props }: TextProps) => {
  const { textStyle } = useTheme();
  return <RNText style={[textStyle, style]} {...props} />;
};

type StyledButtonProps = {
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  iconName?: any;
};

export const Button = ({ title, onPress, style, iconName }: StyledButtonProps) => { // Include iconName in props
  const { textStyle } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{ padding: 10, backgroundColor: '#007AFF', borderRadius: 15 }, style]}
    >
      <View style={styles.buttonContent}>
        {iconName && <Ionicons name={iconName} size={20} color="white" style={styles.buttonIcon} />}
        <Text style={[textStyle, { color: 'white', textAlign: 'center' }]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
  textInput: {
    borderRadius: 7,
  }
});

export const TextInput = ({ style, ...props }: TextInputProps) => {
  const { textStyle } = useTheme();
  return <RNTextInput style={[textStyle, styles.textInput, style]} {...props} />;
};
