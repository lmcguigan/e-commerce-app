import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import cartReducer from './features/cart/cartSlice'
import { productsApi } from './features/products/productsApiSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [productsApi.reducerPath]:  productsApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsApi.middleware)
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch