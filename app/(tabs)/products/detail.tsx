import { ThemedText } from '@/components/ThemedText';
import { imageMap } from '@/data/data-utils';
import { addItemToCart } from '@/store/features/cart/cartSlice';
import { useAppDispatch } from '@/store/hooks';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProductsList() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{id: string, details: string, image: string, name: string, type: string, variations: string}>();
  const {details, id, image, name, type, variations} = params
  const [variation, setVariation] = useState<string>(String(variations).split(',')[0])
  const variationsArray = String(variations).split(',')
  const imgPath = imageMap[id as keyof typeof imageMap]
  return (
    <View style={{
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left + 20,
      paddingRight: insets.right + 20, 
      flex: 1
    }}>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Image source={imgPath}/>
        <ThemedText style={{fontSize: 25, paddingTop: 20}}>{name}</ThemedText>
        <View style={{alignItems: 'flex-start', width: '100%', marginVertical: 30}}>
          <ThemedText><ThemedText style={{fontWeight: 'bold'}}>Description: </ThemedText>{details}</ThemedText>
          <ThemedText><ThemedText style={{fontWeight: 'bold'}}>Category: </ThemedText>{type}</ThemedText>
        </View>
        <View style={{flexDirection: 'row', columnGap: 10}}>
          {variationsArray.map((v, i) => {
            return (
              <Pressable style={[styles.variationButton, variation === v && styles.variationSelectedButton]} onPress={() => setVariation(v)} key={`variation-${i}-${v}`}>
                <ThemedText>{v}</ThemedText>
              </Pressable>
            )
          })}
        </View>
        </View>
        <Pressable style={styles.addToCartButton} onPress={() => {
          dispatch(addItemToCart({id, name, image, type, variation}))
          router.replace('/(tabs)/cart/')
        }}>
          <ThemedText style={{textAlign: 'center'}}>Add to Cart</ThemedText>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  variationButton: {
    borderColor: 'purple', 
    borderWidth: 3, 
    borderRadius: 15, 
    paddingHorizontal: 20, 
    paddingVertical: 10
  },
  variationSelectedButton: {
    backgroundColor: 'purple',
  },
  addToCartButton: {
    backgroundColor: 'purple', 
    width: '100%', 
    paddingHorizontal: 30, 
    paddingVertical: 15, 
    alignSelf: 'stretch', 
    borderRadius: 15
  }
});
