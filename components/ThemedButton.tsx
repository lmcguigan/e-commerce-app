import { Pressable, PressableProps, StyleSheet } from 'react-native';

import React, { Ref } from 'react';
import { ThemedText } from './ThemedText';

export type ThemedButtonProps = PressableProps & {
  type: 'flat' | 'outline';
  text: string
};

const ThemedButton = React.forwardRef((props: ThemedButtonProps, ref: Ref<any>) => {
  const {type, text, ...rest} = props

  return (
    <Pressable ref={ref} style={[styles[type], styles.base]} {...rest}>
        <ThemedText style={{textAlign: 'center'}}>{text}</ThemedText>
    </Pressable>
  );
})

const styles = StyleSheet.create({
    flat: {
        backgroundColor: 'purple'
    },
    outline: {
        borderColor: 'purple',
        borderWidth: 2,
    },
    base: {
        width: '100%', 
        paddingHorizontal: 30, 
        paddingVertical: 15, 
        alignSelf: 'stretch', 
        borderRadius: 15
    }
});

export default ThemedButton