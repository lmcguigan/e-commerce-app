import { Stack } from 'expo-router';


export default function ProductsLayout() {
  return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="detail" options={{headerBackTitleVisible: false, title: ''}}/>
      </Stack>
  );
}