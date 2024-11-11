import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useState } from 'react';
import { ThemedText } from './ThemedText';

export type ThemedTextInputProps = {
  style?: StyleProp<ViewStyle>
  label?: string
  onChange: (val: string) => void
  placeholder?: string,
  error?: boolean
};

export function ThemedTextInput({
  style,
  label,
  onChange,
  placeholder,
  error
}: ThemedTextInputProps) {
  const textColor = useThemeColor({}, 'text');
  const [text, onChangeText] = useState<string>('')

  return (
    <View style={[style, styles.container]}>
        {label && <ThemedText style={{paddingBottom: 5}}>{label}</ThemedText>}
        <TextInput 
            style={[styles.textInputStyle, {color: textColor}, error ? {borderColor: 'red'} : {borderColor: textColor}]}
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
    },
    textInputStyle: {
      borderRadius: 5, 
      borderWidth: 2, 
      padding: 10,
    },
});
