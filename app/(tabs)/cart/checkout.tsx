import ThemedButton from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { placeOrder, selectItems, selectOrderComplete } from '@/store/features/cart/cartSlice';
import { useAppDispatch } from '@/store/hooks';
import { buildInitialFormState, Field, FormFieldNames, formReducer, UpdateFormField } from '@/utils/checkout-form-utils';
import { router } from 'expo-router';
import { useReducer, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export default function Checkout() {
  const insets = useSafeAreaInsets();
  const [formData, dispatchFormAction] = useReducer(formReducer, buildInitialFormState())
  const dispatch = useAppDispatch();
  const items = useSelector(selectItems)
  const orderComplete = useSelector(selectOrderComplete)
  const [errorFields, setErrorFields] = useState<FormFieldNames[]>([])
  const renderInputField = (field: Field) => {
    const formIndex = formData.fields.findIndex((e) => e.fieldName === field.fieldName)
    return <ThemedTextInput 
              key={`field-${formIndex}`}
              style={{flexGrow: 1}}
              label={field.fieldName.replace('_', ' ').toLocaleUpperCase()} 
              placeholder={field.placeholder}
              error={errorFields.includes(field.fieldName) ? true : false}
              onChange={(e) => {
                if(errorFields.includes(field.fieldName)){
                  const copy = [...errorFields].filter((f) => f !== field.fieldName)
                  setErrorFields(copy)
                }
                dispatchFormAction(new UpdateFormField({value: e, itemIndex: formIndex}))
              }}
            />
  }
  return (
    <ScrollView contentContainerStyle={{
      paddingTop: 15,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left + 20,
      paddingRight: insets.right + 20,
      flexGrow: 1,
    }}>
      {orderComplete ? 
      <View style={{flexGrow: 1, justifyContent: 'space-between', alignItems: 'center'}}>
        <ThemedText type='subtitle' style={{marginTop: 50}}>Your order is complete!</ThemedText>
          <Pressable style={{backgroundColor: 'purple', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15}} onPress={() => {
            // TODO - Reset the stack state
            router.replace('/(tabs)/products/')}}>
            <ThemedText style={{textAlign: 'center'}}>Back to shopping</ThemedText>
          </Pressable>
      </View> :
      <>
      <ThemedText type='subtitle'>Your order</ThemedText>
      {items.map((item, index) => 
        <View key={`${item.id}-${index}`} style={{paddingVertical: 5}}>
          <ThemedText><ThemedText style={{fontWeight: 'bold'}}>Item: </ThemedText>{item.name} - {item.variation}</ThemedText>
          <ThemedText><ThemedText style={{fontWeight: 'bold'}}>Quantity: </ThemedText>{item.quantity}</ThemedText>
        </View>)}
      <ThemedText style={{marginTop: 30}}>Please enter your payment and delivery information below.</ThemedText>
      <View style={{paddingVertical: 20}}>
        <ThemedText type='subtitle' style={{paddingBottom: 15}}>Contact Info</ThemedText>
        {formData.fields.slice(0, 3).map((field) => renderInputField(field))}
        <View style={{flexDirection: 'row', width: '100%', columnGap: 10, paddingBottom: 15}}>
          {formData.fields.slice(3, 6).map((field) => renderInputField(field))}
        </View>
      </View>
      <ThemedText type='subtitle' style={{paddingBottom: 15}}>Credit Card Information</ThemedText>
      {renderInputField(formData.fields[6])}
      <View style={{flexDirection: 'row', width: '100%', columnGap: 10, paddingBottom: 15}}>
      {formData.fields.slice(7, 10).map((field, i) => renderInputField(field))}
      </View>
      <ThemedButton type='flat' text='Place order' onPress={() => {
        if(formData.valid){
          dispatch(placeOrder())
        } else {
          const errors: FormFieldNames[] = []
          formData.fields.forEach((e) => e.valid === false && errors.push(e.fieldName))
          setErrorFields(errors)
          Alert.alert('Invalid form', 'Please correct the highlighted fields.')
        }
      }}/>
      </>
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({

});
