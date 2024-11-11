import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useState } from 'react';
import { ThemedText } from './ThemedText';

export type ThemedTextInputProps = {
  style?: StyleProp<ViewStyle>
  label?: string
  onChange: (val: string) => void
  placeholder?: string
};

export function ThemedTextInput({
  style,
  label,
  onChange,
  placeholder,
}: ThemedTextInputProps) {
  const textColor = useThemeColor({}, 'text');
  const [text, onChangeText] = useState<string>('')

  return (
    <View style={[style, styles.container]}>
        {label && <ThemedText style={{paddingBottom: 5}}>{label}</ThemedText>}
        <TextInput 
            style={{borderRadius: 5, borderColor: textColor, borderWidth: 2, padding: 10, color: textColor}}
            value={text}
            onChangeText={(val) => {
                onChangeText(val)
                onChange(val)
            }}
            placeholder={placeholder}
            placeholderTextColor={'#979fad'}
        />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 10
    }
});
