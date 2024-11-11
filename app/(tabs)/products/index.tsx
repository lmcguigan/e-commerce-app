import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { imageMap } from '@/data/data-utils';
import { Product } from '@/data/vos';
import { useThemeColor } from '@/hooks/useThemeColor';
import { addItemToCart } from '@/store/features/cart/cartSlice';
import { useProductListQuery } from '@/store/features/products/productsApiSlice';
import { useAppDispatch } from '@/store/hooks';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProductsList() {
  const borderColor = useThemeColor({}, 'text');
  const insets = useSafeAreaInsets();
  const {data, isLoading, isError, isSuccess} = useProductListQuery();
  const dispatch = useAppDispatch()
  const [filter, setFilter] = useState<string | undefined>(undefined)
  const products = useMemo(() => filter === undefined ? data: data?.filter(item => {
    return item.details.includes(filter) || item.type.includes(filter) || item.name.includes(filter)}), [data, filter])
  const renderProduct = (p: Product) => {
    const imgPath = imageMap[p.id as keyof typeof imageMap]
    return (
      <View style={[styles.itemContainerStyle, {borderColor}]} key={`product-${p.id}`}>
        <Link href={{pathname: '/products/detail', params: {...p}}} asChild>
        <Pressable style={{width: '100%'}}>
          <ThemedText style={{fontWeight: 'bold'}}>{p.name}</ThemedText>
          <Image resizeMode='contain' style={{width: 'auto', height: 70}} source={imgPath}/>
          <View style={{width: '100%', flexGrow: 1}}>
          <Pressable style={styles.quickAddBtn} onPress={() => {
            // note - since there are multiple variations I'm just using the first one as the default for the 'quick add' option
            const itemCopy = {...p, variation: p.variations[0]} as Partial<Product>
            delete itemCopy.variations
            dispatch(addItemToCart({...p, variation: p.variations[0]}))
            Alert.alert('Item added', 'Item added to cart!')
          }}>
            <Ionicons size={28} name='add'/>
          </Pressable>
          </View>
        </Pressable>
        </Link>
      </View>
    )
  }
  return (
    <View style={{
      paddingTop: insets.top + 30,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left + 20,
      paddingRight: insets.right + 20, 
      flex: 1
    }}>
        <ThemedText type='title' style={{marginBottom: 10}}>Shop Products</ThemedText>
        <ThemedTextInput label='Search products' onChange={(val) => setFilter(val)}/>
        <View style={{marginTop: 30, flex: 1, flexWrap: 'wrap', flexDirection: 'row', columnGap: 10}}>
          {isLoading && <ThemedText type='subtitle'>Loading...</ThemedText>}
          {(isSuccess && products) && products.map(p => renderProduct(p))}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainerStyle: {
    width: '30%', 
    flexGrow: 1,
    borderWidth: 1, 
    padding: 5,
    alignItems: 'center' 
  },
  quickAddBtn: {
    backgroundColor: 'purple', 
    borderRadius: 5, 
    // marginTop: 30, 
    alignSelf: 'flex-end',
  }
});
