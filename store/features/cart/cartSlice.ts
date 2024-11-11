import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

export interface CartItem {
  id: string,
  name: string,
  image: string,
  type: string
  variation: string,
}

export interface StatefulCartItem extends CartItem {
  quantity: number
}
// Define a type for the slice state
interface CartState {
  items: StatefulCartItem[]
  orderPlaced: boolean
}

// Define the initial state using that type
const initialState: CartState = {
  items: [],
  orderPlaced: false
}

const findSavedItem = (items: StatefulCartItem[], payload: CartItem | StatefulCartItem) => items.find((e) => e.id === payload.id && e.variation === payload.variation)

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const saved = findSavedItem(state.items, action.payload)
      if(saved){
        state.items.splice(state.items.indexOf(saved), 1, {...saved, quantity: saved.quantity + 1})
      } else {
        state.items.push({...action.payload, quantity: 1})
      }
    },
    incrementItemQuantity: (state, action: PayloadAction<number>) => {
        const copy = {...state.items[action.payload]}
        state.items[action.payload] = {...copy, quantity: copy.quantity + 1}
    },
    decrementItemQuantity: (state, action: PayloadAction<number>) => {
      const copy = {...state.items[action.payload]}
      state.items[action.payload] = {...copy, quantity: copy.quantity - 1}
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
        state.items.splice(action.payload, 1)
    },
    clearCart: (state, action: PayloadAction) => {
      state.items = []
    },
    placeOrder: (state) => {
      state.orderPlaced = true
    },
    resetOrderStatus: (state) => {
      state.orderPlaced = false
    }
  },
})

export const { addItemToCart, removeItemFromCart, clearCart, incrementItemQuantity, decrementItemQuantity, placeOrder, resetOrderStatus } = cartSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectItems = (state: RootState) => state.cart.items
export const selectOrderComplete = (state: RootState) => state.cart.orderPlaced

export default cartSlice.reducer