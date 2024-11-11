
import { Stack } from 'expo-router';

export default function Cart() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="checkout" options={{headerBackTitleVisible: false, title: 'Checkout', headerTitleStyle: {fontSize: 30}}}/>
    </Stack>
  );
}