import ThemedButton from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { placeOrder, selectItems, selectOrderComplete } from '@/store/features/cart/cartSlice';
import { useAppDispatch } from '@/store/hooks';
import { buildInitialFormState, Field, formReducer, UpdateFormField } from '@/utils/checkout-form-utils';
import { useReducer, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export default function Checkout() {
  const insets = useSafeAreaInsets();
  const [formData, dispatchFormAction] = useReducer(formReducer, buildInitialFormState())
  const dispatch = useAppDispatch();
  const items = useSelector(selectItems)
  const orderComplete = useSelector(selectOrderComplete)
  const [errorFields, setErrorFields] = useState<number[]>([])
  console.log(formData)
  const renderInputField = (field: Field, index: number) => {
    return <ThemedTextInput 
              key={`field-${index}`}
              style={{flexGrow: 1}}
              label={field.fieldName.replace('_', ' ').toLocaleUpperCase()} 
              placeholder={field.placeholder}
              onChange={(e) => {
                if(errorFields.includes(index)){
                  const copy = [...errorFields]
                  setErrorFields(copy.splice(copy.indexOf(index), 1))
                }
                dispatchFormAction(new UpdateFormField({value: e, itemIndex: index}))
              }}
            />
  }
  return (
    <ScrollView contentContainerStyle={{
      paddingTop: 15,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left + 20,
      paddingRight: insets.right + 20,
    }}>
      {orderComplete ? <>
        <ThemedText>Your order is complete!</ThemedText>
      </> :
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
        {formData.fields.slice(0, 3).map((field, i) => renderInputField(field,i))}
        <View style={{flexDirection: 'row', width: '100%', columnGap: 10, paddingBottom: 15}}>
          {formData.fields.slice(3, 6).map((field, i) => renderInputField(field,i))}
        </View>
      </View>
      <ThemedText type='subtitle' style={{paddingBottom: 15}}>Credit Card Information</ThemedText>
      {renderInputField(formData.fields[6], 6)}
      <View style={{flexDirection: 'row', width: '100%', columnGap: 10, paddingBottom: 15}}>
      {formData.fields.slice(7, 10).map((field, i) => renderInputField(field,i))}
      </View>
      <ThemedButton type='flat' text='Place order' onPress={() => {
        if(formData.valid){
          dispatch(placeOrder())
        } else {
          const errors: number[] = []
          formData.fields.forEach((e, i) => e.valid === false && errors.push(i))
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
