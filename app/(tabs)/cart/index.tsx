import ThemedButton from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { imageMap } from '@/data/data-utils';
import { useThemeColor } from '@/hooks/useThemeColor';
import { clearCart, decrementItemQuantity, incrementItemQuantity, removeItemFromCart, selectItems } from '@/store/features/cart/cartSlice';
import { useAppDispatch } from '@/store/hooks';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export default function CartMain() {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const items = useSelector(selectItems)
  const color = useThemeColor({ }, 'text');
  const getImage = (id: any) => imageMap[id as keyof typeof imageMap]
  return (
    <View style={{
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left + 20,
      paddingRight: insets.right + 20, 
      flex: 1, 
      justifyContent: 'space-between'
    }}>
      <View style={{paddingTop: 30}}>
        <ThemedText type='title' style={{paddingBottom: 30}}>Your Cart</ThemedText>
        {items.length === 0 ? <ThemedText>Your cart is empty. Start shopping!</ThemedText> : 
          <FlatList
            data={items}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({item, index}) => 
            <View style={[{borderBottomColor: color}, styles.itemLine]}>
              <Image resizeMode='contain' style={{maxWidth: 100, height: 'auto'}} source={getImage(item.id)}/>
              <View style={{paddingHorizontal: 10, flexGrow: 1}}>
                <ThemedText><ThemedText style={{fontWeight: 'bold'}}>Item: </ThemedText>{item.name}</ThemedText>
                <ThemedText><ThemedText style={{fontWeight: 'bold'}}>Variation: </ThemedText>{item.variation}</ThemedText>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', flexGrow: 1, paddingHorizontal: 10}}>
                  <View style={[styles.adjustQuantityContainer, { borderColor: color }]}>
                      <Pressable onPress={() => {
                        if(item.quantity < 2){
                          dispatch(removeItemFromCart(index))
                        } else {
                          dispatch(decrementItemQuantity(index))
                        }
                      }}>
                        <Ionicons size={28} name={item.quantity < 2 ? 'trash-bin': 'remove'} color={color}/>
                      </Pressable>
                      <ThemedText style={{fontSize: 20}}>{item.quantity}</ThemedText>
                      <Pressable onPress={() => dispatch(incrementItemQuantity(index))}>
                        <Ionicons size={28} name='add' color={color}/>
                      </Pressable>
                  </View>
                  <Pressable style={[{borderColor: color}, styles.deleteBtn]} onPress={() => dispatch(removeItemFromCart(index))}>
                    <ThemedText>Delete</ThemedText>
                  </Pressable>
                </View>
              </View>
            </View>}
          />}
      </View>
      {items.length > 0 && <View style={{rowGap: 10, paddingHorizontal: 15}}>
        <Link href={{pathname: '/cart/checkout', params: {}}} asChild>
          <Pressable style={styles.checkoutBtn}>
            <ThemedText style={{textAlign: 'center'}}>Proceed to Checkout</ThemedText>
          </Pressable>
        </Link>
        <ThemedButton type='outline' text='Clear Cart' onPress={() => dispatch(clearCart())}/>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  checkoutBtn: {
    backgroundColor: 'purple', 
    width: '100%', 
    paddingHorizontal: 30, 
    paddingVertical: 15, 
    alignSelf: 'stretch', 
    borderRadius: 15
  },
  adjustQuantityContainer: {
    flexDirection: 'row', 
    borderWidth: 2, 
    borderRadius: 10, 
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 10,
    minWidth: 110,
  },
  deleteBtn: {
    borderWidth: 2, 
    borderRadius: 10, 
    alignSelf: 'flex-end', 
    padding: 12
  },
  itemLine: {
    borderBottomWidth: 1, 
    flexDirection: 'row', 
    paddingHorizontal: 5,
    paddingVertical: 15,

  }
});
