import { Tabs, usePathname } from 'expo-router';
import React, { useEffect } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { clearCart, resetOrderStatus, selectOrderComplete } from '@/store/features/cart/cartSlice';
import { useAppDispatch } from '@/store/hooks';
import { useSelector } from 'react-redux';

export default function TabLayout() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const orderComplete = useSelector(selectOrderComplete)
  useEffect(() => {
    // clear cart and reset orderComplete after navigating away from confirmation page
    if(pathname !== '/cart/checkout' && orderComplete){
      dispatch(resetOrderStatus())
      dispatch(clearCart())
    }
  }, [pathname])
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen name="index" redirect/>
      <Tabs.Screen
        name="products"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'pricetags' : 'pricetags-outline'} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'My Cart',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cart' : 'cart-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
